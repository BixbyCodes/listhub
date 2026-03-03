const jwt  = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Local Register ──────────────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ email }))    return res.status(409).json({ message: "Email already in use" });
    if (await User.findOne({ username })) return res.status(409).json({ message: "Username already taken" });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

// ── Local Login ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Google-only users have no password
    if (user.authProvider === "google" && !user.password) {
      return res.status(401).json({ message: "This account uses Google Sign-In. Please login with Google." });
    }

    if (!(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      token: signToken(user._id),
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

// ── Google OAuth Callback ───────────────────────────────────────────────────
// Called by passport after Google redirects back
const googleCallback = (req, res) => {
  try {
    const token = signToken(req.user._id);
    // Redirect to frontend with token in URL — frontend extracts it
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// ── Get current user ────────────────────────────────────────────────────────
const getMe = (req, res) =>
  res.json({
    user: {
      id:       req.user._id,
      username: req.user.username,
      email:    req.user.email,
      avatar:   req.user.avatar,
    },
  });

module.exports = { register, login, googleCallback, getMe };
