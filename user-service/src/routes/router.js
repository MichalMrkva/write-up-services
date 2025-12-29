import express from "express";
const router = express.Router();

import { login } from "./users/login.js";
import { register } from "./users/register.js";
import { signout } from "./users/signout.js";
import { refresh } from "./users/refresh.js";
import { getBlacklist } from "./users/getBlacklist.js";


router.post("/api/v1/user/register", register);
router.post("/api/v1/user/token/login", login);
router.post("/api/v1/user/signout",signout)
router.get("/api/v1/user/token/refresh",refresh)
router.get("/api/v1/user/getBlacklist",getBlacklist)

export default router;