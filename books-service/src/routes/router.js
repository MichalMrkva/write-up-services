import express from "express";

const router = express.Router();

router.route("/api/v1/books").get().post();
router.route("/api/v1/books/:bookId").get().post();
router.route("/api/v1/books/:bookId/chapter/:chapterId").get().post();

export default router;
