import { DatabaseError } from "../errors/database.js";
import { query } from "../db/db-client.js";

let repoSingleton;

export function getCommentRepoSingleton() {
  if (repoSingleton) {
    return repoSingleton;
  } else {
    repoSingleton = new CommentRepository();
    return repoSingleton;
  }
}

const queryInsertComment = `--sql
  INSERT INTO comments (chapter_id, user_id, text) 
  VALUES ($1, $2, $3) 
  RETURNING 
    id, 
    chapter_id AS "chapterId", 
    user_id AS "userId", 
    text, 
    created_at AS "createdAt";
`;

const querySelectCommentsByChapter = `--sql
  SELECT
      id,
      chapter_id AS "chapterId",
      user_id AS "userId",
      text,
      created_at AS "createdAt"
  FROM comments
  WHERE chapter_id = $1
  ORDER BY created_at DESC
  LIMIT $2
  OFFSET $3;
`;

const queryDeleteCommentById = `--sql
  DELETE FROM comments
  WHERE id = $1 AND user_id = $2;
`;

const queryUpdateCommentById = `--sql
  UPDATE comments
  SET
    text = COALESCE((($3::JSONB)->>'text')::VARCHAR(500), comments.text),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1 AND user_id = $2
  RETURNING 
    id, 
    chapter_id AS "chapterId", 
    user_id AS "userId", 
    text, 
    created_at AS "createdAt",
    updated_at AS "updatedAt";
`;

class CommentRepository {
  async createComment(chapterId, userId, commentData) {
    console.log("[CommentRepository]: Creating new comment", {
      chapterId,
      userId,
    });
    try {
      const res = await query(queryInsertComment, [
        chapterId,
        userId,
        commentData.text,
      ]);

      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        throw new DatabaseError("Failed to retrieve created comment");
      }
    } catch (e) {
      throw new DatabaseError(e.message);
    }
  }

  async getCommentsByChapter(chapterId, queryParams) {
    try {
      const res = await query(querySelectCommentsByChapter, [
        chapterId,
        queryParams.limit,
        queryParams.offset,
      ]);
      return res.rows;
    } catch (e) {
      throw new DatabaseError(e.message);
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const result = await query(queryDeleteCommentById, [commentId, userId]);
      if (result.rowCount === 1) {
        return true;
      } else {
        throw new DatabaseError(
          "Comment not found or user is not authorized to delete this comment.",
          null,
          403,
          "COMMENT_DELETE_UNAUTHORIZED_OR_NOT_FOUND"
        );
      }
    } catch (e) {
      if (e instanceof DatabaseError) throw e;
      throw new DatabaseError(e.message, e);
    }
  }

  async updateComment(commentId, userId, dtoIn) {
    try {
      const result = await query(queryUpdateCommentById, [
        commentId,
        userId,
        JSON.stringify(dtoIn),
      ]);
      if (result.rowCount === 0) {
        throw new DatabaseError(
          "Comment not found or user is not authorized to update this comment.",
          null,
          403,
          "COMMENT_UPDATE_UNAUTHORIZED_OR_NOT_FOUND"
        );
      }
      return result.rows[0];
    } catch (e) {
      if (e instanceof DatabaseError) throw e;
      throw new DatabaseError(e.message, e);
    }
  }
}
