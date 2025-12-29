import { serverError } from "../../const/default-errors.js";
import { AuthError } from "../../errors/auth.js";
import { DatabaseError } from "../../errors/database.js";
import { getCommentsServiceSingleton } from "../../services/CommentsService.js";

export const getComments = async (req, res) => {
  try {
    const service = getCommentsServiceSingleton();
    const { chapterId } = req.params;

    const dtoOut = await service.getCommentsByChapter(chapterId);
    res.status(200).json(dtoOut);
  } catch (err) {
    console.error(err);
    if (err instanceof AuthError || err instanceof DatabaseError) {
      res.status(err.status).json({
        message: err.message,
        code: err.code,
      });
    } else {
      res.status(500).json(serverError);
    }
  }
};