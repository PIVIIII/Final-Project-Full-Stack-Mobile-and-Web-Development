import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { product_id, quantity, user_id } = req.body;

    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // C1 check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Not enough stock',
      });
    }

    // C3 calculate price
    const totalPrice = product.price * quantity;

    // C4 atomic update
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: product_id,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(400).json({
        error: 'Stock changed, try again',
      });
    }

    const order = new Order({
      user_id,
      product_id,
      quantity,
      totalPrice,
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};
