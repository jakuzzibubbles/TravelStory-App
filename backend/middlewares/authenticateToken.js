// authenticateToken.js

const jwt = require("jsonwebtoken");

// Middleware function to authenticate the token
module.exports = (req, res, next) => {
  // Retrieve the token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no token, return an error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // Attach the user info to the request object
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  });
};
