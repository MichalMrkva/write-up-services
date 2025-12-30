import { Pool } from "pg";
import { DatabaseError } from "../errors/database.js";

let pool;

const createCommentsTable = `--sql
  CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL,
    user_id UUID NOT NULL,
    username VARCHAR(50) NOT NULL,
    text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

const updateCommentsTimestampFunction = `--sql
  CREATE OR REPLACE FUNCTION update_comments_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const updateCommentsTrigger = `--sql
  CREATE OR REPLACE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_timestamp();
`;

const indexCommentsChapterId = `--sql CREATE INDEX IF NOT EXISTS idx_comments_chapter_id ON comments (chapter_id);`;
const indexCommentsUserId = `--sql CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);`;

export async function initDB(user, host, database, password, port) {
  pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
  });

  try {
    await pool.connect();
    await pool.query("SELECT 1");

    await pool.query(createCommentsTable);

    await pool.query(updateCommentsTimestampFunction);
    await pool.query(updateCommentsTrigger);

    await pool.query(indexCommentsChapterId);
    await pool.query(indexCommentsUserId);

    console.log(
      "[Comments Service]: Database pool successfully connected and schema initialized."
    );
  } catch (err) {
    console.error("[Comments Service]: Error connecting to database pool", err);
    throw err;
  }
}

export async function query(queryString, params) {
  if (!pool) {
    throw new DatabaseError("Cannot query if pool is not initialized");
  }
  return await pool.query(queryString, params);
}
