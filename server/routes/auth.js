const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post("/register", limiter, [
  body("username").trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
], register);

router.post("/login", limiter, [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
], login);

router.get("/me", protect, getMe);

module.exports = router;
