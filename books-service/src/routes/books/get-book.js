import { serverError } from "../../const/default-errors.js";
import { AuthError } from "../../errors/auth.js";
import { DatabaseError } from "../../errors/database.js";
import { ValidationError } from "../../errors/validation.js";
import { getBooksServiceSingleton } from "../../services/BooksService.js";

export const getBooks = async (req, res) => {
  try {
    const query = {
      authorId: req.query.authorId,
      name: req.query.name,
      genre: req.query.genre,
      offset: parseInt(req.query.offset) || 0,
      limit: parseInt(req.query.limit) || 50,
    };
    const service = getBooksServiceSingleton();
    const dtoOut = await service.getBooks(query);
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
