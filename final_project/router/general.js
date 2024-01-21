const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });
      //console.log(users);
      return res.status(200).json({message: "Customer successfully registered. Now you can login."})
    } else {
      return res.status(404).json({message: "User already exists!"});   
    }
  }

  return res.status(404).json({message: "Unable to register, please enter the username and password."})
});

//* Get the book list available in the shop
// public_users.get('/',function (req, res) {
  // res.send(JSON.stringify(books, null, 4))
// });

// Get the book list with async-await and promises
public_users.get('/', async (req, res) =>{
  try {
    const promiseBooks = await new Promise((resolve, reject) => {
      return resolve(books);
    });
    res.send(JSON.stringify(promiseBooks));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//* Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//  let isbn = req.params.isbn;

//  if (books[isbn]) {
//    return res.send(JSON.stringify(books[isbn], null, 4));
//  }
//  return res.status(404).json({message: "There are no books with this ISBN code."})
// });

// Get book based on ISBN with async-await and promises
function getBookByISBNAsync(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "There are no books with this ISBN code." });
    }
  });
}

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    let isbn = req.params.isbn;
    const book = await getBookByISBNAsync(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "There are no books with this ISBN code." });
  }
});
  
//* Get book details based on author
//public_users.get('/author/:author',function (req, res) {
//  let author = req.params.author;
//  let filteredBooks = [];

//  for (let book in books) {
    // create a "deep copy" of each book to not modify the original object
//    let eachBook = {...books[book]};
//    if (books[book].author.toLowerCase() === author.toLowerCase()) {

//      eachBook.ISBN = book;
//      delete eachBook.author;

//      filteredBooks.push(eachBook);
//    }
//  };

//  if (filteredBooks.length > 0) {
//    res.send(JSON.stringify({ "booksbyauthor": filteredBooks}, null, 4));
//  } else {
//    return res.status(404).json({message: "There are no books from this Author."});
//  }
//});


// Get book based on author with async-await
function getBooksByAuthorAsync(author) {
  let filteredBooks = [];

  for (let book in books) {
    let eachBook = { ...books[book] };
    if (books[book].author.toLowerCase() === author.toLowerCase()) {
      eachBook.ISBN = book;
      delete eachBook.author;
      filteredBooks.push(eachBook);
    }
  }

  return filteredBooks;
}

public_users.get('/author/:author', async function (req, res) {
  try {
    let author = req.params.author;
    const filteredBooks = await getBooksByAuthorAsync(author);

    if (filteredBooks.length > 0) {
      res.send(JSON.stringify({ "booksbyauthor": filteredBooks }, null, 4));
    } else {
      return res.status(404).json({ message: "There are no books from this Author." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//* Get all books based on title
//public_users.get('/title/:title',function (req, res) {
//  let title = req.params.title;
//  let filteredBooks = [];

//  for (let book in books) {
    // create a "deep copy" of each book to not modify the original object
//    let eachBook = {...books[book]};
//    if (books[book].title.toLowerCase() === title.toLowerCase()) {

//      eachBook.ISBN = book;
//      delete eachBook.title;

//      filteredBooks.push(eachBook);
//    }
//  };

//  if (filteredBooks.length > 0) {
//    res.send(JSON.stringify({ "booksbytitle": filteredBooks}, null, 4));
//  } else {
//    return res.status(404).json({message: "There are no books with this title."});
//  }
//});

// Get all books based on title with async-await
function getBooksByTitleAsync(title) {
  let filteredBooks = [];

  for (let book in books) {
    let eachBook = { ...books[book] };
    if (books[book].title.toLowerCase() === title.toLowerCase()) {
      eachBook.ISBN = book;
      delete eachBook.title;
      filteredBooks.push(eachBook);
    }
  }

  return filteredBooks;
}

public_users.get('/title/:title', async function (req, res) {
  try {
    let title = req.params.title;
    const filteredBooks = await getBooksByTitleAsync(title);

    if (filteredBooks.length > 0) {
      res.send(JSON.stringify({ "booksbytitle": filteredBooks }, null, 4));
    } else {
      return res.status(404).json({ message: "There are no books with this title." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    console.log(books[isbn].reviews);
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "There are no books with this ISBN code."})
});

module.exports.general = public_users;
