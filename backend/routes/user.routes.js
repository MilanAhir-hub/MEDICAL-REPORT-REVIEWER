import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { getUserProfile } from "../controllers/profileController.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/schemas.js";

const router = express.Router();

//let write the route to editable profile
router.put('/edit', protect, validate(updateProfileSchema), async(req, res)=>{
     try {
         const {
            name, email, language
         } = req.body;

         const user = await User.findById(req.user.id);

         if (!user) {
             return res.status(404).json({
                 message: "User not found"
             });
         }

         // update only allowed fields
         if(name) user.name = name;
         if(email) user.email = email;
         if(language) user.language = language;

         await user.save();

         res.json({
             success: true,
             message: "Profile updated successfully",
             data: {
                 name: user.name,
                 email: user.email,
                 language: user.language,
             },
         });
     } catch (err) {
         res.status(500).json({
             message: "Server error"
         });
     }
})

// route to get the user profile
router.get('/profile', protect, getUserProfile);


export default router;