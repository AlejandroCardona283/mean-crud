// API Express + conexión MongoDB
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';


import itemsRouter from './routes/items.routes.js';

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://mean-crud-o781.vercel.app'
  ]
}));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/items', itemsRouter);

// Arranque
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 API http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });