import express from "express";
const router = express.Router();
import axios from 'axios';
import logger from '../utils/logger.js';
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import protect from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/schemas.js';

// step 1: Redirect user to Google
router.get("/google", (req, res) => {
    // this is the googles official endpoint, that gives authoriation code that will exchange later for the token exchange. we ask for permission of basic profile information and email
    const googleAuthURL =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=" + process.env.GOOGLE_CLIENT_ID +
        "&redirect_uri=" + process.env.GOOGLE_REDIRECT_URI +
        "&response_type=code" +
        "&scope=profile email";

    res.redirect(googleAuthURL);
});
// step 2: we get the code at the url

// step 3: Exchange code for tokens
router.get("/google/callback", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({
            message: "Code not found"
        });
    }

    try {
        // step 3: exchange code for tokens
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token", {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
                code: code,
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // step 4: fetch user profile using access token
        const userResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const googleUser = userResponse.data;

        //let save user into the database
        let user = await User.findOne({googleId: googleUser.id});

        if (!user) {
            //If not exists - create new user
            user = await User.create({
                googleId: googleUser.id,
                name: googleUser.name,
                email: googleUser.email,
                avatar: googleUser.picture,
                provider: 'google'
            });
        }

        const token = generateToken(user);
        logger.info(`Google OAuth login success — userId: ${user._id}`);
        // Set token in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to dashboard after successful Google login
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/userProfile`);
    } catch (error) {
        res.status(500).json({
            message: "Google auth failed",
            error: error.response?.data || error.message,
        });
    }
});

//let set login, signup and logout routes
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe); // Get current user

export default router;