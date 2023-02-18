const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  flight_number: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departure_time: {
    type: Date,
    required: true,
  },
  arrival_time: {
    type: Date,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_seats: {
    type: Number,
    required: true,
  },
  available_seats: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Flight", flightSchema);
