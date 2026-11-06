// In-memory data store for Books resource

let books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genre: "Classic Fiction"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian"
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    genre: "Classic Fiction"
  }
];

let nextId = 4;

function getAllBooks() {
  return [...books];
}

function getBookById(id) {
  const numericId = parseInt(id, 10);
  return books.find((book) => book.id === numericId) || null;
}

function createBook(bookData) {
  const newBook = {
    id: nextId++,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year ? Number(bookData.year) : null,
    genre: bookData.genre ? bookData.genre.trim() : "Unspecified"
  };
  books.push(newBook);
  return newBook;
}

function updateBook(id, bookData) {
  const numericId = parseInt(id, 10);
  const index = books.findIndex((book) => book.id === numericId);
  if (index === -1) {
    return null;
  }

  const updatedBook = {
    id: numericId,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year !== undefined ? Number(bookData.year) : books[index].year,
    genre: bookData.genre !== undefined ? bookData.genre.trim() : books[index].genre
  };

  books[index] = updatedBook;
  return updatedBook;
}

function deleteBook(id) {
  const numericId = parseInt(id, 10);
  const index = books.findIndex((book) => book.id === numericId);
  if (index === -1) {
    return null;
  }

  const [deletedBook] = books.splice(index, 1);
  return deletedBook;
}

function resetBooks(initialData = null) {
  if (initialData) {
    books = [...initialData];
    nextId = Math.max(...books.map(b => b.id), 0) + 1;
  } else {
    books = [
      { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Classic Fiction" },
      { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
      { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Classic Fiction" }
    ];
    nextId = 4;
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  resetBooks
};
