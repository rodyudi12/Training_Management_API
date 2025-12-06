const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('WorkoutSession', {
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
};
