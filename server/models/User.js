import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      match: [/^[A-Za-z\s]+$/, 'Username must contain only letters'],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email format invalid'],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    passwordChangedAt: Date,

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
    },

    link: {
      type: String,
    },

    address: {
      type: String,
      required: true,
      minlength: 20,
    },

    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
