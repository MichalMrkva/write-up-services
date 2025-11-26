import { getChaptersServiceSingleton } from "../../../services/ChapterService.js";
import { serverError } from "../../../const/default-errors.js";
import { AuthError } from "../../../errors/auth.js";
import { DatabaseError } from "../../../errors/database.js";
import { ValidationError } from "../../../errors/validation.js";

export const getChapterById = async (req, res) => {
  try {
    const service = getChaptersServiceSingleton();
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const dtoOut = await service.getChapterById(bookId, chapterId);
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
