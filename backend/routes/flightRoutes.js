const express = require("express");
const flightController = require("../controllers/flightController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(flightController.getAllFlights)
  .post(
    authController.restrictTo("admin"),
    flightController.createFlight
  );

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(
    authController.restrictTo("admin"),
    flightController.updateFlight
  )
  .delete(
    authController.restrictTo("admin"),
    flightController.deleteFlight
  );

module.exports = router;
