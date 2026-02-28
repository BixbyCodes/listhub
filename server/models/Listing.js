const mongoose = require("mongoose");

const CATEGORIES = ["General","Gaming","Technology","Art & Design","Music","Education","Business","Other"];

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  category: { type: String, required: true, enum: CATEGORIES },
  discordInfo: { type: String, trim: true, maxlength: 100, default: "" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

ListingSchema.virtual("voteCount").get(function () { return this.votes.length; });
ListingSchema.set("toJSON", { virtuals: true });
ListingSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Listing", ListingSchema);
module.exports.CATEGORIES = CATEGORIES;
