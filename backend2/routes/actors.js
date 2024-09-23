const express = require('express');
const { Actor } = require('../models');
const router = express.Router();

// Get all actors
router.get('/', async (req, res) => {
  try {
    const actors = await Actor.findAll();
    res.json(actors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optionally, you can also add an endpoint to get an actor by ID
router.get('/:id', async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (actor) {
      res.json(actor);
    } else {
      res.status(404).json({ error: 'Actor not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new actor
router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Actor name is required' });
      }
  
      const newActor = await Actor.create({ name });
      res.status(201).json(newActor);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
