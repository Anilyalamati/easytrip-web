import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const destinationsPath = path.join(__dirname, '../data/destinations.json');

router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load destinations' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));
    const item = data.find(d => d.id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase());
    if (!item) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
