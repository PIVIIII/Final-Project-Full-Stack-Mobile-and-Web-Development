import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  changePassword,
} from '../controllers/authController.js';

import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getUsers); // ⭐ ต้องใส่
router.get('/:id', verifyToken, getUserById); // ⭐ ต้องใส่

router.put('/:id', verifyToken, updateUser);

router.put('/change-password/me', verifyToken, changePassword);

router.delete('/:id', verifyToken, deleteUser);

export default router;
