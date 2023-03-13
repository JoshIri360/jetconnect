const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

// Middleware function to check if user has permission to access a booking

router.use(authController.protect);

router
  .route("/")
  .post(bookingController.createBooking)
  .get(authController.restrictTo("admin"), bookingController.getAllBookings);

router.get("/myBookings", bookingController.getBookingsByUser);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
