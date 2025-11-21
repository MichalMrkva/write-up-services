import express from "express";
import multer from "multer";
const router = express.Router();

import { create } from "./profile/create.js";
import { get } from "./profile/get.js";
import { update } from "./profile/update.js";
import { upload } from "./profile/upload.js";


const uploadMiddleware = multer({ storage: multer.memoryStorage() });

router.post("/api/v1/profile", create);
router.get("/api/v1/profile", get);
router.patch("/api/v1/profile", update);


router.post("/api/v1/profile/upload", uploadMiddleware.single("avatar"), upload);

export default router;
