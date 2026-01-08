import request from "supertest";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;
const BASE_URL = `http://localhost:${port}`;

describe("Books routes (running server)", () => {
    let bookId;
    let chapterId;
    const authorId = "123e4567-e89b-12d3-a456-426614174000";

    test("POST /api/v1/books - Create a book", async () => {
        const dtoIn = { name: "Test Book", genre: "Sci-Fi", description: "A test book" };

        const res = await request(BASE_URL)
            .post("/api/v1/books")
            .set("x-author-id", authorId)
            .send(dtoIn);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Test Book");
        bookId = res.body.id;
    });

    test("GET /api/v1/books/:bookId - Get the book", async () => {
        const res = await request(BASE_URL)
            .get(`/api/v1/books/${bookId}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(bookId);
        expect(res.body.name).toBe("Test Book");
    });

    test("PATCH /api/v1/books/:bookId - Update the book", async () => {
        const dtoIn = { name: "Updated Book" };

        const res = await request(BASE_URL)
            .patch(`/api/v1/books/${bookId}`)
            .set("x-author-id", authorId)
            .send(dtoIn);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Book");
    });

    test("POST /api/v1/books/:bookId/chapters - Create a chapter", async () => {
        const dtoIn = { name: "Chapter 1", content: "This is the content of chapter 1" };

        const res = await request(BASE_URL)
            .post(`/api/v1/books/${bookId}/chapters`)
            .set("x-author-id", authorId)
            .send(dtoIn);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Chapter 1");
        chapterId = res.body.id;
    });

    test("GET /api/v1/books/:bookId/chapters/:chapterId - Get the chapter", async () => {
        const res = await request(BASE_URL)
            .get(`/api/v1/books/${bookId}/chapters/${chapterId}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(chapterId);
        expect(res.body.name).toBe("Chapter 1");
    });

    test("PATCH /api/v1/books/:bookId/chapters/:chapterId - Update the chapter", async () => {
        const dtoIn = { content: "Updated content" };

        const res = await request(BASE_URL)
            .patch(`/api/v1/books/${bookId}/chapters/${chapterId}`)
            .set("x-author-id", authorId)
            .send(dtoIn);

        expect(res.status).toBe(200);
        expect(res.body.content).toBe("Updated content");
    });

    test("DELETE /api/v1/books/:bookId/chapters/:chapterId - Delete the chapter", async () => {
        const res = await request(BASE_URL)
            .delete(`/api/v1/books/${bookId}/chapters/${chapterId}`)
            .set("x-author-id", authorId);

        expect(res.status).toBe(204);
    });

    test("DELETE /api/v1/books/:bookId - Delete the book", async () => {
        const res = await request(BASE_URL)
            .delete(`/api/v1/books/${bookId}`)
            .set("x-author-id", authorId);

        expect(res.status).toBe(204);
    });

    test("GET /api/v1/books", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/books");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
