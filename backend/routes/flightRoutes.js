const express = require("express");
const flightController = require("../controllers/flightController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", flightController.getAllFlights);
router.get("/:id", flightController.getFlight);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.post("/", flightController.createFlight);

router
  .route("/:id")
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);

//PATCH /flights/:id/prices/:class
router.patch("/:id/prices/:class", flightController.updatePrice);

module.exports = router;
