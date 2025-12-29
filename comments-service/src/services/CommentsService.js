import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import { getCommentRepoSingleton } from "../repositories/comment_repository.js";
import { ajv } from "../validation/ajv.js";
import {
  commentCreateSchema,
  commentPatchSchema,
} from "../validation/comment-schema.js";

let serviceSingleton;

export const getCommentsServiceSingleton = () => {
  if (!serviceSingleton) {
    serviceSingleton = new CommentsService();
  }
  return serviceSingleton;
};

class CommentsService {
  #repo;

  constructor() {
    this.#repo = getCommentRepoSingleton();
    ajv.addSchema(commentCreateSchema, "create-comment");
    ajv.addSchema(commentPatchSchema, "patch-comment");
  }

  async createComment(chapterId, userId, dtoIn) {
    if (!userId) {
      throw new AuthError("Missing user id");
    }

    const validate = ajv.getSchema("create-comment");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }

    try {
      const dtoOut = await this.#repo.createComment(chapterId, userId, dtoIn);
      return dtoOut;
    } catch (e) {
      console.log("[CommentsService] - error: ", e);
      throw e;
    }
  }

  async getCommentsByChapter(chapterId) {
    try {
      const comments = await this.#repo.getCommentsByChapter(chapterId);
      return comments;
    } catch (e) {
      console.log("[CommentsService] - error: ", e);
      throw e;
    }
  }

  async deleteComment(commentId, userId) {
    if (!userId) {
      throw new AuthError("Missing user id");
    }
    
    try {
      await this.#repo.deleteComment(commentId, userId);
    } catch (e) {
      console.log("[CommentsService] - error: ", e);
      throw e;
    }
  }

  async updateComment(commentId, userId, dtoIn) {
    if (!userId) {
      throw new AuthError("Missing user id");
    }

    const validate = ajv.getSchema("patch-comment");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }

    try {
      const updatedComment = await this.#repo.updateComment(
        commentId,
        userId,
        dtoIn
      );
      return updatedComment;
    } catch (e) {
      console.log("[CommentsService] - error: ", e);
      throw e;
    }
  }
}