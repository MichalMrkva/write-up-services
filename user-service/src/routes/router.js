const express = require("express");
const router = express.Router();
import{login} from"./routes/login";
import {register} from "./routes/register";

router.post("/api/v1/register", register);
router.post("/api/v1/token/login", login);

module.exports = router;