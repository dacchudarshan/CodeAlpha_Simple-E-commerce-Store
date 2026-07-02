# Simple E-Commerce Store

A simple full-stack e-commerce store built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Overview

This project implements a basic online shopping experience with:
- Product catalog browsing
- Category filtering and search
- Product details pages
- Shopping cart management
- User registration and login
- Order creation and order history
- Admin dashboard for products, orders, and users
- Seeded sample product data

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Vanilla JavaScript
- HTML / CSS
- JWT authentication
- bcrypt password hashing
- dotenv, cors, cookie-parser

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd task_1
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following values:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

4. Start the server:

```bash
npm run dev
```

5. Open the app in a browser:

```text
http://localhost:5000/
```

## Available Scripts

- `npm start` - run the production server
- `npm run dev` - run the server with `nodemon` for development

## Project Structure

- `client/` - frontend pages, CSS, and client-side JavaScript
- `server/` - backend Express app
  - `config/` - database and environment setup
  - `controllers/` - request handlers
  - `data/` - seeded sample product data
  - `middleware/` - auth and error handling
  - `models/` - Mongoose schemas
  - `routes/` - API route definitions
  - `server.js` - application entry point

## API Endpoints

### Authentication

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/auth/profile` - get authenticated user profile
- `PUT /api/auth/profile` - update authenticated user profile

### Products

- `GET /api/products` - list all products
- `GET /api/products/:id` - get single product details
- `POST /api/products` - create a product (admin only)
- `PUT /api/products/:id` - update a product (admin only)
- `DELETE /api/products/:id` - delete a product (admin only)

### Cart

- `GET /api/cart` - fetch current user cart
- `POST /api/cart` - add item to cart
- `PUT /api/cart` - update cart item quantity
- `DELETE /api/cart/:productId` - remove item from cart

### Orders

- `POST /api/orders` - create a new order
- `GET /api/orders/myorders` - fetch orders for logged-in user
- `GET /api/orders/:id` - fetch order details

### Admin

- `GET /api/admin/users` - list users (admin only)
- `DELETE /api/admin/users/:id` - delete user (admin only)
- `GET /api/admin/orders` - list all orders (admin only)
- `PUT /api/admin/orders/:id` - update order status (admin only)

### Seed

- `GET /api/seed` - seed the database with sample products
- `POST /api/seed` - reseed the database with sample products

## Notes

- The frontend is served from the `client/` directory.
- Product images use a local placeholder asset by default.
- The app automatically seeds sample products if the database is empty.

## License

This project is provided under the MIT License.
