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
      unique: true,
    },

    description: String,

    originalPrice: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be less than 0'],
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      enum: ['food', 'toy', 'litter', 'accessory', 'health'],
      required: true,
    },

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
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 5,
        message: 'Images must be between 1 and 5 files',
      },
    },
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.virtual('salePrice').get(function () {
  return this.originalPrice * ((100 - this.discountPercent) / 100);
});

export default mongoose.model('Product', ProductSchema);
