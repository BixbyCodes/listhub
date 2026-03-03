const express  = require("express");
const passport = require("../middleware/passport");
const { body }  = require("express-validator");
const { register, login, googleCallback, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const rateLimit   = require("express-rate-limit");

const router  = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Local auth
router.post("/register", limiter, [
  body("username").trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
], register);

router.post("/login", limiter, [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
], login);

// Google OAuth — step 1: redirect to Google
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Google OAuth — step 2: Google redirects back here
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

router.get("/me", protect, getMe);

module.exports = router;
