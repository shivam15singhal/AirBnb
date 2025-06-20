const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { verifyToken } = require("../middleware/auth");

// @route   GET /api/listings
// @desc    Get all listings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Server error while fetching listings" });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error while fetching listing" });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing (Host only)
// @access  Private
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, location, price, image } = req.body;

    const newListing = new Listing({
      title,
      description,
      location,
      price,
      image,
      host: req.user.id, // from JWT middleware
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update a listing (Host only)
// @access  Private
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.host.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to edit this listing" });

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedListing);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Failed to update listing" });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing (Host only)
// @access  Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.host.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to delete this listing" });

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ message: "Failed to delete listing" });
  }
});

module.exports = router;
