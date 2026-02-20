// auth.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const users = []; // In-memory user store

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }
    
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).send('User already exists.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered.');
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials.');
    }
    
    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
