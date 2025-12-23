/**
 * Presenter Routes
 *
 * TODO: Implement CRUD operations for presenters
 */

import { Router } from 'express';

const router = Router();

// GET /api/presenters - List all presenters
router.get('/', async (req, res) => {
  // TODO: Implement
  res.status(501).json({ error: 'Not implemented' });
});

// GET /api/presenters/:id - Get presenter by ID
router.get('/:id', async (req, res) => {
  // TODO: Implement
  res.status(501).json({ error: 'Not implemented' });
});

// POST /api/presenters - Create new presenter
router.post('/', async (req, res) => {
  // TODO: Implement authentication middleware
  // TODO: Validate request body
  // TODO: Create presenter in database
  res.status(501).json({ error: 'Not implemented' });
});

// PUT /api/presenters/:id - Update presenter
router.put('/:id', async (req, res) => {
  // TODO: Implement authentication middleware
  // TODO: Validate request body
  // TODO: Update presenter in database
  res.status(501).json({ error: 'Not implemented' });
});

// DELETE /api/presenters/:id - Delete presenter
router.delete('/:id', async (req, res) => {
  // TODO: Implement authentication middleware
  // TODO: Check if presenter is used in shows
  // TODO: Delete presenter from database
  res.status(501).json({ error: 'Not implemented' });
});

// PATCH /api/presenters/:id/archive - Archive presenter
router.patch('/:id/archive', async (req, res) => {
  // TODO: Implement authentication middleware
  // TODO: Set is_archived = true
  res.status(501).json({ error: 'Not implemented' });
});

// PATCH /api/presenters/:id/restore - Restore archived presenter
router.patch('/:id/restore', async (req, res) => {
  // TODO: Implement authentication middleware
  // TODO: Set is_archived = false
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
