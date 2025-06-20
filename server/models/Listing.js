const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  availableDates: [Date]
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
