import express from 'express';

import {
  getProducts,
  getProduct,
  createProduct,
  searchProducts,
  updateProduct,
} from '../controllers/productController.js';
const router = express.Router();

router.get('/', getProducts);

router.get('/search', searchProducts);

router.get('/:id', getProduct);

router.post('/', createProduct);

router.put('/:id', updateProduct); // ⭐ ต้องมีบรรทัดนี้

export default router;
