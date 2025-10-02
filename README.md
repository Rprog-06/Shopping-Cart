#  E-Commerce Store

A modern, full-stack e-commerce application built with React and Node.js. This project provides a seamless shopping experience with product browsing, cart management, and checkout functionality.

##  Features

- **Product Catalog**
  - Browse products by categories and subcategories
  - Search and filter products
  - Sort by price, popularity, and rating
  - Product details with images and specifications

- **Shopping Cart**
  - Add/remove items
  - Adjust quantities
  - Real-time price calculation
  - Persistent cart using localStorage

- **User Experience**
  - Responsive design for all devices
  - Smooth animations and transitions
  - Intuitive navigation

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, Context API
- **Styling**: CSS Modules, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite

## 🚀 Getting Started

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

### Running the Application

1. **Start the backend server** (from the backend directory)
   ```bash
   cd backend
    node server.js
   ```
   - Server runs on `http://localhost:5000`

2. **Start the frontend development server** (from the client directory)
   ```bash
   cd client
   npm start
   ```
   - Application will open in your browser at `http://localhost:3000`

## 🧪 Running Tests


```bash
# For backend
cd backend
npx jest --verbose
```


##  Design Decisions

### Architecture
- **Frontend**: Component-based architecture with React
- **State Management**: Context API for global state
- **Styling**: CSS Modules for component-scoped styles
- **API**: RESTful endpoints with Express.js

### Key Design Choices
1. **State Management**
   - Used React Context for global state to avoid prop drilling
   - Local state for component-specific data

2. **Performance**
   - Implemented React.memo for performance optimization
   - Code splitting for better load times

3. **Error Handling**
   - Centralized error handling in the backend
   - User-friendly error messages in the frontend

### Assumptions
1. The application is a single-vendor e-commerce platform
2. No user authentication is required (for MVP)
3. The cart is persisted in localStorage
4. All prices are in Rupees


