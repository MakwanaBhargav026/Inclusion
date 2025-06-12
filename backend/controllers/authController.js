const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Signin error', error: err });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: 'Click the link to reset your password. (Add reset logic in frontend)',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: 'Email sending failed', error });
      res.json({ message: 'Password reset email sent' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Forgot password error', error: err });
  }
};

module.exports = { signup, signin, forgotPassword };
