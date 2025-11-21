import request from "supertest";
import dotenv from "dotenv";

dotenv.config();
const port=process.env.PORT
const BASE_URL = `http://localhost:${port}`;
const updateData = {
  bio: "Nový bio",
  genres: ["rock", "jazz"],
  img_url: "https://example.com/new-image.jpg"
};

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
  test("GET /api/v1/profile?id=", async () => {

    const res = await request(BASE_URL)
      .get("/api/v1/profile?id=")
      .query({id}) 
      .set("Accept", "application/json");

    expect(res.status).toBe(200); 
  });
  test("PATCH /api/v1/profile?id=",async()=>{
    const res =await request(BASE_URL)
    .patch("/api/v1/profile?id=")
    .query({id})
    .send(updateData)
    .set("Accept", "application/json");

    expect(res.status).toBe(200);

    
  });
});
