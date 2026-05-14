import { Router } from 'express';
import Item from '../models/item.model.js';

const router = Router();


// 🔥 GET → obtener todos los registros
router.get('/', async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});


// 🔥 POST → crear nuevo registro
router.post('/', async (req, res) => {
  try {
    const created = await Item.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Error creating item' });
  }
});


// 🔥 PUT → actualizar registro
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating item' });
  }
});


// 🔥 DELETE → eliminar registro
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});


export default router;