const express = require("express");
const router = express.Router();
const storyApi = require("../api/storyApi");
const { authenticateToken } = require("../utilities");

router.post("/add-travel-story", authenticateToken, storyApi.addTravelStory);
router.get("/get-all-stories", authenticateToken, storyApi.getAllStories);
router.put("/edit-story/:id", authenticateToken, storyApi.editStory);
router.delete("/delete-story/:id", authenticateToken, storyApi.deleteStory);
router.put("/update-is-favourite/:id", authenticateToken, storyApi.updateIsFavourite);
router.get("/search", authenticateToken, storyApi.searchStories);
router.get("/filter", authenticateToken, storyApi.filterStories);

module.exports = router;