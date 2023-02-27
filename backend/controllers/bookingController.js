const Booking = require("../models/bookingModel");
const Flight = require("../models/flightModel");
const catchAsync = require("../utils/catchAsync");
const { getOne, getAll } = require("./handlerFactory");

exports.createBooking = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create({
    user: req.user._id,
    flight: req.body.flightId,
    seatNumber: req.body.seatNumber,
    flightType: req.body.flightType,
    bookingTime: new Date(),
    status: "pending",
    price: 0,
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

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getBookingsByUser = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id; // assuming you have user id in the request object
    const bookings = await Booking.find({ user: userId });
    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
});

exports.getBooking = getOne(Booking, { path: "flight" });

exports.updateBooking = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
