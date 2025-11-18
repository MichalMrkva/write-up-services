import { getDbClient } from "../db/db-client.js";
import { DatabaseError } from "../errors/database.js";

let repoSingleton;

export async function getAuthRepoSingleton() {
  if (repoSingleton) return repoSingleton;
  repoSingleton = new AuthRepository();
  await repoSingleton.createTable();
  return repoSingleton;
}

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
)
`;

const queryRegister = `INSERT INTO users (email, password_hash,username) VALUES ($1, $2, $3) RETURNING *`;
const queryLogin = `SELECT * FROM users WHERE email = $1`;

class AuthRepository {
  #client;
  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    await this.#client.query(createTableQuery);
  }

  async register(user) {
  try {
    const res = await this.#client.query(queryRegister, [
      user.email,
      user.password_hash,
      user.username,
    ]);
    console.log("User zaregistrován",res.rows[0])
    return { status: "success", message: "Register success" };

  } catch (err) {
    if (err.code === "23505") {
      throw new DatabaseError("User already exists");
    }
    throw new DatabaseError("Database error: " + err.message);
  }
}


  async login(email) {
    const res = await this.#client.query(queryLogin, [email]);
    console.log(res.rows[0]);
    if (res.rows.length > 0) return res.rows[0];
    throw new DatabaseError("User does not exist");
  }
}
