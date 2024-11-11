const fs = require("fs");
const path = require("path");

exports.imageUpload = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: true, message: "No image uploaded" });
  const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};

exports.deleteImage = async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl)
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
