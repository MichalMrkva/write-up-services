import express from "express";
import { postBook } from "./books/post-book.js";

const router = express.Router();

router.route("/api/v1/books").post(postBook);
router.route("/api/v1/books/:bookId");
router.route("/api/v1/books/:bookId/chapter/:chapterId");

export default router;
