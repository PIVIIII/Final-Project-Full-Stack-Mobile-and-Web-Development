import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const ipTracker = {};

app.use(morgan('dev'));

app.use(
  cors({
    origin: ['http://localhost:19006', 'http://localhost:8081'],
    credentials: true,
  }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/scan', (req, res) => {
  const userToken = req.query.token;

  console.log(userToken);

  if (userToken === 'admin') {
    return res.status(200).json({
      status: 'authorized',
      clearance: 'high',
    });
  }

  return res.status(401).json({
    status: 'unauthorized',
  });
});

app.get('/health', (req, res) => {
  const uptime = process.uptime();

  const memoryBytes = process.memoryUsage().rss;
  const memoryMB = Math.round(memoryBytes / 1024 / 1024);

  res.json({
    status: 'ok',
    uptime: uptime,
    memory_usage_mb: memoryMB,
    timestamp: new Date().toISOString(),
  });
});

app.get('/task', (req, res) => {
  const clientIp = req.ip;

  const now = Date.now();
  const WINDOW_TIME = 10000;
  const MAX_REQUEST = 5;

  if (!ipTracker[clientIp]) {
    ipTracker[clientIp] = {
      count: 1,
      startTime: now,
    };
  } else {
    const elapsed = now - ipTracker[clientIp].startTime;

    if (elapsed > WINDOW_TIME) {
      ipTracker[clientIp] = {
        count: 1,
        startTime: now,
      };
    } else {
      ipTracker[clientIp].count += 1;
    }
  }

  const data = ipTracker[clientIp];

  if (data.count > MAX_REQUEST) {
    const remaining = Math.ceil((WINDOW_TIME - (now - data.startTime)) / 1000);

    return res.status(429).json({
      error: 'Too many requests',
      retry_after: remaining,
    });
  }

  res.json({
    message: 'Task completed successfully!',
    request_count: data.count,
  });

  setTimeout(() => {
    delete ipTracker[clientIp];
  }, WINDOW_TIME);
});
app.listen(process.env.PORT, () => {
  console.log('Identity Scanner Server is running on http://localhost:8080');
});
