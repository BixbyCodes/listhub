const express = require("express");
const { body } = require("express-validator");
const { getListings, createListing, voteListing } = require("../controllers/listingController");
const { protect } = require("../middleware/auth");
const { CATEGORIES } = require("../models/Listing");

const router = express.Router();

router.get("/", getListings);

router.post("/", protect, [
  body("title").trim().isLength({ min: 3, max: 100 }),
  body("description").trim().isLength({ min: 10, max: 2000 }),
  body("category").isIn(CATEGORIES),
  body("discordInfo").optional().trim().isLength({ max: 100 }),
], createListing);

router.post("/:id/vote", protect, voteListing);

module.exports = router;
