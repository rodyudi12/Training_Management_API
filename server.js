
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { sequelize } = require('./database');
const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');

// MIDDLEWARE

// JSON parser
app.use(express.json());


// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is running');
});
// ROUTES

// Import routers
const userRoutes = require('./routes/users');
const exerciseRoutes = require('./routes/exercises');
const workoutRoutes = require('./routes/workouts');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

//ERROR HANDLER

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

(async () => {
  try {
    await sequelize.sync(); 

    console.log("Database synced successfully!");
    
    // START SERVER
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("Failed to sync database", err);
  }
})();

