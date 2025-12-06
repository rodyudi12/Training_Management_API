const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Exercise', {
    name: { type: DataTypes.STRING, allowNull: false },
    muscleGroup: { type: DataTypes.STRING },
    equipment: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    ownerId: { type: DataTypes.INTEGER, allowNull: true } // null => global
  });
};