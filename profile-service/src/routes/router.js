import express from "express";
const router = express.Router();
import { create } from "./profile/create.js";
import { get } from "./profile/get.js";
import { update } from "./profile/update.js";

router.post("/api/v1/profile", create);
router.get("/api/v1/profile",get)
router.patch("/api/v1/profile",update)


export default router;