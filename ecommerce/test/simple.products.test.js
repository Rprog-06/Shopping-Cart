const request = require('supertest');
const app = require('../server');

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
    });

    it('should return an array of products', async () => {
      const response = await request(app).get('/api/products');
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
