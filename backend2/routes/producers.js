const express = require('express');
const { Producer } = require('../models');
const router = express.Router();

// Get all producers
router.get('/', async (req, res) => {
  try {
    const producers = await Producer.findAll();
    res.json(producers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optionally, you can also add an endpoint to get a producer by ID
router.get('/:id', async (req, res) => {
  try {
    const producer = await Producer.findByPk(req.params.id);
    if (producer) {
      res.json(producer);
    } else {
      res.status(404).json({ error: 'Producer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Producer name is required' });
      }
  
      const newProducer = await Producer.create({ name });
      res.status(201).json(newProducer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
