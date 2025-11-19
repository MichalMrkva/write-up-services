import express from "express";
const router = express.Router();
import { create } from "./profile/create.js";
import { get } from "./profile/get.js";


router.post("/api/v1/profile", create);
router.get("/api/v1/profile",get)


export default router;