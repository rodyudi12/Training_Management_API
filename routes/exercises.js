const express = require('express');
const router = express.Router();
const { Exercise } = require('../database');
const { requireAuth, requireManager } = require('../middleware/auth');

// GET all exercises
router.get('/', async (req, res) => {
  const exercises = await Exercise.findAll();
  res.json(exercises);
});

// GET exercise by ID
router.get('/:id', async (req, res) => {
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
  res.json(exercise);
});

// POST create exercise (manager only)
router.post('/', requireAuth, requireManager, async (req, res) => {
  const { name, muscleGroup, equipment, description, ownerId } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const exercise = await Exercise.create({ name, muscleGroup, equipment, description, ownerId });
  res.status(201).json(exercise);
});

// PUT update exercise (manager only)
router.put('/:id', requireAuth, requireManager, async (req, res) => {
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

  await exercise.update(req.body);
  res.json(exercise);
});

// DELETE exercise (manager only)
router.delete('/:id', requireAuth, requireManager, async (req, res) => {
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

  await exercise.destroy();
  res.json({ message: 'Exercise deleted' });
});

module.exports = router;
