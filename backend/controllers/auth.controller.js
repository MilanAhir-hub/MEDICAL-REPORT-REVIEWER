import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import tokenBlacklistModel from '../models/tokenBlacklist.js';
import generateToken from '../utils/generateToken.js';
import logger from '../utils/logger.js';

export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            });
        }

        // check existence of user
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // store hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user in db
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'local',
        });

        logger.info(`New user registered: ${user._id}`);

        // auto login after signup
        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        logger.error('Signup error', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed!',
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required!"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Handle Google-auth users
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account was created using Google login. Please use Google Sign-In."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        logger.info(`User logged in: ${user._id}`);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token: token
        });

    } catch (error) {
        logger.error('Login error', error);
        res.status(500).json({
            success: false,
            message: "Login failed!",
        });
    }
};

// Stateless logout using token blacklist
export const logout = async (req, res) => {
    const token = req.token;

    await tokenBlacklistModel.create({
        token,
        expiresAt: new Date(req.user.exp * 1000)
    });

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    logger.info(`User logged out: ${req.user.id}`);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
    });
};

// Get current user — works with httpOnly cookie
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                provider: user.provider,
                language: user.language
            }
        });
    } catch (error) {
        logger.error('getMe error', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user data',
        });
    }
};