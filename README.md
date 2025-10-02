# Shopping-Cart
E-Commerce Store A modern, responsive e-commerce application built with React for the frontend and Node.js/Express for the backend. This project showcases a clean, user-friendly interface for browsing products, adding them to cart, and processing checkouts.
✨ Features
Product Display: Fetches and displays a list of products in a clean, responsive grid.
Shopping Cart: Full cart functionality including adding items, updating quantities, and removing items.
Client-Side State: Cart state is managed on the client and persists through page refreshes using localStorage.
Simulated Checkout: A checkout process that sends the cart data to a backend endpoint and logs the order.
RESTful API: A simple and effective backend API to serve products and handle checkouts.
🛠 Tech Stack
Frontend: React, CSS
Backend: Node.js, Express.js
Testing: Jest, Supertest
🚀 Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Node.js (v14 or later)
npm (comes with Node.js)
Installation & Setup
Clone the repository:
bash
git clone https://github.com/Rprog-06/Shopping-Cart.git
cd Shopping-Cart
Set up the Backend:
bash
# Navigate to the backend directory
cd ecommerce

# Install dependencies
npm install
Set up the Frontend:
bash
# Navigate to the frontend directory from the root
cd client

# Install dependencies
npm install
Running the Application
You need to run both the backend and frontend servers simultaneously in two separate terminals.

Start the Backend Server:
bash
# In the /ecommerce directory
npm start
The backend will be running on http://localhost:5000.
Start the Frontend Development Server:
bash
# In the /client directory
npm start
The React application will open automatically in your browser at http://localhost:3000.
🧪 Running Tests
The backend includes a test suite to verify the /api/products endpoint.

To run the tests, navigate to the ecommerce directory and run:

bash
# In the /ecommerce directory
npm test
This command will execute the Jest test suite and show the results in your terminal.

📝 Assumptions & Design Choices
No Database: To keep the project simple, the product list is hardcoded as a JSON array in the backend server. A database like MongoDB or PostgreSQL would be the next step for a production application.
Client-Side Cart Management: The shopping cart state is managed entirely on the client-side using React's useState and useEffect hooks. localStorage is used to persist the cart, providing a good user experience without needing a backend session or user accounts.
Simplified Checkout: The checkout process is simulated. The frontend sends the cart data to the /api/checkout endpoint, which simply logs the order to the console and returns a success message. No payment processing or order fulfillment is implemented.
Styling: Tailwind css is considered
Single Repository: Both frontend and backend code are managed in a single monorepo for ease of setup and development. In a larger team or project, these might be split into separate repositories.
