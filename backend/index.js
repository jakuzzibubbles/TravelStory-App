require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// DB connection
mongoose.connect(process.env.MONGO_URI);

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const travelStoryRoutes = require("./routes/travelStory.routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve static files from the uploads and assets directories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Use routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/travel-stories", travelStoryRoutes);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Listen to the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
