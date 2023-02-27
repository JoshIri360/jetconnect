const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("DB connection successful");
});
// Start the server
const PORT = process.env.PORT || 5000;

// app.use((err, req, res, next) => {
//   if (err.name === 'MongoServerError' && err.code === 11000) {
//     return res.status(400).send('Duplicate email address');
//   }
//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).send('Unauthorized');
//   }
//   if (err.name === 'ValidationError') {
//     return res.status(400).send(err.message);
//   }

// });

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting Down");
  server.close(() => {
    process.exit();
  });
});
