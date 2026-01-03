import { Pool } from "pg";
import { DatabaseError } from "../errors/database.js";

let pool;
const createStringExt = `--sql CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
const createBooksTable = `--sql
  CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    genre VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

const updateBooksTimestampFunction = `--sql
  CREATE OR REPLACE FUNCTION update_books_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const updateBooksTrigger = `--sql
  CREATE OR REPLACE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_books_timestamp();
`;

const indexBooksUserId = `--sql CREATE UNIQUE INDEX IF NOT EXISTS idx_books_user_id ON books (user_id);`;
const indexBooksName = `--sql CREATE INDEX IF NOT EXISTS idx_books_name ON books (name);`;
const indexBooksGenre = `--sql CREATE INDEX IF NOT EXISTS idx_books_genre ON books (genre);`;
const trgmIndexBooksName = `--sql CREATE INDEX trgm_idx_books_name ON books USING GIN (name gin_trgm_ops);`;
const trgmIndexBooksGenre = `--sql CREATE INDEX IF NOT EXISTS trgm_idx_books_genre ON books USING GIN (genre gin_trgm_ops);`;

const createChapterTable = `--sql
  CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    content VARCHAR(20000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

const updateChaptersTimestampFunction = `--sql
  CREATE OR REPLACE FUNCTION update_chapters_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

const updateChaptersTrigger = `--sql 
  CREATE OR REPLACE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_chapters_timestamp();
`;

const indexChaptersBookIdAndId = `--sql CREATE UNIQUE INDEX IF NOT EXISTS idx_chapters_book_id_id ON chapters (book_id, id);`;
const indexChaptersName = `--sql CREATE INDEX IF NOT EXISTS idx_chapters_name ON chapters (name);`;

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
    await pool.query(createStringExt);
    await pool.query(createBooksTable);
    await pool.query(updateBooksTimestampFunction);
    await pool.query(updateBooksTrigger);
    await pool.query(indexBooksUserId);
    await pool.query(indexBooksName);
    await pool.query(indexBooksGenre);
    await pool.query(trgmIndexBooksName);
    await pool.query(trgmIndexBooksGenre);

    await pool.query(createChapterTable);
    await pool.query(updateChaptersTimestampFunction);
    await pool.query(updateChaptersTrigger);
    await pool.query(indexChaptersBookIdAndId);
    await pool.query(indexChaptersName);

    console.log("Database pool successfully connected.");
  } catch (err) {
    console.error("Error connecting to pool", err);
    throw err;
  }
}

export async function query(query, params) {
  if (!pool) {
    throw new DatabaseError("Cannot query if pool is not initialized");
  }
  return await pool.query(query, params);
}
