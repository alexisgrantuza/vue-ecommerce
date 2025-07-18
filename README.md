# E-commerce Application

A full-stack e-commerce application built with Vue.js, TypeScript, Node.js, and MySQL.

## Project Structure

- `vue-frontend/` - Vue.js 3 frontend application
- `vue-backend/` - Node.js/Express backend API

## Prerequisites

- Node.js (v16 or later)
- MySQL (v8.0 or later)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd vue-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Seed the database with sample products:
   ```bash
   npm run seed
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd vue-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Backend
- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run start` - Start the production server
- `npm run seed` - Seed the database with sample data

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get the user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear the cart
- `POST /api/cart/discount` - Apply discount code

## Environment Variables

### Backend (.env)
```
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Database Schema

### Products
```
id: integer (PK)
name: string
description: text
price: decimal(10,2)
stock: integer
imageUrl: string
category: string
isFeatured: boolean
rating: float
numReviews: integer
createdAt: datetime
updatedAt: datetime
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
