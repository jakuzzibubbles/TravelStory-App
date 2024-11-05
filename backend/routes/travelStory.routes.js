const express = require("express");
const router = express.Router();
const travelStoryController = require("../controllers/travelStory.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const upload = require("../utilities/multer");

router.post("/add", authenticateToken, travelStoryController.addTravelStory);
router.get(
  "/get-all",
  authenticateToken,
  travelStoryController.getAllTravelStories
);
router.put(
  "/edit/:id",
  authenticateToken,
  travelStoryController.editTravelStory
);
router.delete(
  "/delete/:id",
  authenticateToken,
  travelStoryController.deleteTravelStory
);
router.put(
  "/update-is-favourite/:id",
  authenticateToken,
  travelStoryController.updateIsFavourite
);
router.get(
  "/search",
  authenticateToken,
  travelStoryController.searchTravelStories
);
router.get(
  "/filter",
  authenticateToken,
  travelStoryController.filterTravelStories
);
router.post(
  "/image-upload",
  upload.single("image"),
  travelStoryController.imageUpload
);
router.delete("/delete-image", travelStoryController.deleteImage);

module.exports = router;
