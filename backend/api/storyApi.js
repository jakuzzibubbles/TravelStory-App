const TravelStory = require("../models/travelStory.model");

exports.addTravelStory = async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate)
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });
    await travelStory.save();
    res.status(201).json({ story: travelStory, message: "Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllStories = async (req, res) => {
  const { userId } = req.user;
  try {
    const travelStories = await TravelStory.find({ userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({ stories: travelStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.editStory = async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;
  if (!title || !story || !visitedLocation || !visitedDate)
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory)
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    const placeholderImgUrl = `http://localhost:8000/assets/Travel.png`;
    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;
    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory)
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    await travelStory.deleteOne({ _id: id, userId });
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "../uploads", filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image file:", err);
    });
    res.status(200).json({ message: "Travel Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.updateIsFavourite = async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory)
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    travelStory.isFavourite = isFavourite;
    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.searchStories = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;
  if (!query)
    return res.status(404).json({ error: true, message: "Query is required" });
  try {
    const searchResults = await TravelStory.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.filterStories = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;
  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));
    const filteredStories = await TravelStory.find({
      userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
