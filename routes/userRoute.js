const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Example protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected user profile",
    user: req.user, // comes from decoded JWT
  });
});

module.exports = router;
