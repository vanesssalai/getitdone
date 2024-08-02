const express = require("express");
const router = express.Router();
const { fetchProfile } = require("../controllers/UsersController.cjs");

router.get("/:userID", fetchProfile);

module.exports = router;