const request = require('supertest');
const app = require('../server');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Products API', () => {
  // Test the /api/products endpoint
  describe('GET /api/products', () => {
    it('should return status 200 and an array of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // If there are products, check their structure
      if (response.body.length > 0) {
        const product = response.body[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('subcategory');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('description');
      }
    });
  });
});
