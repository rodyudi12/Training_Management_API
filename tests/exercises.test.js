const request = require('supertest');
const express = require('express');
const { sequelize, Exercise } = require('../database');
const exerciseRoutes = require('../routes/exercises');

const app = express();
app.use(express.json());
app.use('/api/exercises', exerciseRoutes);

beforeAll(async () => await sequelize.sync({ force: true }));
afterAll(async () => await sequelize.close());

describe('Exercise API', () => {
  test('POST /api/exercises - create new exercise', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send({ name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Squat');
  });

  test('GET /api/exercises/:id - return 404 if not found', async () => {
    const res = await request(app).get('/api/exercises/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Exercise not found');
  });
});
