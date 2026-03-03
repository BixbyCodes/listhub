const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, minlength: 6, select: false }, // optional — Google users have no password
  avatar:   { type: String, default: "" },                 // Google profile picture
  googleId: { type: String, default: "" },                 // Google OAuth ID
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
}, { timestamps: true });

// Only hash password if it exists and was modified (local auth users)
UserSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
