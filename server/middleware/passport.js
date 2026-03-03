/**
 * middleware/passport.js
 * Configures Google OAuth strategy.
 * On success: find or create user in DB, then generate JWT.
 */

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email    = profile.emails[0].value;
        const avatar   = profile.photos[0]?.value || "";
        const googleId = profile.id;

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId });

        if (!user) {
          // Check if email already registered with local auth
          user = await User.findOne({ email });

          if (user) {
            // Link Google to existing account
            user.googleId     = googleId;
            user.authProvider = "google";
            user.avatar       = avatar;
            await user.save();
          } else {
            // Brand new user — create account
            // Generate a unique username from their Google display name
            let baseUsername = profile.displayName.replace(/\s+/g, "_").toLowerCase();
            let username     = baseUsername;
            let count        = 1;

            // Keep trying until we find a unique username
            while (await User.findOne({ username })) {
              username = `${baseUsername}_${count++}`;
            }

            user = await User.create({
              username,
              email,
              avatar,
              googleId,
              authProvider: "google",
              // No password for Google users
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
