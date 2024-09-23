const express = require('express');
const { Actor, Producer, Movie } = require('../models');
const router = express.Router();

// List all movies with name, year, producer, and actors
router.get('/', async (req, res) => {
  const movies = await Movie.findAll({
    include: [
      { model: Producer, attributes: ['name'] },
      { model: Actor, through: { attributes: [] }, attributes: ['name'] }
    ]
  });
  res.json(movies);
});

// Add a new movie
router.post('/', async (req, res) => {
  const { name, yearOfRelease, producerId, actorIds, newProducer, newActors } = req.body;

  let producer;
  if (newProducer) {
    producer = await Producer.create({ name: newProducer });
  } else {
    producer = await Producer.findByPk(producerId);
  }

  const movie = await Movie.create({ name, yearOfRelease, ProducerId: producer.id });

  if (newActors && newActors.length > 0) {
    const actors = await Promise.all(newActors.map(actorName => Actor.create({ name: actorName })));
    await movie.addActors(actors);
  }

  if (actorIds && actorIds.length > 0) {
    const actors = await Actor.findAll({ where: { id: actorIds } });
    await movie.addActors(actors);
  }

  res.json(movie);
});

// Edit movie details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, yearOfRelease, producerId, actorIds } = req.body;

  const movie = await Movie.findByPk(id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  await movie.update({ name, yearOfRelease, ProducerId: producerId });

  if (actorIds && actorIds.length > 0) {
    const actors = await Actor.findAll({ where: { id: actorIds } });
    await movie.setActors(actors);  // replace existing actors
  }

  res.json(movie);
});

module.exports = router;
