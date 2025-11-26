import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import { getChaptersRepoSingleton } from "../repositories/ChapterRepository.js";
import { ajv } from "../validation/ajv.js";
import {
  chapterCreateSchema,
  chapterPatchSchema,
} from "../validation/chapter-schema.js";

let serviceSingleton;

export const getChaptersServiceSingleton = () => {
  if (!serviceSingleton) {
    serviceSingleton = new ChaptersService();
  }
  return serviceSingleton;
};

class ChaptersService {
  #repo;

  constructor() {
    this.#repo = getChaptersRepoSingleton();
    ajv.addSchema(chapterCreateSchema, "create-chapter");
    ajv.addSchema(chapterPatchSchema, "patch-chapter");
  }

  async createNewChapter(dtoIn, bookId, userId) {
    if (!userId) {
      throw new AuthError("Missing author id");
    }
    const validate = ajv.getSchema("create-chapter");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }
    const dtoOut = this.#repo.createNewChapter(dtoIn, bookId, userId);
    return dtoOut;
  }

  async getChapterById(bookId, chapterId) {
    try {
      const book = await this.#repo.getChapterById(bookId, chapterId);
      return book;
    } catch (e) {
      console.log("[BookService] - error: ", e);
      throw e;
    }
  }

  async updateChapterById(bookId, authorId, chapterId, dtoIn) {
    if (!authorId) {
      throw new AuthError("Missing author id");
    }
    const validate = ajv.getSchema("patch-chapter");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }
    try {
      const updatedChapter = await this.#repo.updateChapterById(
        bookId,
        authorId,
        chapterId,
        dtoIn
      );
      return updatedChapter;
    } catch (e) {
      console.log("[ChaptersService] - error: ", e);
      throw e;
    }
  }

  async deleteChapterById(bookId, chapterId, authorId) {
    if (!authorId) {
      throw new AuthError("Missing author id");
    }
    await this.#repo.deleteChapterById(bookId, chapterId, authorId);
  }
}
