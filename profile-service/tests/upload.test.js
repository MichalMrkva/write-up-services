import request from "supertest";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const port = process.env.PORT;
const BASE_URL = `http://localhost:${port}`;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Profile routes (running server)", () => {

  test("POST /api/v1/profile/upload", async () => {
    const testFilePath = path.join(__dirname, "avatars", "avatar.jpg");    

    const res = await request(BASE_URL)
      .post("/api/v1/profile/upload")
      .attach("avatar", testFilePath) 
      .set("X-User-Id", "ed79c3f9-5ad0-4950-a3df-e06d60a9c36f");

    expect(res.status).toBe(201);
    
  });
  test("POST /api/v1/profile/upload", async () => { 

    const res = await request(BASE_URL)
      .post("/api/v1/profile/upload")
      .set("X-User-Id", "9f3c1f3b-7d9a-4e8d-92a4-1c6ab4cbb123");

    expect(res.status).toBe(400);
    
  });

});
