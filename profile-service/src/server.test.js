import request from "supertest";
import dotenv from "dotenv";

dotenv.config();
const port=process.env.PORT
const BASE_URL = `http://localhost:${port}`;

const id="";

describe("Profile routes (running server)", () => {
  test("POST /api/v1/profile", async () => {
    const dtoIn = {
      user_id: "9f3c1f3b-7d9a-4e8d-92a4-1c6ab4cbb123",
      email: "test.user@example.com",
      username: "testUser123"
    };

    const res = await request(BASE_URL)
      .post("/api/v1/profile")
      .send(dtoIn);

    expect(res.status).toBe(201); 
  });
  
});
