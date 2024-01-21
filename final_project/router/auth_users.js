const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let usersWithSameName = users.filter((user)=>{
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return false
  } else {
    return true
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  })

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// 1. logging customers
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 2. verify if user and pass exists at request body
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // 3. validate user exists in the data base and generate an session token if true
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: password },
      'access',
      { expiresIn: 60*60 }
    )
    // 4. add "authorization" attribute to request session
    req.session.authorization = {
      accessToken,
      username
    }

    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid logging. Check username and password again" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let user = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.query.review;

  if (books[isbn]) {
    books[isbn].reviews[user] = review;
    return res.status(202).json({message: `The review for the book with ISBN ${isbn} has been added/updated.`});
  }
  return res.status(404).json({message: "There are no books with this ISBN code."})
});

// Delete Book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let user = req.session.authorization.username;
  let isbn = req.params.isbn;

  if (books[isbn]) {
    if (books[isbn].reviews[user]) {
      delete books[isbn].reviews[user];
      return res.status(202).json({message: `Reviews for the ISBN ${isbn} posted by the user ${user} deleted`});
    } else {
      return res.status(404).json({message: "This user hasn't written any reviews yet."})
    }
  }
  return res.status(404).json({message: "There are no books with this ISBN code."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
