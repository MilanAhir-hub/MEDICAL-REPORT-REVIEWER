import User from "../models/User.js";

export const getUserProfile = async (req, res, next) => {
  try {
    // req.user only contains { id, role } from JWT token
    // We need to fetch the full user from database
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role || "user",
        language: user.language,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
