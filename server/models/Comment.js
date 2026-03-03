const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text:    { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
}, { timestamps: true });

// Index for fast lookup of comments by listing
CommentSchema.index({ listing: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", CommentSchema);
