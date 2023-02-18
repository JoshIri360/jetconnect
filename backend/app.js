const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Set security HTTP
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests
const limiter = rateLimit({
  max: 400,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//Reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSQL Query Injections
app.use(mongoSanitize());

//Data sanitization against XXS
app.use(xss());

//Log Requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/flights", require("./routes/flightRoutes"));
app.use("/api/v1/bookings", require("./routes/bookingRoutes"));

module.exports = app;
