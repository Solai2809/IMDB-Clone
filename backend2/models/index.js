const Sequelize = require('sequelize');
const sequelize = new Sequelize('imdb', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

const Actor = require('./actor')(sequelize, Sequelize.DataTypes);
const Producer = require('./producer')(sequelize, Sequelize.DataTypes);
const Movie = require('./movie')(sequelize, Sequelize.DataTypes);

Actor.associate({ Movie });
Producer.associate({ Movie });
Movie.associate({ Actor, Producer });

sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  Actor,
  Producer,
  Movie
};
