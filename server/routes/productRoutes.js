import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  searchProducts,
  getProductStats,
  getMyProducts,
  deleteProduct,
} from '../controllers/productController.js';

import { verifyToken } from '../middleware/verifyToken.js';
import { restrictTo } from '../middleware/restrictTo.js';

const router = express.Router();

router.post('/', verifyToken, restrictTo('seller', 'admin'), createProduct);

router.get('/stats', verifyToken, restrictTo('admin'), getProductStats);
router.get('/my', verifyToken, getMyProducts);

router.get('/', getProducts);

router.get('/search', searchProducts);

router.get('/:id', getProduct);

router.put('/:id', verifyToken, restrictTo('seller', 'admin'), updateProduct);
router.delete(
  '/:id',
  verifyToken,
  restrictTo('seller', 'admin'),
  deleteProduct,
);

export default router;
