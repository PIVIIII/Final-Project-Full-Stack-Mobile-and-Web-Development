import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const loginAttempts = {};
export const register = async (req, res) => {
  try {
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json('Password must be at least 6 characters');
    }

    if (req.body.phone && !/^\d{10}$/.test(req.body.phone)) {
      return res.status(400).json('Phone must be 10 digits');
    }

    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
      return res.status(400).json('Invalid email format');
    }

    if (!req.body.address || req.body.address.length < 20) {
      return res.status(400).json('Address must be at least 20 characters');
    }

    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json('Email already exists');
    }

    const hash = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: hash,
      phone: req.body.phone,
      link: req.body.link,
      address: req.body.address,
      role: req.body.role || 'buyer',
      isDeleted: false,
      deletedAt: null,
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
    const ip = req.ip;

    if (!loginAttempts[ip]) {
      loginAttempts[ip] = { count: 0, blockUntil: null };
    }

    if (
      loginAttempts[ip].blockUntil &&
      Date.now() < loginAttempts[ip].blockUntil
    ) {
      return res.status(429).json('Too many login attempts. Try again later.');
    }

    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      isDeleted: false,
    }).select('+password');

    if (!user) {
      await new Promise((r) => setTimeout(r, 2000)); // delay 2 sec

      loginAttempts[ip].count++;

      if (loginAttempts[ip].count >= 3) {
        loginAttempts[ip].blockUntil = Date.now() + 15 * 60 * 1000;
      }

      return res.status(401).json('Wrong email or password');
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      await new Promise((r) => setTimeout(r, 2000)); // delay

      loginAttempts[ip].count++;

      if (loginAttempts[ip].count >= 3) {
        loginAttempts[ip].blockUntil = Date.now() + 15 * 60 * 1000;
      }

      return res.status(401).json('Wrong email or password');
    }

    // reset attempts
    loginAttempts[ip] = { count: 0, blockUntil: null };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password, ...other } = user._doc;

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false, // dev mode
    //   sameSite: 'lax', // หรือ 'none' ถ้าต้องการข้าม origin
    // });
    res.json({ user: other, token });
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

export const checkEmail = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();

    console.log('EMAIL CHECK:', email);

    const user = await User.findOne({ email });

    console.log('USER FOUND:', user);

    if (user) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const currentUser = req.user;

    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return res.status(403).json('You can update only your account');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          phone: req.body.phone,
          link: req.body.link,
          address: req.body.address,
        },
      },
      { new: true },
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const currentUser = req.user;

    console.log('DELETE USER:', { currentUser });

    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return res.status(403).json('You can delete only your account');
    }

    await User.findByIdAndUpdate(userId, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.json({
      message: 'ลบข้อมูลสำเร็จ',
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const valid = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!valid) {
      return res.status(401).json('Current password incorrect');
    }

    const newHash = await bcrypt.hash(req.body.newPassword, 12);

    user.password = newHash;
    user.passwordChangedAt = new Date();

    await user.save();

    res.json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
