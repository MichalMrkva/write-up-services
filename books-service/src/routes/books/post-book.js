import { serverError } from "../../const/default-errors.js";
import { AuthError } from "../../errors/auth.js";
import { DatabaseError } from "../../errors/database.js";
import { ValidationError } from "../../errors/validation.js";
import { getBooksServiceSingleton } from "../../services/BooksService.js";

export const postBook = async (req, res) => {
  const service = getBooksServiceSingleton();
  const dtoIn = req.body;
  const authorId = req.headers["x-author-id"];
  try {
    const dtoOut = await service.createBook(dtoIn, authorId);
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
