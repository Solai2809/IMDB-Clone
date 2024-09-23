const express = require('express');
const app = express();
const { sequelize } = require('./models');
const movieRoutes = require('./routes/movies');
const actorRoutes = require('./routes/actors');
const producerRoutes = require('./routes/producers');
const cors =require('cors');

app.use(cors());
app.use(express.json());
app.use('/movies', movieRoutes);
app.use('/actors', actorRoutes);
app.use('/producers', producerRoutes);

sequelize.authenticate().then(() => {
  console.log('Database connected...');
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(err => console.error('Database connection error: ', err));
