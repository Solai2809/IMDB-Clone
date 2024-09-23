module.exports = (sequelize, DataTypes) => {
    const Producer = sequelize.define('Producer', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
    Producer.associate = (models) => {
      Producer.hasMany(models.Movie);
    };
    return Producer;
  };
  