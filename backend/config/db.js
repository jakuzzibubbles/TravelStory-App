const mongoose = require("mongoose");
const config = require("./config.json");

// Updated MongoDB connection without deprecated options
mongoose.connect(config.connectionString);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB: ", err);
});
