const { Sequelize } = require('sequelize');
const path = require('path');

// Folder where DB file will be stored
const dataDir = path.join(__dirname);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'database.sqlite'),
  logging: false,
});

// Import model definitions
const User = require('../models/User')(sequelize);
const Exercise = require('../models/Exercise')(sequelize);
const WorkoutSession = require('../models/WorkoutSession')(sequelize);
const WorkoutItem = require('../models/WorkoutItem')(sequelize);

// Associations
User.hasMany(WorkoutSession, { foreignKey: 'userId', onDelete: 'CASCADE' });
WorkoutSession.belongsTo(User, { foreignKey: 'userId' });

WorkoutSession.hasMany(WorkoutItem, { foreignKey: 'sessionId', onDelete: 'CASCADE' });
WorkoutItem.belongsTo(WorkoutSession, { foreignKey: 'sessionId' });

Exercise.hasMany(WorkoutItem, { foreignKey: 'exerciseId' });
WorkoutItem.belongsTo(Exercise, { foreignKey: 'exerciseId' });

module.exports = { sequelize, User, Exercise, WorkoutSession, WorkoutItem };
