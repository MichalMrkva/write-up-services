import { serverError } from "../../const/default-errors.js";
import { AuthError } from "../../errors/auth.js";
import { DatabaseError } from "../../errors/database.js";
import { ValidationError } from "../../errors/validation.js";
import { getCommentsServiceSingleton } from "../../services/CommentsService.js";

export const createComment = async (req, res) => {
  try {
    const service = getCommentsServiceSingleton();
    const { chapterId } = req.params;
    const userId = req.headers["x-user-id"];
    const username = req.headers["x-user-username"];
    const dtoIn = req.body;

    const dtoOut = await service.createComment(
      chapterId,
      userId,
      username,
      dtoIn
    );
    res.status(201).json(dtoOut);
  } catch (err) {
    console.error(err);
    if (
      err instanceof AuthError ||
      err instanceof ValidationError ||
      err instanceof DatabaseError
    ) {
      res.status(err.status).json({
        errors: err.errors,
        message: err.message,
        code: err.code,
      });
    } else {
      res.status(500).json(serverError);
    }
  }
};
