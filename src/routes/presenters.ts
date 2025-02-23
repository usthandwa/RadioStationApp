// src/routes/presenters.ts
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Presenter } from '@/src/types/index.ts';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/presenters'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
});

// Get all presenters
router.get('/', async (req, res) => {
  try {
    // In a real app, this would fetch from your database
    const presenters: Presenter[] = [];
    res.json(presenters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch presenters' });
  }
});

// Create new presenter
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const image = req.file ? `/uploads/presenters/${req.file.filename}` : null;

    // In a real app, this would save to your database
    const presenter: Presenter = {
      id: uuidv4(),
      name,
      bio,
      image: image || '',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.status(201).json(presenter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create presenter' });
  }
});

// Update presenter
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    const image = req.file ? `/uploads/presenters/${req.file.filename}` : undefined;

    // In a real app, this would update your database
    res.json({ id, name, bio, image });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update presenter' });
  }
});

// Archive presenter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, this would mark as archived in your database
    res.json({ message: 'Presenter archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive presenter' });
  }
});

export default router;