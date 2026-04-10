const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;
const getBookListWithCallback = (callback) => {
  setTimeout(() => callback(books), 1000);
};
const findBooksByAuthor = (author) => {
  const requestedAuthor = author.trim().toLowerCase();
  return Object.entries(books).reduce((matches, [isbn, book]) => {
    if (book.author.toLowerCase() === requestedAuthor) {
      matches[isbn] = book;
    }
    return matches;
  }, {});
};
const findBooksByTitle = (title) => {
  const requestedTitle = title.trim().toLowerCase();
  return Object.entries(books).reduce((matches, [isbn, book]) => {
    if (book.title.toLowerCase() === requestedTitle) {
      matches[isbn] = book;
    }
    return matches;
  }, {});
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const matches = findBooksByAuthor(req.params.author);
  return res.status(200).json(matches);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const matches = findBooksByTitle(req.params.title);
  return res.status(200).json(matches);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

// Get all books using async callback function
public_users.get('/async/books', function (req, res) {
  getBookListWithCallback((allBooks) => res.status(200).json(allBooks));
});

// Search by ISBN using Promises with Axios
public_users.get('/promise/isbn/:isbn', function (req, res) {
  axios
    .get(`${getBaseUrl(req)}/isbn/${req.params.isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => {
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : { message: "Unable to fetch book by ISBN" };
      return res.status(status).json(message);
    });
});

// Search by author using Promises with Axios
public_users.get('/promise/author/:author', function (req, res) {
  axios
    .get(`${getBaseUrl(req)}/author/${encodeURIComponent(req.params.author)}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => {
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : { message: "Unable to fetch books by author" };
      return res.status(status).json(message);
    });
});

// Search by title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`${getBaseUrl(req)}/title/${encodeURIComponent(req.params.title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : { message: "Unable to fetch books by title" };
    return res.status(status).json(message);
  }
});

module.exports.general = public_users;
