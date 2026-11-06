const express = require("express");
const router = express.Router();
const booksModel = require("../data/books");

/**
 * GET /api/books
 * Retrieves all books
 */
router.get("/", (req, res) => {
  const books = booksModel.getAllBooks();
  res.status(200).json(books);
});

/**
 * GET /api/books/:id
 * Retrieves a single book by ID
 */
router.get("/:id", (req, res) => {
  const book = booksModel.getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({
      error: "Book not found",
      message: `No book found with ID ${req.params.id}`
    });
  }

  res.status(200).json(book);
});

/**
 * POST /api/books
 * Creates a new book
 * Required fields: title, author
 * Optional fields: year, genre
 */
router.post("/", (req, res) => {
  const { title, author, year, genre } = req.body;

  // Validation: required fields
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'title' field is required and must be a non-empty string"
    });
  }

  if (!author || typeof author !== "string" || !author.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'author' field is required and must be a non-empty string"
    });
  }

  // Validation: year if provided
  if (year !== undefined && (isNaN(Number(year)) || !Number.isInteger(Number(year)))) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'year' field must be an integer"
    });
  }

  const createdBook = booksModel.createBook({ title, author, year, genre });
  res.status(201).json(createdBook);
});

/**
 * PUT /api/books/:id
 * Updates an existing book completely
 * Required fields: title, author
 * Optional fields: year, genre
 */
router.put("/:id", (req, res) => {
  const existingBook = booksModel.getBookById(req.params.id);

  if (!existingBook) {
    return res.status(404).json({
      error: "Book not found",
      message: `Cannot update. No book found with ID ${req.params.id}`
    });
  }

  const { title, author, year, genre } = req.body;

  // Validation: required fields
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'title' field is required and must be a non-empty string"
    });
  }

  if (!author || typeof author !== "string" || !author.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'author' field is required and must be a non-empty string"
    });
  }

  if (year !== undefined && (isNaN(Number(year)) || !Number.isInteger(Number(year)))) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'year' field must be an integer"
    });
  }

  const updatedBook = booksModel.updateBook(req.params.id, { title, author, year, genre });
  res.status(200).json(updatedBook);
});

/**
 * DELETE /api/books/:id
 * Deletes a book by ID
 */
router.delete("/:id", (req, res) => {
  const deletedBook = booksModel.deleteBook(req.params.id);

  if (!deletedBook) {
    return res.status(404).json({
      error: "Book not found",
      message: `Cannot delete. No book found with ID ${req.params.id}`
    });
  }

  res.status(200).json({
    message: `Book with ID ${req.params.id} was deleted successfully`,
    book: deletedBook
  });
});

module.exports = router;
