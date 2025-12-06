const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('WorkoutItem', {
    sessionId: { type: DataTypes.INTEGER, allowNull: false },
    exerciseId: { type: DataTypes.INTEGER, allowNull: false },
    sets: { type: DataTypes.INTEGER, defaultValue: 3 },
    reps: { type: DataTypes.INTEGER, defaultValue: 8 },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    notes: { type: DataTypes.TEXT }
  });
};
