const TravelStory = require("../models/travelStory.model");

// Add travel story
exports.addTravelStory = async (req, res) => {
  try {
    const { title, description, location, tags } = req.body;
    const userId = req.user.userId;

    if (!title || !description || !location) {
      return res
        .status(400)
        .json({ message: "Title, description, and location are required" });
    }

    const newStory = new TravelStory({
      userId,
      title,
      description,
      location,
      tags,
      createdAt: new Date(),
    });

    const savedStory = await newStory.save();
    return res
      .status(201)
      .json({ message: "Travel story added successfully", data: savedStory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding travel story", error: error.message });
  }
};

// Get all stories
exports.getAllTravelStories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stories = await TravelStory.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ data: stories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching travel stories", error: error.message });
  }
};

// Edit story
exports.editTravelStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, location, tags } = req.body;

    const updatedStory = await TravelStory.findOneAndUpdate(
      { _id: id, userId },
      { title, description, location, tags },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Travel story not found" });
    }

    return res
      .status(200)
      .json({
        message: "Travel story updated successfully",
        data: updatedStory,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating travel story", error: error.message });
  }
};

// Delete story
exports.deleteTravelStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedStory = await TravelStory.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedStory) {
      return res.status(404).json({ message: "Travel story not found" });
    }

    return res
      .status(200)
      .json({ message: "Travel story deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting travel story", error: error.message });
  }
};

// Update isPinned value
exports.updateIsFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { isFavourite } = req.body;

    const updatedStory = await TravelStory.findOneAndUpdate(
      { _id: id, userId },
      { isFavourite },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Travel story not found" });
    }

    return res
      .status(200)
      .json({ message: "Favourite status updated", data: updatedStory });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error updating favourite status",
        error: error.message,
      });
  }
};

// Search stories
exports.searchTravelStories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const stories = await TravelStory.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json({ data: stories });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error searching travel stories",
        error: error.message,
      });
  }
};

// Filter stories
exports.filterTravelStories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { location, tags } = req.query;

    let filter = { userId };
    if (location) {
      filter.location = location;
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const stories = await TravelStory.find(filter);
    return res.status(200).json({ data: stories });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error filtering travel stories",
        error: error.message,
      });
  }
};

// Upload image
exports.imageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    
    return res
      .status(200)
      .json({
        message: "Image uploaded successfully",
        filePath: req.file.path,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};
