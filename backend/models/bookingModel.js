const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A user must be included"],
  },
  passengerName: {
    type: String,
    required: [true, "Passenger name must be included"],
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: "Flight",
    required: [true, "A flight must be included"],
  },
  seatNumber: {
    type: String,
    required: [true, "A seat number must be included"],
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    required: [true, "A status must be included"],
    default: "pending",
  },
  flightType: {
    type: String,
    enum: ["economy", "premium", "business", "first"],
    required: [true, "A flight type must be included"],
    default: "economy",
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
