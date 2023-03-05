const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  prices: {
    economy: {
      type: Number,
      required: true,
    },
    premium: {
      type: Number,
      required: true,
    },
    business: {
      type: Number,
      required: true,
    },
    first: {
      type: Number,
      required: true,
    },
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
});

flightSchema.index({ flightNumber: 1 }, { unique: true });

module.exports = mongoose.model("Flight", flightSchema);
