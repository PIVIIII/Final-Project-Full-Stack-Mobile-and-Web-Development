import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  searchProducts,
  getProductStats,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);

// ✅ stats ต้องอยู่ก่อน :id
router.get('/stats', getProductStats);

router.get('/', getProducts);

router.get('/search', searchProducts);

router.get('/:id', getProduct);

router.put('/:id', updateProduct);

export default router;
