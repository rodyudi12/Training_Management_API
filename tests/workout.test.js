const request = require('supertest');
const express = require('express');
const { sequelize, User, Exercise, WorkoutSession } = require('../database');
const workoutRoutes = require('../routes/workouts');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);

let token;
let session;
let exercise;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create manager user and login
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'manager', password: 'pass', role: 'manager' });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'manager', password: 'pass' });

  token = res.body.token;

  // Create an exercise
  exercise = await Exercise.create({ name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' });

  // Create a workout session
  session = await WorkoutSession.create({ userId: 1, notes: 'Leg day' });
});

afterAll(async () => await sequelize.close());

describe('Workout API', () => {
  test('POST /api/workouts - create new workout session', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 1, notes: 'Arm day' });

    expect(res.statusCode).toBe(201);
    expect(res.body.notes).toBe('Arm day');
  });

  test('POST /api/workouts/:sessionId/items - add item to workout session', async () => {
    const res = await request(app)
      .post(`/api/workouts/${session.id}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ exerciseId: exercise.id, sets: 3, reps: 12 });

    expect(res.statusCode).toBe(201);
    expect(res.body.sets).toBe(3);
  });

  test('GET /api/workouts/:id - fetch workout session', async () => {
    const res = await request(app)
      .get(`/api/workouts/${session.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(session.id);
  });

  test('GET /api/workouts/:id - return 404 if session not found', async () => {
    const res = await request(app)
      .get('/api/workouts/9999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Workout session not found');
  });
});