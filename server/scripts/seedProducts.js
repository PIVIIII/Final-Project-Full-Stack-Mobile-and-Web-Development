import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    seller_id: '000000000000000000000001', // mock seller
    name: 'Cat Food Premium',
    description: 'อาหารแมวสูตรพรีเมียม',
    price: 250,
    stock: 10,
    tags: ['food'],
  },
  {
    seller_id: '000000000000000000000001',
    name: 'Cat Feather Toy',
    description: 'ของเล่นขนนกสำหรับแมว',
    price: 120,
    stock: 5,
    tags: ['toy'],
  },
  {
    seller_id: '000000000000000000000001',
    name: 'Cat Ball Toy',
    description: 'ลูกบอลของเล่นให้แมววิ่งไล่',
    price: 80,
    stock: 8,
    tags: ['toy'],
  },
  {
    seller_id: '000000000000000000000001',
    name: 'Cat Tuna Food',
    description: 'อาหารแมวรสทูน่า',
    price: 180,
    stock: 12,
    tags: ['food'],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded products');
  mongoose.disconnect();
}

seed();
