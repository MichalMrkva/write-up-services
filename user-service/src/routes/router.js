import express from "express";
const router = express.Router();

import { login } from "./users/login.js";
import { register } from "./users/register.js";


router.post("/api/v1/register", register);
router.post("/api/v1/token/login", login);

export default router;