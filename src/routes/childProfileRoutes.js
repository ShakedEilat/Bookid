const express = require('express');
const { createChildProfile, getChildProfile, editChildProfile } = require('../controllers/childProfileController');
const { authenticateUser } = require('../services/userService');

const router = express.Router();

// POST route to create child profile
router.post('/', authenticateUser, createChildProfile);

// GET route to fetch child profile
router.get('/', authenticateUser, getChildProfile);

// PUT route to edit child profile
router.put('/:id', authenticateUser, editChildProfile);

module.exports = router;
