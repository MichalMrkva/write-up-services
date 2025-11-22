import request from "supertest";
import dotenv from "dotenv";
const id="dc908785-33b1-48d8-bfa8-633ba7160be9";

dotenv.config();
const port=process.env.PORT
const BASE_URL = `http://localhost:${port}`;
const updateData = {
  id,
  bio: "Nový bio",
  genre: "rock,jazz",
  img_url: "https://example.com/new-image.jpg",
  user_id:"7b2de7f8-889d-4045-9978-1a7b0873ec68"
};



describe("Profile routes (running server)", () => {
  test("POST /api/v1/profile", async () => {
    const dtoIn = {
      user_id: "7b2de7f8-889d-4045-9978-1a7b0873ec68",
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
