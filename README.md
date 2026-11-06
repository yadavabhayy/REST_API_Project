# Books REST API (Express)

A lightweight, clean REST API built with Node.js and Express that implements full CRUD (Create, Read, Update, Delete) operations over a `books` resource. Designed with strict JSON in / JSON out formatting and appropriate HTTP status codes (200, 201, 400, 404, 500).

---

## Features

- **Four standard CRUD operations**:
  - `GET /api/books` — List all books
  - `GET /api/books/:id` — Retrieve a single book
  - `POST /api/books` — Create a new book
  - `PUT /api/books/:id` — Update an existing book completely
  - `DELETE /api/books/:id` — Delete a book
- **JSON in & JSON out**: Every request body (for POST/PUT) and all responses (including errors and 404s) are serialized as JSON.
- **Accurate HTTP status codes**:
  - `200 OK` for successful fetches, updates, and deletions
  - `201 Created` for successful resource creations
  - `400 Bad Request` for validation failures and malformed JSON
  - `404 Not Found` for non-existent record IDs and unknown endpoints
- **Zero external test dependencies**: Includes an automated test suite utilizing Node.js's native test runner (`node:test`).

---

## Project Structure

```text
├── src/
│   ├── app.js          # Express application config, middleware, routes
│   ├── server.js       # Server startup entry point
│   ├── routes/
│   │   └── books.js    # CRUD route handlers for /api/books
│   └── data/
│       └── books.js    # In-memory data store and helper functions
├── test/
│   └── api.test.js     # Automated test suite using node:test
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher; developed on v24)
- npm (v9.0.0 or higher)

### Installation

1. Clone or download this repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <YOUR_REPOSITORY_DIR>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the API server:
```bash
npm start
```

The server will start listening at:
```
http://localhost:3000
```

You can optionally configure a different port using the `PORT` environment variable:
```bash
PORT=4000 npm start
```

### Running the Automated Tests

Run the test suite:
```bash
npm test
```

All 15 test assertions will execute against the endpoints and verify status codes, payload structures, and edge cases.

---

## API Reference & Endpoints

| Method | Endpoint | Description | Success Status | Missing / Error Status |
|---|---|---|---|---|
| `GET` | `/` | API status and route documentation | `200 OK` | — |
| `GET` | `/api/books` | Retrieve all books | `200 OK` | — |
| `GET` | `/api/books/:id` | Retrieve single book by ID | `200 OK` | `404 Not Found` |
| `POST` | `/api/books` | Create a new book | `201 Created` | `400 Bad Request` |
| `PUT` | `/api/books/:id` | Replace / update an existing book | `200 OK` | `404 Not Found` / `400 Bad Request` |
| `DELETE` | `/api/books/:id` | Delete a book by ID | `200 OK` | `404 Not Found` |

---

## Testing with `curl`

Once the server is running (`npm start`), test the endpoints in your terminal:

### 1. Welcome / Health Check
```bash
curl -X GET http://localhost:3000/
```

### 2. Get All Books (`GET /api/books`)
```bash
curl -X GET http://localhost:3000/api/books
```

### 3. Get Book by ID (`GET /api/books/:id`)
```bash
# Existing book
curl -X GET http://localhost:3000/api/books/1

# Missing book (Returns 404 Not Found)
curl -X GET http://localhost:3000/api/books/999
```

### 4. Create a New Book (`POST /api/books`)
```bash
# Success (Returns 201 Created)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "year": 1932,
    "genre": "Dystopian"
  }'

# Validation Failure - Missing Title (Returns 400 Bad Request)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Aldous Huxley"
  }'
```

### 5. Update a Book (`PUT /api/books/:id`)
```bash
# Success (Returns 200 OK)
curl -X PUT http://localhost:3000/api/books/2 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nineteen Eighty-Four: Commemorative Edition",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Political Fiction"
  }'

# Missing record (Returns 404 Not Found)
curl -X PUT http://localhost:3000/api/books/999 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ghost Book",
    "author": "No One"
  }'
```

### 6. Delete a Book (`DELETE /api/books/:id`)
```bash
# Success (Returns 200 OK)
curl -X DELETE http://localhost:3000/api/books/3

# Missing record (Returns 404 Not Found)
curl -X DELETE http://localhost:3000/api/books/999
```

---

## Decisions Made & Design Notes

1. **Resource Choice**:
   - A `books` resource was selected because it represents a clear, tangible real-world entity with required fields (`title`, `author`) and optional attributes (`year`, `genre`).
2. **In-Memory Data Store**:
   - For an exercise drill, an in-memory array with utility methods keeps the application self-contained with zero database setup overhead, while adhering strictly to REST conventions.
3. **Separation of Concerns**:
   - `src/app.js` initializes middleware, error handlers, and route mounts.
   - `src/server.js` starts the network listener on `PORT`. This separation allows the test suite in `test/api.test.js` to spin up ephemeral test servers on dynamic ports without port conflicts.
4. **JSON In & Out Guarantee**:
   - Handled via `express.json()`.
   - Added custom error handling middleware for malformed JSON request bodies so clients receive `{ "error": "Bad Request", "message": "Malformed JSON payload in request body" }` (400) rather than standard Express HTML error pages.
   - All response routes explicitly call `.json(...)`.
5. **Accurate HTTP Status Codes**:
   - Querying, updating, or deleting a record that does not exist returns `404 Not Found`.
   - Submitting a payload with missing required fields or invalid types returns `400 Bad Request`.
   - Resource creation returns `201 Created`.
   - Deletion returns `200 OK` with details of the deleted record and a confirmation message.
