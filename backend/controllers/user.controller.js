const User = require("../models/user.model");

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
} catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


