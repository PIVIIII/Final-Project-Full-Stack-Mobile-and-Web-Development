import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.minPrice) {
      filter.originalPrice = { $gte: Number(req.query.minPrice) };
    }

    const products = await Product.find(filter);

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
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({
        error: 'At least 1 image required',
      });
    }

    const product = new Product({
      seller_id: req.body.seller_id,
      name: req.body.name,
      description: req.body.description,
      originalPrice: Number(req.body.originalPrice),
      discountPercent: Number(req.body.discountPercent) || 0,
      stock: Number(req.body.stock) || 0,
      category: req.body.category,
      tags: req.body.tags || [],
      images: req.body.images,
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { q, keyword, tags, page = 1, limit = 10 } = req.query;

    let filter = {};

    // รองรับทั้ง q และ keyword
    const searchText = q || keyword;

    if (searchText) {
      filter.name = { $regex: searchText, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $all: tagArray };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      data: products,
      metadata: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNumber),
        currentPage: pageNumber,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json('Product not found');
    }

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /api/products/stats
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $addFields: {
          salePrice: {
            $multiply: [
              '$originalPrice',
              { $divide: [{ $subtract: [100, '$discountPercent'] }, 100] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          maxSalePrice: { $max: '$salePrice' },
          avgSalePrice: { $avg: '$salePrice' },
          totalProducts: { $sum: 1 },
        },
      },
    ]);

    // ✅ C5 ถ้าไม่มีข้อมูล
    if (stats.length === 0) {
      return res.json({
        maxSalePrice: null,
        avgSalePrice: null,
        totalProducts: 0,
      });
    }

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};
