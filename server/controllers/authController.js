import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json('Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json('Email already exists');
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role: req.body.role || 'buyer',
    });

    await user.save();

    const { password, ...other } = user._doc;

    res.json(other);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json('User not found');
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      return res.status(401).json('Wrong password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret');

    const { password, ...other } = user._doc;

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400000,
    });

    res.json({ user: other });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');

  res.json({
    message: 'Logged out successfully',
  });
};
