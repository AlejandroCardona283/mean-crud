import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import itemsRouter from './routes/items.routes.js';

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/items', itemsRouter);

// Server
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 API en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Mongo error:', err.message);
  });