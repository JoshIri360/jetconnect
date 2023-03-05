const Booking = require("../models/bookingModel");
const Flight = require("../models/flightModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getOne, getAll, getRandomStr } = require("./handlerFactory");

exports.getAllBookings = getAll(Booking);
exports.getBooking = getOne(Booking, { path: "flight" });

exports.createBooking = catchAsync(async (req, res, next) => {
  if (!(await Flight.findById(req.body.flightId)))
    return next(new AppError("Flight not found", 404));

  const newBooking = await Booking.create({
    user: req.user._id,
    flight: req.body.flightId,
    seatNumber: req.body.seatNumber,
    flightType: req.body.flightType,
    bookingTime: new Date(),
    status: "pending",
    price: 0,
    ticketNumber: getRandomStr(),
    passengerName:
      `${req.user.firstName} ${req.user.lastName}` || req.body.passengerName,
  });

  await newBooking.populate("flight").then(async () => {
    newBooking.price = newBooking.flight.prices[newBooking.flightType];
    return await newBooking.save();
  });

  res.status(201).json({
    status: "success",
    data: {
      booking: newBooking,
    },
  });
});

exports.getBookingsByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // assuming you have user id in the request object
  const bookings = await Booking.find({ user: userId });
  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBooking) {
    return res.status(404).json({
      status: "fail",
      message: "Booking not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedBooking = await Booking.findByIdAndDelete(id);
  if (!deletedBooking) {
    return res.status(404).json({
      status: "fail",
      message: "Booking not found",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
