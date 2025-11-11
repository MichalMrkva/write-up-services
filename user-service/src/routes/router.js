const express = require("express");
const router = express.Router();
const loginController = require("./routes/login");
const registerController = require("./routes/register");

router.post("/api/v1/register", registerController);
router.post("/api/v1/token/login", loginController);

module.exports = router;