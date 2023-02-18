const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.ObjectId,
    ref: "Passenger",
    required: [true, "A passenger must be included"]
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: "Flight",
    required: [true, "A flight must be included"]
  },
  seat_number: {
    type: String,
    required: [true, "A seat number must be included"]
  },
  booking_time: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    required: [true, "A status must be included"],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A user must be included"]
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
