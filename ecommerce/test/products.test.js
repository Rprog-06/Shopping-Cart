const request = require('supertest');
const app = require('../server');

// Test the products endpoint
describe('Products API', () => {
  let response;
  
  beforeAll(async () => {
    try {
      // Make the request once for all tests
      response = await request(app).get('/api/products');
      
      // Basic response validation
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  it('should return products with valid image URLs', () => {
    response.body.forEach(product => {
      expect(product).toHaveProperty('imageUrl');
      expect(product.imageUrl).toMatch(/^https?:\/\//);
    });
  });

  it('should return products with valid price values', () => {
    response.body.forEach(product => {
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it('should have valid categories and subcategories', () => {
    const validCategories = ['Electronics', 'Fashion'];
    const validSubcategories = ['Computers', 'Mobile', 'Audio', 'Photography', 'Wearables', 'Footwear', 'Accessories', 'Bags'];
    
    response.body.forEach(product => {
      expect(product).toHaveProperty('category');
      expect(validCategories).toContain(product.category);
      expect(validSubcategories).toContain(product.subcategory);
    });
  });

  it('should have non-empty descriptions', () => {
    response.body.forEach(product => {
      expect(typeof product.description).toBe('string');
      expect(product.description.length).toBeGreaterThan(0);
    });
  });
});
