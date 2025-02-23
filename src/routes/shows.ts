// src/routes/shows.ts
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Show } from '@/src/types/index.ts';

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    // In a real app, this would fetch from your database
    const shows: Show[] = [];
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

// Create new show
router.post('/', async (req, res) => {
  try {
    const { name, time, presenter, synopsis, scheduleType } = req.body;

    // In a real app, this would save to your database
    const show: Show = {
      id: uuidv4(),
      name,
      time,
      presenter,
      synopsis,
      scheduleType,
    };

    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create show' });
  }
});

// Update show
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time, presenter, synopsis, scheduleType } = req.body;

    // In a real app, this would update your database
    res.json({ id, name, time, presenter, synopsis, scheduleType });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update show' });
  }
});

// Delete show
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, this would delete from your database
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete show' });
  }
});

export default router;