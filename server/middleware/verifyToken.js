import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json('Not authenticated');
    }

    if (tokenBlacklist.includes(token)) {
      return res.status(401).json('Token revoked');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json('User not found');
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json('Invalid token');
  }
};
