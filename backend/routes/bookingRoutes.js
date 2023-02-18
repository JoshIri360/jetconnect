const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

// Middleware function to check if user has permission to access a booking

router
  .route("/")
  .get(authController.restrictTo("admin"), bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.get("/my-bookings", bookingController.getBookingsByUser);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
