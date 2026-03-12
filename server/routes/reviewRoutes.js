import express from 'express';
import {
  createOrUpdateReview,
  getReviewsByProduct,
  replyReview,
  getUserReview,
  getReviewsBySeller,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createOrUpdateReview);
router.get('/product/:productId', getReviewsByProduct);
router.put('/reply/:reviewId', replyReview);
router.get('/user/:userId/product/:productId', getUserReview);
router.get('/seller/:sellerId', getReviewsBySeller);

export default router;
