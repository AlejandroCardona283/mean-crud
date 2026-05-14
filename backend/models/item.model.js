import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  consumoDiario: Number,
  dias: Number,
  tarifa: Number,
  consumoMensual: Number,
  costoMensual: Number,
  clasificacion: String
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);