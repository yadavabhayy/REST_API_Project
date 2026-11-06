const { test, describe, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");
const booksModel = require("../src/data/books");

let server;
let baseUrl;

before(async () => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

beforeEach(() => {
  // Reset data store before each test
  booksModel.resetBooks();
});

describe("REST API - Books Resource", () => {
  describe("GET /api/books", () => {
    test("returns 200 and a JSON list of all books", async () => {
      const res = await fetch(`${baseUrl}/api/books`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type").includes("application/json"), true);

      const data = await res.json();
      assert.equal(Array.isArray(data), true);
      assert.equal(data.length, 3);
      assert.equal(data[0].title, "To Kill a Mockingbird");
    });
  });

  describe("GET /api/books/:id", () => {
    test("returns 200 and the book object when found", async () => {
      const res = await fetch(`${baseUrl}/api/books/1`);
      assert.equal(res.status, 200);

      const book = await res.json();
      assert.equal(book.id, 1);
      assert.equal(book.title, "To Kill a Mockingbird");
      assert.equal(book.author, "Harper Lee");
    });

    test("returns 404 when book ID does not exist", async () => {
      const res = await fetch(`${baseUrl}/api/books/9999`);
      assert.equal(res.status, 404);

      const body = await res.json();
      assert.equal(body.error, "Book not found");
      assert.equal(body.message.includes("9999"), true);
    });
  });

  describe("POST /api/books", () => {
    test("returns 201 and creates a new book with valid payload", async () => {
      const newBook = {
        title: "Brave New World",
        author: "Aldous Huxley",
        year: 1932,
        genre: "Dystopian"
      };

      const res = await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
      });

      assert.equal(res.status, 201);
      const created = await res.json();
      assert.equal(created.id, 4);
      assert.equal(created.title, "Brave New World");
      assert.equal(created.author, "Aldous Huxley");
      assert.equal(created.year, 1932);

      // Verify book is retrievable via GET
      const getRes = await fetch(`${baseUrl}/api/books/4`);
      assert.equal(getRes.status, 200);
    });

    test("returns 400 when title is missing", async () => {
      const invalidBook = {
        author: "Unknown Author"
      };

      const res = await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidBook)
      });

      assert.equal(res.status, 400);
      const body = await res.json();
      assert.equal(body.error, "Bad Request");
      assert.equal(body.message.includes("title"), true);
    });

    test("returns 400 when author is missing", async () => {
      const invalidBook = {
        title: "Some Title"
      };

      const res = await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidBook)
      });

      assert.equal(res.status, 400);
      const body = await res.json();
      assert.equal(body.error, "Bad Request");
      assert.equal(body.message.includes("author"), true);
    });

    test("returns 400 when year is not an integer", async () => {
      const invalidBook = {
        title: "Some Title",
        author: "Some Author",
        year: "nineteen-eighty-four"
      };

      const res = await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidBook)
      });

      assert.equal(res.status, 400);
      const body = await res.json();
      assert.equal(body.error, "Bad Request");
      assert.equal(body.message.includes("year"), true);
    });
  });

  describe("PUT /api/books/:id", () => {
    test("returns 200 and updates the book when valid", async () => {
      const updatedData = {
        title: "Nineteen Eighty-Four (Special Edition)",
        author: "George Orwell",
        year: 1950,
        genre: "Classic Dystopian"
      };

      const res = await fetch(`${baseUrl}/api/books/2`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      assert.equal(res.status, 200);
      const updated = await res.json();
      assert.equal(updated.id, 2);
      assert.equal(updated.title, "Nineteen Eighty-Four (Special Edition)");
      assert.equal(updated.year, 1950);

      // Verify update persisted
      const checkRes = await fetch(`${baseUrl}/api/books/2`);
      const checkBook = await checkRes.json();
      assert.equal(checkBook.title, "Nineteen Eighty-Four (Special Edition)");
    });

    test("returns 404 when updating non-existent book", async () => {
      const res = await fetch(`${baseUrl}/api/books/9999`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Any", author: "Any" })
      });

      assert.equal(res.status, 404);
      const body = await res.json();
      assert.equal(body.error, "Book not found");
    });

    test("returns 400 when required fields are missing on PUT", async () => {
      const res = await fetch(`${baseUrl}/api/books/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: 2000 })
      });

      assert.equal(res.status, 400);
      const body = await res.json();
      assert.equal(body.error, "Bad Request");
    });
  });

  describe("DELETE /api/books/:id", () => {
    test("returns 200 and deletes an existing book", async () => {
      const res = await fetch(`${baseUrl}/api/books/3`, {
        method: "DELETE"
      });

      assert.equal(res.status, 200);
      const body = await res.json();
      assert.equal(body.message.includes("deleted successfully"), true);
      assert.equal(body.book.id, 3);

      // Verify book is no longer found
      const checkRes = await fetch(`${baseUrl}/api/books/3`);
      assert.equal(checkRes.status, 404);
    });

    test("returns 404 when deleting a non-existent book", async () => {
      const res = await fetch(`${baseUrl}/api/books/9999`, {
        method: "DELETE"
      });

      assert.equal(res.status, 404);
      const body = await res.json();
      assert.equal(body.error, "Book not found");
    });
  });

  describe("Error handling and Root route", () => {
    test("returns 200 with API overview on GET /", async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.equal(res.status, 200);
      const body = await res.json();
      assert.equal(body.name, "Books REST API");
      assert.ok(body.endpoints);
    });

    test("returns 404 JSON on unknown route", async () => {
      const res = await fetch(`${baseUrl}/api/nonexistent`);
      assert.equal(res.status, 404);
      const body = await res.json();
      assert.equal(body.error, "Not Found");
    });

    test("returns 400 JSON when payload contains malformed JSON", async () => {
      const res = await fetch(`${baseUrl}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ bad json ... }"
      });

      assert.equal(res.status, 400);
      const body = await res.json();
      assert.equal(body.error, "Bad Request");
      assert.equal(body.message.includes("Malformed JSON"), true);
    });
  });
});
