import { DatabaseError } from "../errors/database.js";
import { query } from "../db/db-client.js";

let repoSingleton;

export function getChaptersRepoSingleton() {
  if (repoSingleton) {
    return repoSingleton;
  } else {
    repoSingleton = new ChaptersRepository();
    return repoSingleton;
  }
}

const queryInsertChapter = `--sql
  INSERT INTO chapters (book_id, name, content)
  SELECT
      $1,
      $3,
      $4
  FROM
      books b
  WHERE
      b.id = $1 AND b.author_id = $2
  RETURNING id, book_id AS "bookId", name, content, created_at AS "createdAt", updated_at AS "updatedAt";
`;

const querySelectChapterByIdAndBookId = `--sql
  SELECT
      id AS "id",
      book_id AS "bookId",
      name AS "name",
      content AS "content",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  FROM
      chapters
  WHERE
      book_id = $1 AND id = $2;
`;

const queryUpdateChapter = `--sql
  UPDATE chapters c
  SET
      name = COALESCE((($4::JSONB)->>'name')::VARCHAR(100), c.name),
      content = COALESCE((($4::JSONB)->>'content')::VARCHAR(20000), c.content)
  FROM books b
  WHERE
      c.id = $1 AND
      b.id = $2 AND
      c.book_id = b.id AND
      b.author_id = $3
  RETURNING c.id AS "id", c.book_id AS "bookId", c.name AS "name", c.content AS "content", c.created_at AS "createdAt", c.updated_at AS "updatedAt";
`;

const queryDeleteChapter = `--sql
  DELETE FROM chapters c
  USING books b
  WHERE
      c.id = $1 AND
      b.id = $2 AND
      c.book_id = b.id AND
      b.author_id = $3;
`;

class ChaptersRepository {
  async createNewChapter(chapter, bookId, authorId) {
    let res;
    try {
      res = await query(queryInsertChapter, [
        bookId,
        authorId,
        chapter.name,
        chapter.content,
      ]);
    } catch (e) {
      throw new DatabaseError(e.message);
    }
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      throw new DatabaseError("Failed to retrieve created chapter");
    }
  }

  async getChapterById(bookId, chapterId) {
    let res;
    try {
      res = await query(querySelectChapterByIdAndBookId, [bookId, chapterId]);
    } catch (e) {
      console.log(e);
      throw new DatabaseError(e.message);
    }
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      throw new DatabaseError(`Chapter ${chapterId} not found`, null, 404);
    }
  }

  async updateChapterById(bookId, authorId, chapterId, dtoIn) {
    try {
      const result = await query(queryUpdateChapter, [
        chapterId,
        bookId,
        authorId,
        dtoIn,
      ]);
      if (result.rowCount === 0) {
        throw new DatabaseError(
          "Book not found or author is not authorized to update this book.",
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

  async deleteChapterById(bookId, chapterId, authorId) {
    try {
      const result = await query(queryDeleteChapter, [
        chapterId,
        bookId,
        authorId,
      ]);
      if (result.rowCount === 1) {
        console.log(
          `Chapter with ID ${chapterId} successfully deleted by user ${authorId}.`
        );
        return true;
      } else {
        throw new DatabaseError(
          "Chapter not found or user is not authorized to delete this chapter.",
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
}
