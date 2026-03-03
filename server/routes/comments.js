const express = require("express");
const { body } = require("express-validator");
const { getComments, addComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent

router.get("/",    getComments);
router.post("/",   protect, [body("text").trim().isLength({ min: 1, max: 500 })], addComment);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
