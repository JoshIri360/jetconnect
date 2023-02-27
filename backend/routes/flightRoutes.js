const express = require("express");
const flightController = require("../controllers/flightController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(flightController.getAllFlights)
  .post(flightController.createFlight);

router
  .route("/:id")
  .get(flightController.getFlight)
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);

module.exports = router;
