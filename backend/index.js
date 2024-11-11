require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const storyRoutes = require("./routes/storyRoutes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// DB connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Serve static files from the uploads and assets directories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));


app.use("/api", userRoutes);
app.use("/api", imageRoutes);
app.use("/api", storyRoutes);


// Listen to the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
