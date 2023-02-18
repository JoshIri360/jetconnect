const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("DB connection successful");
});
// Start the server
const PORT = process.env.PORT || 5000;

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
