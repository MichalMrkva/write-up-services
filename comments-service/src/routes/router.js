import express from "express";

import { createComment } from "./comments/post-comment-by-id.js";
import { getComments } from "./comments/get-comments.js";
import { patchComment } from "./comments/patch-comment.js";
import { deleteComment } from "./comments/delete-comment.js";

const router = express.Router();

router.route("/healt").get((req, res) => {
  res.status(204).end();
});

router
  .route("/api/v1/books/:bookId/chapters/:chapterId/comments")
  .post(createComment)
  .get(getComments);

router
  .route("/api/v1/books/:bookId/chapters/:chapterId/comments/:commentId")
  .patch(patchComment)
  .delete(deleteComment);

export default router;
