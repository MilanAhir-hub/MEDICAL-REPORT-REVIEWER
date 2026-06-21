import express from "express";
const router = express.Router();
import axios from 'axios';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import protect from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/schemas.js';

// step 1: Redirect user to Google with state parameter
router.get("/google", (req, res) => {
    const state = crypto.randomBytes(32).toString('hex');
    // Store state in a cookie for validation on callback
    res.cookie('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000,
    });

    const googleAuthURL =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=" + process.env.GOOGLE_CLIENT_ID +
        "&redirect_uri=" + process.env.GOOGLE_REDIRECT_URI +
        "&response_type=code" +
        "&scope=profile email" +
        "&state=" + state;

    res.redirect(googleAuthURL);
});
// step 2: we get the code at the url

// step 3: Validate state and exchange code for tokens
router.get("/google/callback", async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies.oauth_state;

    if (!code) {
        return res.status(400).json({
            message: "Code not found"
        });
    }

    if (!state || !storedState || state !== storedState) {
        return res.status(400).json({
            message: "Invalid state parameter. Possible CSRF attack."
        });
    }

    // Clear the state cookie
    res.clearCookie('oauth_state');

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
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to dashboard after successful Google login
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/userProfile`);
    } catch (error) {
        logger.error('Google auth error', error);
        res.status(500).json({
            message: "Google authentication failed",
        });
    }
});

//let set login, signup and logout routes
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe); // Get current user

export default router;