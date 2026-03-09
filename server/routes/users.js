import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById); // ⭐ เพิ่มอันนี้

router.put('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

export default router;
