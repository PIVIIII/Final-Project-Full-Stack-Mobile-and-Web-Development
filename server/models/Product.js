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
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('Product', ProductSchema);
