const appError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};

const handleDuplicateErrorDB = () => {
  const message = `Duplicate value error`;
  return new appError(message, 400);
};

const handleValidationError = (err) => {
  const message = err.message.split(",")[0].split(":")[2].trim();
  return new appError(message, 400);
};

const handleJWTError = () =>
  new appError("Invalid authentication token !!! Please try again", 401);
const handleTokenExpireError = () =>
  new appError("Authentication token expired !!! Try again", 401);

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") devError(err, res);
  else {
    let error = { ...err };
    if (err.stack.startsWith("CastError")) error = handleCastErrorDB(error);
    else if (err.code === 11000) error = handleDuplicateErrorDB();
    else if (err.message.includes("validation failed")) {
      error.message = err.message;
      error = handleValidationError();
    } else if (error.name == "JsonWebTokenError") error = handleJWTError(error);
    else if (error.name == "TokenExpiredError")
      error = handleTokenExpireError();
    if (!error.message) {
      error.message = err.message;
    }
    prodError(error, res);
  }
};
