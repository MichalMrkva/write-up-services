import request from "supertest";
import dotenv from "dotenv";

dotenv.config();
const port=process.env.PORT
const BASE_URL = `http://localhost:${port}`;
const email="test14@example.com";

describe("Auth routes (running server)", () => {
  test("POST /api/v1/user/register", async () => {
    const dtoIn = { email: email, password: "StrongPass1!",username:"pokus" };

    const res = await request(BASE_URL)
      .post("/api/v1/user/register")
      .send(dtoIn);

    expect(res.status).toBe(201); 
  });

  test("POST /api/v1/user/token/login", async () => {
    const dtoIn = { email: email, password: "StrongPass1!" };

    const res = await request(BASE_URL)
      .post("/api/v1/user/token/login")
      .send(dtoIn);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
