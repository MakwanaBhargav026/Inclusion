// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose model
const bcrypt = require('bcryptjs');

// POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/update-password', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email, name });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided name and email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
