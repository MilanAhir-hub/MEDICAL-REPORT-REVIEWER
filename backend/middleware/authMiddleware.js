import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/tokenBlacklist.js";

const protect = async (req, res, next) => {
    try {
        // Read token from cookie or Authorization header
        let token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
  
        req.token = token;
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing",
            });
        }

        // Check if token is blacklisted
        const blacklisted = await tokenBlacklistModel.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({
                message: "Not authorized, token has been invalidated",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user id to request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token",
        });
    }
};

export default protect;