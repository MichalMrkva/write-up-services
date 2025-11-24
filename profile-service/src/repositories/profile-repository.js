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
  user_id UUID NOT NULL UNIQUE,
  email VARCHAR(50),
  username VARCHAR(50),
  bio VARCHAR(255),
  img_url VARCHAR(255),
  genre VARCHAR(255),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users2(id)
    ON DELETE CASCADE
);
`;
// v REFERENCES pak přepsta na users

const queryCreate = `INSERT INTO profiles (user_id, email,username) VALUES ($1,$2,$3) RETURNING *`;
const queryGet=`SELECT * from profiles WHERE id=$1`;
const queryUpdate=`UPDATE profiles SET bio=$2,genre=$3,img_url=$4 WHERE id=$1 RETURNING *`
const queryUpload=`UPDATE profiles SET img_url=$2 WHERE id=$1 RETURNING *`


class ProfileRepository {
  #client;
  constructor() {
    this.#client = getDbClient();
  }

  async createTable() {
    await this.#client.query(createTableQuery);
  }

  async create(dtoIn) {
    try {
      const res = await this.#client.query(queryCreate, [
        dtoIn.user_id,
        dtoIn.email,
        dtoIn.username,
      ]);
      console.log("Profil vytvořen",res.rows[0])
      return { message: "Profile success" };

    } catch (err) {
      if (err.code === "23505") {
        throw new DatabaseError("Profile already exists");
      }
      throw new DatabaseError("Database error: " + err.message);
    }
  }
  async get(dtoIn)
  {
    try{
      const res=await this.#client.query(queryGet,[dtoIn.id]);
      if(res.rows[0])
      {
        console.log("Changes:",res.rows[0]);
        return("List of changes:",res.rows[0]);

      }
      throw new DatabaseError("Author profil doesnt exist")

    }
    catch (err) {
      throw new DatabaseError("Database error: " + err.message);
    }

  }
  async update(dtoIn)
  {
    try{
      const res=await this.#client.query(queryUpdate,[
      dtoIn.id,
      dtoIn.bio,
      dtoIn.genre,

      ]);
      if(res.rows[0])
      {
        console.log("Autoruv profil byl updatnut",res.rows[0]);
        return res.rows[0];

      }
      throw new DatabaseError("Author profil doesnt exist")

    }
    catch (err) {
      throw new DatabaseError("Database error: " + err.message);
    }
    
  }
  async upload(id,img_url)
  { 
    try{
      const res=await this.#client.query(queryUpload,[

        id,
        img_url
      ]);
      if(res.rows[0])
      {
        console.log("Autoruv profil byl updatnut",res.rows[0]);
        return res.rows[0];

      }
      throw new DatabaseError("Author profil doesnt exist")
      
    }
    catch (err) {
      throw new DatabaseError("Database error: " + err.message);
    }

  }


}
