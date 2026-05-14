import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import itemsRouter from './routes/items.routes.js';

// ✅ APP SIEMPRE PRIMERO
const app = express();

// =========================
// CORS
// =========================
app.use(cors({
  origin: "https://mean-crud-o781-iwcol3kg7-alejandro-cardona283-s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("/*", cors());

// =========================
// MIDDLEWARES
// =========================
app.use(express.json());
app.use(morgan('dev'));

// =========================
// ROUTES
// =========================
app.use('/api/items', itemsRouter);

// =========================
// SERVER
// =========================
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