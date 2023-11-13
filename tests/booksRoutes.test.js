process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");


beforeEach(async () => {
  await db.query("DELETE FROM books");
  await Book.create({
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017,
  });
});


afterAll(async () => {
  await db.end();
});


describe("GET /books", () => {
  test("should respond with a list of books", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("books");
  });
});


describe("GET /books/:id", () => {
  test("should respond with a single book by id", async () => {
    const book = await Book.create({
      isbn: "1234567890",
      amazon_url: "http://example.com",
      author: "John Doe",
      language: "english",
      pages: 200,
      publisher: "Sample Publisher",
      title: "Sample Book",
      year: 2022,
    });

    const response = await request(app).get(`/books/${book.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("book");
    expect(response.body.book.isbn).toBe(book.isbn);
  });

  test("should respond with 404 for non-existent book", async () => {
    const response = await request(app).get("/books/invalid-id");
    expect(response.statusCode).toBe(404);
  });
});


describe("POST /books", () => {
  test("should create a new book", async () => {
    const newBook = {
      isbn: "9876543210",
      amazon_url: "http://example.com/new-book",
      author: "Jane Doe",
      language: "english",
      pages: 150,
      publisher: "Another Publisher",
      title: "New Book",
      year: 2023,
    };

    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("book");
    expect(response.body.book.isbn).toBe(newBook.isbn);
  });

  test("should respond with 400 for invalid input", async () => {
    const response = await request(app).post("/books").send({});
    expect(response.statusCode).toBe(400);
  });
});


describe("PUT /books/:isbn", () => {
  test("should update an existing book", async () => {
    const updatedBook = {
      amazon_url: "http://example.com/updated-book",
      author: "Updated Author",
    };

    const response = await request(app)
      .put("/books/0691161518")
      .send(updatedBook);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("book");
    expect(response.body.book.amazon_url).toBe(updatedBook.amazon_url);
    expect(response.body.book.author).toBe(updatedBook.author);
  });

  test("should respond with 404 for non-existent book", async () => {
    const response = await request(app)
      .put("/books/invalid-id")
      .send({ author: "Updated Author" });

    expect(response.statusCode).toBe(404);
  });

  test("should respond with 400 for invalid input", async () => {
    const response = await request(app).put("/books/0691161518").send({});
    expect(response.statusCode).toBe(400);
  });
});


describe("DELETE /books/:isbn", () => {
  test("should delete an existing book", async () => {
    const response = await request(app).delete("/books/0691161518");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("should respond with 404 for non-existent book", async () => {
    const response = await request(app).delete("/books/invalid-id");
    expect(response.statusCode).toBe(404);
  });
});
