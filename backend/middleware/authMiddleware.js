import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    try {
        // Read token from cookie
        const token = req.cookies.token;
  
        req.token = token; //attach token with the user request
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user id to request
        req.user = decoded; // { userId }

        // Allow next middleware / controller
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token",
        });
    }
};

export default protect;