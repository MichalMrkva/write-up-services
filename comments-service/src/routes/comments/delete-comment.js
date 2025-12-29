import { serverError } from "../../const/default-errors.js";
import { AuthError } from "../../errors/auth.js";
import { DatabaseError } from "../../errors/database.js";
import { ValidationError } from "../../errors/validation.js";
import { getCommentsServiceSingleton } from "../../services/CommentsService.js";

export const deleteComment = async (req, res) => {
  try {
    const service = getCommentsServiceSingleton();
    const { commentId } = req.params;
    const userId = req.headers["x-user-id"];

    await service.deleteComment(commentId, userId);
    res.status(204).send();
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
