const { sequelize, User, Exercise, WorkoutSession, WorkoutItem } = require('../database/index');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Reset database
    await sequelize.sync({ force: true }); // drops tables and recreates

    // --- USERS ---
    const users = await Promise.all([
      User.create({ username: 'alice', passwordHash: await bcrypt.hash('alice123', 10), role: 'user' }),
      User.create({ username: 'bob', passwordHash: await bcrypt.hash('bob123', 10), role: 'user' }),
      User.create({ username: 'rodrigo', passwordHash: await bcrypt.hash('rodrigo123', 10), role: 'manager' })
    ]);

    // --- EXERCISES ---
    const exercises = await Promise.all([
      Exercise.create({ name: 'Push Up', muscleGroup: 'Chest', equipment: 'Bodyweight', description: 'Push your body up from the floor.' }),
      Exercise.create({ name: 'Squat', muscleGroup: 'Legs', equipment: 'Bodyweight', description: 'Bend knees and lower hips, then stand.' }),
      Exercise.create({ name: 'Bicep Curl', muscleGroup: 'Arms', equipment: 'Dumbbell', description: 'Curl dumbbells toward shoulders.' }),
      Exercise.create({ name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight', description: 'Hold body in straight line from head to heels.' })
    ]);

    // --- WORKOUT SESSIONS ---
    const sessions = await Promise.all([
      WorkoutSession.create({ userId: users[0].id, notes: 'Morning session, feeling strong!' }),
      WorkoutSession.create({ userId: users[1].id, notes: 'Evening session, focus on legs.' })
    ]);

    // --- WORKOUT ITEMS ---
    await Promise.all([
      WorkoutItem.create({ sessionId: sessions[0].id, exerciseId: exercises[0].id, sets: 3, reps: 12, weight: null, notes: 'Focus on form' }),
      WorkoutItem.create({ sessionId: sessions[0].id, exerciseId: exercises[2].id, sets: 3, reps: 10, weight: 10, notes: 'Use light dumbbells' }),
      WorkoutItem.create({ sessionId: sessions[1].id, exerciseId: exercises[1].id, sets: 4, reps: 15, weight: null, notes: 'Deep squats' }),
      WorkoutItem.create({ sessionId: sessions[1].id, exerciseId: exercises[3].id, sets: 2, reps: 1, weight: null, notes: 'Hold 1 min each' })
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
