require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// DB connection
require("./config/db");

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
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel-stories", travelStoryRoutes);

module.exports = app;
