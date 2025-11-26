import express from "express";
import { postBook } from "./books/post-book.js";
import { getBooks } from "./books/get-book.js";
import { getBookById } from "./books/get-book-by-id.js";
import { deleteBookById } from "./books/delete-book-by-id.js";
import { patchBookById } from "./books/patch-book-by-id.js";

const router = express.Router();
router.route("/healt").get((req, res) => {
  res.status(204).end();
});
router.route("/api/v1/books").post(postBook).get(getBooks);
router
  .route("/api/v1/books/:bookId")
  .get(getBookById)
  .delete(deleteBookById)
  .patch(patchBookById);

router.route("/api/v1/books/:bookId/chapter/:chapterId");

export default router;
