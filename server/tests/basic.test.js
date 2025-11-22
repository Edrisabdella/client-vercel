const request = require('supertest');
const { app } = require('../server');

describe('Basic Server Tests', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should return API info', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});