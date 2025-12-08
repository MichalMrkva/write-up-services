import { getDbClient } from "../db/db-client.js";
import { DatabaseError } from "../errors/database.js";

let repoSingleton;

export async function getAuthRepoSingleton() {
  if (repoSingleton) return repoSingleton;
  repoSingleton = new AuthRepository();
  await repoSingleton.createTable();
  return repoSingleton;
}

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  refresh_token VARCHAR(1024)
)
`;

const createBlacklistTableQuery = `
CREATE TABLE IF NOT EXISTS access_token_blacklist (
  access_token VARCHAR(1024) PRIMARY KEY
)
`;

const queryRegister = `INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING *`;
const queryLogin = `SELECT * FROM users WHERE email = $1`;
const querySaveToken = `UPDATE users SET refresh_token = $2 WHERE id = $1 RETURNING *`;
const querySignout = `UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING *`;
const queryGetToken = `SELECT refresh_token, email, username FROM users WHERE id = $1 OR email=$2`;
const queryBlacklistToken = `INSERT INTO access_token_blacklist (access_token) VALUES ($1) ON CONFLICT DO NOTHING`;
const queryIsTokenBlacklisted = `SELECT 1 FROM access_token_blacklist WHERE access_token = $1`;

class AuthRepository {
  #client;

  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    await this.#client.query(createUsersTableQuery);
    await this.#client.query(createBlacklistTableQuery);
  }

  async register(user) {
    try {
      const res = await this.#client.query(queryRegister, [
        user.email,
        user.password_hash,
        user.username,
      ]);
      if (res.rows.length === 0) throw new DatabaseError("Register failed");
      console.log("User registered:", res.rows[0]);
      return { status: "success", message: "Register success" };
    } catch (err) {
      if (err.code === "23505") {
        throw new DatabaseError("User already exists");
      }
      console.error("Database error during register:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }

  async login(email) {
    try {
      const res = await this.#client.query(queryLogin, [email]);
      if (res.rows.length === 0) throw new DatabaseError("User does not exist");
      console.log("User logged in:", res.rows[0]);
      return res.rows[0];
    } catch (err) {
      console.error("Database error during login:", err.message);
      throw err;
    }
  }

  async saveToken(id, token) {
    try {
      const res = await this.#client.query(querySaveToken, [id, token]);
      if (res.rows.length === 0) throw new DatabaseError("Failed to save token");
      console.log("Refresh token saved for user:", id);
    } catch (err) {
      console.error("Database error during saveToken:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }

  async signout(id) {
    try {
      const res = await this.#client.query(querySignout, [id]);
      if (res.rows.length === 0) throw new DatabaseError("User not found");
      return { message: "Signout success" };
    } catch (err) {
      console.error("Database error during signout:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }

  async getToken(id,email) {
    try {
      const res = await this.#client.query(queryGetToken, [id,email]);
      if (res.rows.length === 0) throw new DatabaseError("User not found");
      return res.rows[0]; 
    } catch (err) {
      console.error("Database error during getToken:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }

  
  async blacklistAccessToken(token) {
    try {
      await this.#client.query(queryBlacklistToken, [token]);
      console.log("Access token blacklisted");
    } catch (err) {
      console.error("Database error during blacklistAccessToken:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }

  
  async isAccessTokenBlacklisted(token) {
    try {
      const res = await this.#client.query(queryIsTokenBlacklisted, [token]);
      return res.rows.length > 0;
    } catch (err) {
      console.error("Database error during isAccessTokenBlacklisted:", err.message);
      throw new DatabaseError("Database error: " + err.message);
    }
  }
}

export default AuthRepository;
