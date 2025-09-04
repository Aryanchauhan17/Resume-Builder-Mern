// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User"); // import User model

const router = express.Router();

//register route 
router.post("/register", registerUser);

//login route 
router.post("/login", loginUser);

//profile route (fetch full user info)
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            message: "User profile accessed successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
