const request = require('supertest');
const express = require('express');
const { sequelize, User } = require('../database');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

let managerToken;
let testUser;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create manager
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'manager', password: 'pass', role: 'manager' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'manager', password: 'pass' });

  managerToken = loginRes.body.token;

  // Create test user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'pass', role: 'user' });

  testUser = userRes.body.user;
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  test('GET /api/users/:id - return 404 if user not found', async () => {
    const res = await request(app)
      .get('/api/users/9999')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  test('GET /api/users - manager can fetch all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});