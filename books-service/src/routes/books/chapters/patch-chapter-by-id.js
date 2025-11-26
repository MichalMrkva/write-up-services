import { serverError } from "../../../const/default-errors.js";
import { AuthError } from "../../../errors/auth.js";
import { DatabaseError } from "../../../errors/database.js";
import { ValidationError } from "../../../errors/validation.js";
import { getChaptersServiceSingleton } from "../../../services/ChapterService.js";

export const patchChapterById = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const authorId = req.headers["x-author-id"];
    const chapterId = req.params.chapterId;
    const dtoIn = req.body;
    const service = getChaptersServiceSingleton();
    const dtoOut = await service.updateChapterById(
      bookId,
      authorId,
      chapterId,
      dtoIn
    );
    res.status(200).json(dtoOut);
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
