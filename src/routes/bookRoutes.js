const express = require('express');
const { createBook, getBook, getBooks, editBook } = require('../controllers/bookController');
const { authenticateUser } = require('../services/userService');

const router = express.Router();

// POST route to create a book
router.post('/', authenticateUser, createBook);

// GET route to fetch a book (based on bookId)
router.get('/:bookId', authenticateUser, getBook);

// GET route to fetch all books of the user childs
router.get('/', authenticateUser, getBooks);

// PUT route to edit book data
router.put('/:bookId', authenticateUser, editBook);

module.exports = router;
