import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true, // ✅ C4 ชื่อสินค้าห้ามซ้ำ
    },

    description: String,

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be less than 0'], // ✅ C2
    },

    stock: {
      type: Number,
      default: 0,
    },

    // ✅ C3 enum category
    category: {
      type: String,
      enum: ['food', 'toy', 'litter', 'accessory', 'health'],
      required: true,
    },

    // ✅ tag สำหรับสินค้าแมว
    tags: {
      type: [String],
      enum: [
        'dryfood',
        'wetfood',
        'snack',
        'catnip',
        'toy',
        'scratcher',
        'litter',
        'carrier',
        'bed',
        'grooming',
      ],
    },
  },
  { timestamps: true }, // ✅ C6
);

export default mongoose.model('Product', ProductSchema);
