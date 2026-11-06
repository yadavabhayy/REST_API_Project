const express = require("express");
const booksRouter = require("./routes/books");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Handle malformed JSON body errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Malformed JSON payload in request body"
    });
  }
  next(err);
});

// Root / Welcome Route
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Books REST API",
    version: "1.0.0",
    description: "RESTful API with standard CRUD operations over a Books resource",
    endpoints: {
      "GET /api/books": "Retrieve all books",
      "GET /api/books/:id": "Retrieve a single book by ID",
      "POST /api/books": "Create a new book (requires title, author; optional year, genre)",
      "PUT /api/books/:id": "Update an existing book (requires title, author; optional year, genre)",
      "DELETE /api/books/:id": "Delete a book by ID"
    }
  });
});

// Mount Books resource routes
app.use("/api/books", booksRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global 500 error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred"
  });
});

module.exports = app;
