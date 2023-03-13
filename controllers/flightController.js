const Flight = require("../models/flightModel");
const { getOne, getAll } = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllFlights = getAll(Flight);

exports.getFlight = getOne(Flight);

exports.createFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      flight,
    },
  });
});

exports.updateFlight = catchAsync(async (req, res, next) => {
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
});

exports.deleteFlight = catchAsync(async (req, res, next) => {
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
});

exports.updatePrice = catchAsync(async (req, res, next) => {
  const { id, class: className } = req.params;
  const price = req.body.price;

  const flight = await Flight.findById(id);

  if (!flight) {
    return next(new AppError("Flight Not Found", 404));
  }

  if (!flight.prices[className]) {
    return next(new AppError("Invalid Class", 404));
  }

  flight.prices[className] = price;
  await flight.save();

  res.status(200).json({
    status: "success",
    data: flight,
  });
});
