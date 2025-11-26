import { getChaptersServiceSingleton } from "../../../services/ChapterService.js";
import { serverError } from "../../../const/default-errors.js";
import { AuthError } from "../../../errors/auth.js";
import { DatabaseError } from "../../../errors/database.js";
import { ValidationError } from "../../../errors/validation.js";

export const deleteChapterById = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const authorId = req.headers["x-author-id"];
    const service = getChaptersServiceSingleton();
    await service.deleteChapterById(bookId, chapterId, authorId);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    if (err instanceof AuthError) {
      res.status(err.status).json({
        errors: err.errors,
        message: err.message,
        code: err.code,
      });
    } else if (err instanceof ValidationError) {
      res.status(err.status).json({
        errors: err.errors,
        message: err.message,
        code: err.code,
      });
    } else if (err instanceof DatabaseError) {
      res.status(err.status).json({
        message: err.message,
        code: err.code,
      });
    } else {
      res.status(500).json(serverError);
    }
  }
};
