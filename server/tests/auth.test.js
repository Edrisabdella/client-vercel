const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Use test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/openlearn-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'student'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data).toHaveProperty('name', 'Test User');
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
    });

    it('should not register user with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // First create a user
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});