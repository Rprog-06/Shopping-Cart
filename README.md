#  Shopping Cart Application

A full-stack e-commerce application that provides a seamless shopping experience. The application features product browsing, search, filtering, and a persistent shopping cart. Built with a React frontend and Node.js/Express backend, it demonstrates modern web development practices and clean architecture.

##  Features

### Product Browsing
- View all available products
- Filter products by category (Electronics, Fashion)
- Filter by subcategories (Computers, Mobile, Audio, etc.)
- Search functionality
- Sort by price and relevance

### Shopping Cart
- Add/remove products
- Adjust quantities
- Real-time price calculation
- Persistent cart using localStorage

### Product Details
- Detailed product view
- Image gallery
- Product specifications

## 🛠 Tech Stack

**Frontend:**
- React 18
- React Icons
- Tailwind CSS for styling
- Axios for API calls
- React Context for state management

**Backend:**
- Node.js
- Express.js
- CORS for cross-origin requests

##  Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shopping-cart.git
   cd shopping-cart
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

## 🖥 Running the Application

1. **Start the backend server** (from the backend directory)
   ```bash
   cd backend
   npm start
   ```
   - Server runs on `http://localhost:5000`
   - API documentation available at `http://localhost:5000/api-docs`

2. **Start the frontend development server** (from the client directory)
   ```bash
   cd client
   npm start
   ```
   - Application will open in your browser at `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the test suite:
   ```bash
   npm test
   ```



### Test Coverage
To generate a test coverage report for the backend:
```bash
cd backend
npm test -- --coverage
```

##  Design Decisions & Assumptions

### Architecture
- **Frontend**: Built with React using functional components and hooks for state management
- **Backend**: RESTful API built with Express.js
- **State Management**: React Context API for global state (cart, user preferences)
- **Styling**: Tailwind CSS for utility-first, responsive design

### Key Design Choices
1. **State Management**: 
   - Used React Context for global state to avoid prop drilling
   - Local state for component-specific data
   
2. **Performance**:
   - Implemented React.memo for performance optimization
   - Lazy loading for components
   
3. **Error Handling**:
   - Centralized error handling in the backend
   - User-friendly error messages in the frontend

4. **Testing Strategy**:
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - Component tests for React components

### Assumptions
1. The application is a single-vendor e-commerce platform
2. Product catalog is relatively small (suitable for in-memory storage)
3. No user authentication is required (for MVP)
4. All prices are in USD
5. The cart is persisted in localStorage (not suitable for production)

##  Future Improvements
- Add user authentication
- Implement server-side rendering (Next.js)
- Add payment gateway integration
- Implement product reviews and ratings
- Add admin dashboard for inventory management



##  API Endpoints

### Products
- `GET /api/products` - Get all products
  - Query params:
    - `category`: Filter by category (e.g., 'Electronics', 'Fashion')
    - `subcategory`: Filter by subcategory (e.g., 'Computers', 'Mobile')
    - `search`: Search products by name
    - `sort`: Sort by 'price-asc', 'price-desc', or 'featured'

- `GET /api/products/:id` - Get single product details
- `GET /api/categories` - Get all categories and subcategories

### Cart
- Cart functionality is currently handled client-side using localStorage


##  Notes
- The application uses a mock data store (in-memory) for products
- Cart data persists in the browser's localStorage
- Responsive design works on mobile and desktop devices

