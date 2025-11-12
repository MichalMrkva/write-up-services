import { getDbClient } from "../db/db-client.js";
import { DatabaseError } from "../errors/database.js";

let repoSingleton;

export function getAuthSingleton() {
  if (repoSingleton) {
    return repoSingleton;
  } else {
    repoSingleton = new AuthRepository();
    repoSingleton.createTable();
    return repoSingleton;
  }
}

const createTable = `--sql
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) REQUIRED NOT NULL UNIQUE,
    password_hash VARCHAR(255) REQUIRED NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  )`;
const queryRegister = `INSERT INTO users (email , password_hash) VALUES ($1, $2) RETURNING *`;
const queryLogin = `SELECT * FROM users WHERE email=$1`;

class AuthRepository {
  #client;

  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    this.#client.query(createTable);
  }

  async register(user) {
    const res = await this.#client.query(queryRegister, [
      user.email,
      user.password_hash,
    ]);

    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      throw new DatabaseError("Failed to retrive created user.");
    }
  }
  async login(email)
  {
    const res=await this.#client.query(queryLogin,[email]);
    if(res.rows.length>0)
    {
        return res.rows[0];

    }
    else{
        throw new DatabaseError("User with this user dosnt exist")
    }
  }

  
  
}
