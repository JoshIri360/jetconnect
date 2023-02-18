const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res, next) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        booking: newBooking,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
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
};

exports.getBookingsByUser = async (req, res, next) => {
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
};

exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err);
  }
};

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
