const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

// Middleware function to check if user has permission to access a booking

router
  .route("/")
  .post(authController.protect, bookingController.createBooking)
  .get(authController.restrictTo("admin"), bookingController.getAllBookings);

router.get(
  "/my-bookings",
  authController.protect,
  bookingController.getBookingsByUser
);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
