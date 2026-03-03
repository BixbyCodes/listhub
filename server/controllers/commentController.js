const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Listing = require("../models/Listing");

// GET /api/listings/:id/comments — public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ listing: req.params.id })
      .sort({ createdAt: -1 })
      .populate("creator", "username avatar")
      .lean();

    res.json({ comments });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// POST /api/listings/:id/comments — protected
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Make sure listing exists
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const comment = await Comment.create({
      text:    req.body.text,
      listing: req.params.id,
      creator: req.user._id,
    });

    await comment.populate("creator", "username avatar");

    res.status(201).json({ comment });
  } catch (e) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// DELETE /api/comments/:id — protected, owner only
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only the comment creator can delete it
    if (!comment.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = { getComments, addComment, deleteComment };
