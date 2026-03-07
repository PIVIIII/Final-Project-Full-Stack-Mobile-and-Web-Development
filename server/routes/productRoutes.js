import express from 'express';

import {
  getProducts,
  getProduct,
  createProduct,
  searchProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/search', searchProducts);

router.get('/:id', getProduct);

router.post('/', createProduct);

export default router;
