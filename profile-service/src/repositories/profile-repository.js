import { getDbClient } from "../db/db-client.js";
import { DatabaseError } from "../errors/database.js";

let repoSingleton;

export async function getProfileRepoSingleton() {
  if (repoSingleton) return repoSingleton;
  repoSingleton = new ProfileRepository();
  await repoSingleton.createTable();
  return repoSingleton;
}

const createTableQuery = `
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username VARCHAR(50),
  bio VARCHAR(255),
  img_url VARCHAR(255),
  genre VARCHAR(255),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
`;


const queryCreate = `INSERT INTO profiles (user_id, username,bio,img_url,genre) VALUES ($1,$2,$3,$4,$5) RETURNING *`;


class ProfileRepository {
  #client;
  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    await this.#client.query(createTableQuery);
  }

  async create(user) {
    try {
      const res = await this.#client.query(queryCreate, [
        user.email,
        user.password_hash,
      ]);
      console.log("User zaregistrován",res.rows[0])
      return { message: "Profile success" };

    } catch (err) {
      if (err.code === "23505") {
        throw new DatabaseError("Profile already exists");
      }
      throw new DatabaseError("Database error: " + err.message);
    }
  }


}
