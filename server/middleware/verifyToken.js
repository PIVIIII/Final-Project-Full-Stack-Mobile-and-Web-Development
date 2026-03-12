import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json('Not authenticated');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    // C1 Ghost User Test
    if (!user) {
      return res
        .status(401)
        .json('User belonging to this token no longer exist');
    }

    if (user.isDeleted) {
      return res.status(401).json('User deleted');
    }

    // C2 Password change test
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10,
      );

      if (decoded.iat < changedTimestamp) {
        return res.status(401).json('Password recently changed');
      }
    }

    req.user = user; // C4 inject user

    next();
  } catch (err) {
    return res.status(401).json('Invalid token'); // C5
  }
};
