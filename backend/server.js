// API Express + conexión MongoDB
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';


import itemsRouter from './routes/items.routes.js';

const app = express();

app.use(cors({
  origin: "https://mean-crud-o781-iwcol3kg7-alejandro-cardona283-s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

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
  });// API Express + conexión MongoDB
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import itemsRouter from './routes/items.routes.js';

const app = express();

/* =========================
   CORS CONFIG (CORREGIDO)
========================= */
app.use(cors({
  origin: "https://mean-crud-o781-iwcol3kg7-alejandro-cardona283-s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANTE: manejar preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(morgan('dev'));

/* =========================
   RUTAS
========================= */
app.use('/api/items', itemsRouter);

/* =========================
   SERVER + MONGO
========================= */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });