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
      minlength: 20, // ✅ ต้อง ≥ 20 ตัวอักษร
    },

    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
