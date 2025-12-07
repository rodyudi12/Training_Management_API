const express = require('express');
const router = express.Router();
const { User } = require('../database');
const { requireAuth, requireManager } = require('../middleware/auth');

// GET all users (manager only)
router.get('/', requireAuth, requireManager, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID (manager or self)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Compare using loose equality to handle number/string mismatch
    if (req.user.role !== 'manager' && req.user.id != user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update user (manager or self)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.user.role !== 'manager' && req.user.id != user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE user (manager only)
router.delete('/:id', requireAuth, requireManager, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
