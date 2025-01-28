const express = require('express');
const Matter = require('../models/matter');
const { loadSolidMatters, saveSolidMatters } = require('../utils/solidMatters');

const router = express.Router();

router.post('/', async (req, res) => {
  const { id, name } = req.body;
  try {
    const matter = new Matter({ id, name });
    await matter.save();
    res.status(201).json(matter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  try {
    const matter = await Matter.findOne({ id });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });

    if (matter.state === 'solid') {
      return res.status(400).json({ error: 'Cannot update state of a solid matter' });
    }

    matter.state = state;
    await matter.save();

    if (state === 'solid') {
      const solidMatters = loadSolidMatters();
      solidMatters.push(matter.toObject());
      saveSolidMatters(solidMatters);
    }

    res.json(matter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const matter = await Matter.findOne({ id });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });

    if (matter.state === 'solid') {
      return res.status(400).json({ error: 'Cannot delete a solid matter' });
    }

    await Matter.deleteOne({ id });
    res.json({ message: 'Matter deleted', matter });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { state } = req.query;
  try {
    const filter = state ? { state } : {};
    const matters = await Matter.find(filter);
    res.json(matters);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/counts', async (req, res) => {
  try {
    const total = await Matter.countDocuments();
    const states = await Matter.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } }
    ]);
    res.json({ total, states });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const matter = await Matter.findOne({ id });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json(matter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  try {
    const matter = await Matter.findOne({ id });
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    res.json({ id: matter.id, name: matter.name, stateHistory: matter.stateHistory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
