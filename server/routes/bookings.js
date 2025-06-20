const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const { verifyToken } = require("../middleware/auth");
const razorpay = require("../utils/razorpay");

// ✅ GET /api/bookings - Get all bookings for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("listing");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

// ✅ POST /api/bookings/create-order - Create Razorpay order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// ✅ POST /api/bookings - Save booking after successful payment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const newBooking = new Booking({
      user: req.user.id,
      listing: listingId,
      checkIn,
      checkOut,
      guests
    });

    await newBooking.save();
    res.status(201).json({ message: "✅ Booking successful!" });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ message: "❌ Booking failed" });
  }
});

module.exports = router;
