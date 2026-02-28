const { validationResult } = require("express-validator");
const Listing = require("../models/Listing");
const PAGE_SIZE = 10;

const getListings = async (req, res) => {
  try {
    const { page = 1, sort = "votes", category, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * PAGE_SIZE;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];

    let listings, total;
    if (sort === "votes") {
      listings = await Listing.aggregate([
        { $match: filter },
        { $addFields: { voteCount: { $size: "$votes" } } },
        { $sort: { voteCount: -1, createdAt: -1 } },
        { $skip: skip }, { $limit: PAGE_SIZE },
        { $lookup: { from: "users", localField: "creator", foreignField: "_id", as: "creator" } },
        { $unwind: "$creator" },
        { $project: { title: 1, description: 1, category: 1, discordInfo: 1, votes: 1, voteCount: 1, createdAt: 1, "creator._id": 1, "creator.username": 1 } },
      ]);
    } else {
      listings = (await Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).populate("creator", "username").lean())
        .map((l) => ({ ...l, voteCount: l.votes.length }));
    }
    total = await Listing.countDocuments(filter);
    res.json({ listings, pagination: { total, page: pageNum, pages: Math.ceil(total / PAGE_SIZE) } });
  } catch (e) { res.status(500).json({ message: "Failed to fetch listings" }); }
};

const createListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const listing = await Listing.create({ ...req.body, creator: req.user._id });
    await listing.populate("creator", "username");
    res.status(201).json({ listing: { ...listing.toJSON(), voteCount: 0 } });
  } catch (e) { res.status(500).json({ message: "Failed to create listing" }); }
};

const voteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    const userId = req.user._id;
    const hasVoted = listing.votes.some((v) => v.equals(userId));
    if (hasVoted) listing.votes = listing.votes.filter((v) => !v.equals(userId));
    else listing.votes.push(userId);
    await listing.save();
    res.json({ message: hasVoted ? "Vote removed" : "Vote added", voteCount: listing.votes.length, voted: !hasVoted });
  } catch (e) { res.status(500).json({ message: "Failed to vote" }); }
};

module.exports = { getListings, createListing, voteListing };
