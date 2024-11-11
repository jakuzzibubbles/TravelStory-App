const express = require("express");
const router = express.Router();
const imageApi = require("../api/imageApi");
const upload = require("../multer");

router.post("/upload-image", upload.single("image"), imageApi.imageUpload);
router.delete("/delete-image", imageApi.deleteImage);

module.exports = router;
