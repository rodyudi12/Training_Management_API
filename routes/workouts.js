const express = require('express');
const router = express.Router();
const { WorkoutSession, WorkoutItem, Exercise } = require('../database');
const { requireAuth, requireManager } = require('../middleware/auth');

// ---------- WORKOUT SESSIONS ----------

// GET all sessions
router.get('/', requireAuth, async (req, res) => {
  try {
    const sessions = await WorkoutSession.findAll({ include: [WorkoutItem] });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET session by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const session = await WorkoutSession.findByPk(req.params.id, { include: [WorkoutItem] });
    if (!session) return res.status(404).json({ error: 'Workout session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new session
router.post('/', requireAuth, async (req, res) => {
  try {
    const { userId, date, notes } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const session = await WorkoutSession.create({ userId, date, notes });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update session
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const session = await WorkoutSession.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Workout session not found' });

    await session.update(req.body);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE session 
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const session = await WorkoutSession.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: 'Workout session not found' });

    await session.destroy();
    res.json({ message: 'Workout session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- WORKOUT ITEMS ----------

// GET items for a session
router.get('/:sessionId/items', requireAuth, async (req, res) => {
  try {
    const items = await WorkoutItem.findAll({ where: { sessionId: req.params.sessionId }, include: [Exercise] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add workout item to session
router.post('/:sessionId/items', requireAuth, async (req, res) => {
  try {
    const { exerciseId, sets, reps, weight, notes } = req.body;
    const item = await WorkoutItem.create({
      sessionId: req.params.sessionId,
      exerciseId,
      sets,
      reps,
      weight,
      notes
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update workout item
router.put('/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await WorkoutItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Workout item not found' });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE workout item
router.delete('/items/:id', requireAuth, async (req, res) => {
  try {
    const item = await WorkoutItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Workout item not found' });

    await item.destroy();
    res.json({ message: 'Workout item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
