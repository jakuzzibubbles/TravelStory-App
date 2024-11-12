const express = require("express");
const router = express.Router();
const userApi = require("../api/userApi");
const { authenticateToken } = require("../utilities");

router.post("/signup", userApi.createAccount);
router.post("/login", userApi.login);
router.get("/user", authenticateToken, userApi.getUser);



module.exports = router;
