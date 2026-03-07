import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { keyword, tag, category } = req.query;

    let filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    if (tag) {
      filter.tags = tag;
    }

    if (category) {
      filter.category_id = category;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};
