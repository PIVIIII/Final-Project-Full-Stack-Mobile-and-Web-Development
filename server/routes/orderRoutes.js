import express from 'express';
import {
  createOrder,
  getOrdersByUser,
  getOrdersBySeller,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);

router.get('/user/:userId', getOrdersByUser);
router.get('/seller/:sellerId', getOrdersBySeller);

export default router;
