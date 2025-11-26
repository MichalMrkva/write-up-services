import { getChaptersServiceSingleton } from "../../../services/ChapterService.js";
import { serverError } from "../../../const/default-errors.js";
import { AuthError } from "../../../errors/auth.js";
import { DatabaseError } from "../../../errors/database.js";
import { ValidationError } from "../../../errors/validation.js";

export const postChapter = async (req, res) => {
  try {
    const service = getChaptersServiceSingleton();
    const bookId = req.params.bookId;
    const dtoIn = req.body;
    const authorId = req.headers["x-author-id"];
    const dtoOut = await service.createNewChapter(dtoIn, bookId, authorId);
    res.status(201).json(dtoOut);
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
