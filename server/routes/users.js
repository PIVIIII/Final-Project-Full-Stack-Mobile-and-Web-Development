import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getUsers);

router.put('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

export default router;
