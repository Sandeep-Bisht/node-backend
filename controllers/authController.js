const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate OTP
exports.generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with expiry in DB
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // valid 5 mins
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }
    await user.save();

    // Later we can send via email/SMS
    return res.status(200).json({
      message: "OTP generated successfully",
      otp, // ⚠️ in real-world don’t send OTP in response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP & Generate Token
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, "secret123", {
      expiresIn: "1h",
    });

    // Clear OTP once verified
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
