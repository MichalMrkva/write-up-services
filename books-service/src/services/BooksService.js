import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import { getBookRepoSingleton } from "../repositories/BooksRepository.js";
import { ajv } from "../validation/ajv.js";
import {
  bookCreateSchema,
  bookPatchSchema,
} from "../validation/chapter-schema.js";

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
}
