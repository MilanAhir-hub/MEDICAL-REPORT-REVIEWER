import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/report.routes.js';
import connectDB from "./config/db.js";
import { generateCsrfToken, csrfProtection } from './middleware/csrf.js';
import mongoose from "mongoose";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ── Rate Limiters ─────────────────────────────────────────────────────────────

// Strict limiter for auth endpoints (prevent brute-force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,                    // 20 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});

// General limiter for all other API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});

// ── Middleware ─────────────────────────────────────────────────────────────────

// Request correlation ID
app.use((req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    res.setHeader('x-correlation-id', req.correlationId);
    next();
});

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

connectDB();

// ── Health Check ──────────────────────────────────────────────────────────────

app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: dbStatus,
        uptime: process.uptime(),
        correlationId: req.correlationId,
    });
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authLimiter, generateCsrfToken, csrfProtection, authRoutes);
app.use("/api/user", apiLimiter, generateCsrfToken, csrfProtection, userRoutes);
app.use("/api", apiLimiter, generateCsrfToken, csrfProtection, uploadRoutes);

// ── Serve Frontend in Production ──────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.join(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production" && fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(frontendDistPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Server running");
    });
}

// ── Start Server ──────────────────────────────────────────────────────────────

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
