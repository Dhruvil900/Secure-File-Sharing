const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },  // This is what becomes req.user.id
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN || '1d' }
  );
};

exports.registerUser = async (req, res) => {
  const { email, password, firstName, lastName, gender, birthdate } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    console.log("Submitted password:", password);
    console.log("User found:", user);
    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log("Password match:", isMatch);
    }
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send token
    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Add to authController.js
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
