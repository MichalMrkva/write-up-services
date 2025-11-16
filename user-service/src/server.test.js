import request from "supertest";

const BASE_URL = "http://localhost:3002";
const email="test6@example.com";

describe("Auth routes (running server)", () => {
  test("POST /api/v1/user/register", async () => {
    const dtoIn = { email: email, password: "StrongPass1!" };

    const res = await request(BASE_URL)
      .post("/api/v1/user/register")
      .send(dtoIn);

    expect(res.status).toBe(201); 
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", dtoIn.email);
  });

  test("POST /api/v1/user/token/login", async () => {
    const dtoIn = { email: "test3@email.com", password: "Heslo123456+" };

    const res = await request(BASE_URL)
      .post("/api/v1/user/token/login")
      .send(dtoIn);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
