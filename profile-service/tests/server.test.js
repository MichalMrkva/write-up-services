import request from "supertest";
import dotenv from "dotenv";
const id="00a5f3ac-111a-4328-ae44-0e41bb9b80e9";

dotenv.config();
const port=process.env.PORT
const BASE_URL = `http://localhost:${port}`;
const updateData = {
  id,
  bio: "Nový bio",
  genre: "rock,jazz",
  user_id:"ed79c3f9-5ad0-4950-a3df-e06d60a9c36f"
};



describe("Profile routes (running server)", () => {
  test("POST /api/v1/profile", async () => {
    const dtoIn = {
      user_id: "ed79c3f9-5ad0-4950-a3df-e06d60a9c36f",
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
      .get("/api/v1/profile")
      .query({id}) 
      .set("Accept", "application/json");

    expect(res.status).toBe(201); 
  });
  test("PATCH /api/v1/profile",async()=>{
    const res =await request(BASE_URL)
    .patch("/api/v1/profile")
    .send(updateData)
    .set("Accept", "application/json");

    expect(res.status).toBe(201);

    
  });
});
