const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

// Dummy login route
router.post("/login", (req, res) => {
    const { username } = req.body;

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

// Protected route
router.get("/dashboard", auth, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        user: req.user
    });
});

module.exports = router;