import { DatabaseError } from "../errors/database.js";
import { query } from "../db/db-client.js";

let repoSingleton;

export function getBookRepoSingleton() {
  if (repoSingleton) {
    return repoSingleton;
  } else {
    repoSingleton = new BookRepository();
    return repoSingleton;
  }
}

const queryInsertBook = `INSERT INTO books (user_id, name, description, genre) VALUES ($1, $2, $3, $4) 
  RETURNING id, user_id AS "userId", name, description, genre, created_at AS "createdAt", updated_at AS "updatedAt"`;

const querySelectBooks = `--sql
  SELECT
      id,
      user_id AS "userId",
      name,
      description,
      genre,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  FROM books`;

const queryDeleteBookById = `--sql
  DELETE FROM books
  WHERE id = $1 AND user_id = $2;
`;

const querySelectBookById = `--sql
  SELECT
      b.id AS "id",
      b.user_id AS "userId",
      b.name AS "name",
      b.description AS "description",
      b.genre AS "genre",
      b.created_at AS "createdAt",
      b.updated_at AS "updatedAt",
      c.id AS "chapterId",
      c.name AS "chapterName",
      c.created_at AS "chapterCreatedAt",
      c.updated_at AS "chapterUpdatedAt"
  FROM
      books b
  LEFT JOIN
      chapters c ON b.id = c.book_id
  WHERE
      b.id = $1
  ORDER BY c.created_at ASC;
`;

const queryUpdateBookById = `--sql
  UPDATE books
  SET
    name = COALESCE((($3::JSONB)->>'name')::VARCHAR(100), books.name),
    genre = COALESCE((($3::JSONB)->>'genre')::VARCHAR(20), books.genre),
    description = COALESCE((($3::JSONB)->>'description')::VARCHAR(200), books.description)
  WHERE id = $1 AND user_id = $2
  RETURNING id, user_id AS userId, name, description, genre, created_at AS createdAt, updated_at AS updatedAt;
`;

class BookRepository {
  async createNewBook(book, authorId) {
    console.log("[BookRepository]: Creating new book", { authorId, ...book });
    let res;
    try {
      res = await query(queryInsertBook, [
        authorId,
        book.name,
        book.description,
        book.genre,
      ]);
    } catch (e) {
      throw new DatabaseError(e.message);
    }
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      throw new DatabaseError("Failed to retrieve created book");
    }
  }

  async getBooks() {
    try {
      const res = await query(querySelectBooks);
      return res.rows;
    } catch (e) {
      console.log(e);
      throw new DatabaseError(e.message);
    }
  }

  async deleteBookById(bookId, userId) {
    try {
      const result = await query(queryDeleteBookById, [bookId, userId]);
      if (result.rowCount === 1) {
        console.log(
          `Book with ID ${bookId} successfully deleted by user ${userId}.`
        );
        return true;
      } else {
        throw new DatabaseError(
          "Book not found or user is not authorized to delete this book.",
          null,
          403,
          "BOOK_DELETE_UNAUTHORIZED_OR_NOT_FOUND"
        );
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw e;
      }
      throw new DatabaseError(e.message, e);
    }
  }

  async getBookById(bookId) {
    let res;
    try {
      res = await query(querySelectBookById, [bookId]);
    } catch (e) {
      throw new DatabaseError(e.message);
    }
    if (res.rows.length > 0) {
      const book = {
        id: res.rows[0].id,
        userId: res.rows[0].userId,
        name: res.rows[0].name,
        description: res.rows[0].description,
        genre: res.rows[0].genre,
        createdAt: res.rows[0].createdAt,
        updatedAt: res.rows[0].updatedAt,
        chapters: [],
      };

      if (res.rows[0].chapterId !== null) {
        for (const row of res.rows) {
          book.chapters.push({
            id: row.chapterId,
            name: row.chapterName,
            createdAt: row.chapterCreatedAt,
            updatedAt: row.chapterUpdatedAt,
          });
        }
      }
      return book;
    } else {
      throw new DatabaseError(`Book ${bookId} not found`);
    }
  }

  async updateBookById(bookId, userId, dtoIn) {
    try {
      const result = await query(queryUpdateBookById, [bookId, userId, dtoIn]);
      if (result.rowCount === 0) {
        throw new DatabaseError(
          "Book not found or user is not authorized to update this book.",
          null,
          403,
          "BOOK_UPDATE_UNAUTHORIZED_OR_NOT_FOUND"
        );
      }
      return result.rows[0];
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw e;
      }
      throw new DatabaseError(e.message, e);
    }
  }
}
