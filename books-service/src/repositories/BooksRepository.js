import { getDbClient } from "../db/db-client.js";
import { DatabaseError } from "../errors/database.js";

let repoSingleton;

export function getBookRepoSingleton() {
  if (repoSingleton) {
    return repoSingleton;
  } else {
    repoSingleton = new BookRepository();
    repoSingleton.createTable();
    return repoSingleton;
  }
}

const createTable = `--sql
  CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(30) NOT NULL,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(200),
    genre VARCHAR(200)
  )`;
const queryInsertBook = `INSERT INTO books (user_id, name, description, genre) VALUES ($1, $2, $3, $4) RETURNING *`;
const queryDeleteBookById = `DELETE FROM books WHERE id = $1`;
const querySelectBookById = `SELECT * FROM books WHERE id = $1`;
const querySelectBooksByAuthorId = `SELECT * FROM books WHERE id = $1`;

class BookRepository {
  #client;

  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    this.#client.query(createTable);
  }

  async createNewBook(book, authorId) {
    const res = await this.#client.query(queryInsertBook, [
      authorId,
      book.name,
      book.description,
      book.genre,
    ]);

    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      throw new DatabaseError("Failed to retrieve ID after creating new book.");
    }
  }

  async deleteBookById(id) {
    await this.#client.query(queryDeleteBookById, [id]);
  }

  async getBookById(id) {
    const res = await this.#client.query(querySelectBookById, [id]);
    return res.rows[0];
  }

  async getBooksByAuthorId(id) {
    const books = await this.#client.query(querySelectBooksByAuthorId, [id]);
  }
}
