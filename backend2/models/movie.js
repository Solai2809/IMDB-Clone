module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      yearOfRelease: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    });
    Movie.associate = (models) => {
      Movie.belongsTo(models.Producer);
      Movie.belongsToMany(models.Actor, { through: 'ActorMovies' });
    };
    return Movie;
  };
  