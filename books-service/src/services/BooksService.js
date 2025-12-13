import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import { getBookRepoSingleton } from "../repositories/BooksRepository.js";
import { ajv } from "../validation/ajv.js";
import {
  bookCreateSchema,
  bookPatchSchema,
} from "../validation/book-schema.js";

let serviceSingleton;

export const getBooksServiceSingleton = () => {
  if (!serviceSingleton) {
    serviceSingleton = new BooksService();
  }
  return serviceSingleton;
};

class BooksService {
  #repo;

  constructor() {
    this.#repo = getBookRepoSingleton();
    ajv.addSchema(bookCreateSchema, "create-book");
    ajv.addSchema(bookPatchSchema, "patch-book");
  }

  async createBook(dtoIn, userId) {
    if (!userId) {
      throw new AuthError("Missing author id");
    }
    const validate = ajv.getSchema("create-book");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }
    const dtoOut = this.#repo.createNewBook(dtoIn, userId);
    return dtoOut;
  }

  async getBooks(query) {
    try {
      const books = await this.#repo.getBooks(query);
      return books;
    } catch (e) {
      console.log("[BookService] - error: ", e);
      throw e;
    }
  }

  async getBookById(bookId) {
    try {
      const book = await this.#repo.getBookById(bookId);
      return book;
    } catch (e) {
      console.log("[BookService] - error: ", e);
      throw e;
    }
  }

  async deleteBookById(bookId, userId) {
    if (!userId) {
      throw new AuthError("Missing author id");
    }
    await this.#repo.deleteBookById(bookId, userId);
  }

  async updateBookById(bookId, userId, dtoIn) {
    if (!userId) {
      throw new AuthError("Missing author id");
    }
    const validate = ajv.getSchema("patch-book");
    const isValid = await validate(dtoIn);
    if (!isValid) {
      throw new ValidationError(validate.errors);
    }
    try {
      const updatedBook = await this.#repo.updateBookById(
        bookId,
        userId,
        dtoIn
      );
      return updatedBook;
    } catch (e) {
      console.log("[BookService] - error: ", e);
      throw e;
    }
  }
}
