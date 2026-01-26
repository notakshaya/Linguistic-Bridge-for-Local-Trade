const express = require('express');
const router = express.Router();

// Mock user database
const users = new Map();

// Register
router.post('/register', (req, res) => {
  const { email, password, name, userType, languages, location } = req.body;
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    name,
    userType, // 'vendor' or 'buyer'
    languages: languages || ['en'],
    location,
    rating: 5.0,
    completedTrades: 0,
    createdAt: new Date()
  };
  
  users.set(email, user);
  
  res.json({
    success: true,
    user: { ...user, password: undefined },
    token: 'mock-jwt-token'
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    success: true,
    user: { ...user, password: undefined },
    token: 'mock-jwt-token'
  });
});

// Get profile
router.get('/profile/:userId', (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.params.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

module.exports = router;