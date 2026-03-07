import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express(); // ⭐ ต้องสร้าง app ก่อน

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ⭐ ใช้ middleware หลังสร้าง app

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
