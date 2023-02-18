const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST /api/users/register: create a new user (open to anyone)
router.post('/register', userController.registerUser);

// POST /api/users/login: log in an existing user (open to anyone)
router.post('/login', userController.loginUser);

module.exports = router;
