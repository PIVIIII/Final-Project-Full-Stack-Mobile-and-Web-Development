import express from 'express';
import {
  register,
  login,
  logout,
  checkEmail,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/logout', logout);

export default router;
