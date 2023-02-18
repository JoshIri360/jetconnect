const Flight = require("../models/flightModel");

exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find();
    res.status(200).json({
      status: "success",
      results: flights.length,
      data: {
        flights,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({
        status: "fail",
        message: "Flight not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        flight,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        flight,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      return res.status(404).json({
        status: "fail",
        message: "Flight not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        flight,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({
        status: "fail",
        message: "Flight not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
