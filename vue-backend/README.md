# Ecommerce Backend API

A complete Node.js backend with TypeScript and MySQL for an ecommerce website featuring products, orders, cart, and user management.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (customer/admin)
  - Password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Product search and filtering
  - Stock management
  - Category-based organization

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Stock validation
  - Cart persistence

- **Order Management**
  - Order creation from cart
  - Order status tracking
  - Order history
  - Stock deduction on purchase
  - Order cancellation

- **User Management**
  - User registration/login
  - Profile management
  - Password change
  - Admin user management

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, bcrypt

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and JWT configuration.

4. Create database and run migrations:
   ```bash
   npm run build
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `GET /api/orders/admin/all` - Get all orders (admin only)

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/admin/all` - Get all users (admin only)
- `GET /api/users/admin/:id` - Get user by ID (admin only)
- `PUT /api/users/admin/:id/role` - Update user role (admin only)
- `DELETE /api/users/admin/:id` - Delete user (admin only)

## Database Schema

### Users
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `phone`
- `address`
- `role` (customer/admin)
- `created_at`
- `updated_at`

### Products
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `stock_quantity`
- `category`
- `image_url`
- `is_active`
- `created_at`
- `updated_at`

### Carts
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `product_id` (Foreign Key)
- `quantity`
- `created_at`
- `updated_at`

### Orders
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `total_amount`
- `status` (pending/processing/shipped/delivered/cancelled)
- `shipping_address`
- `payment_method`
- `payment_status`
- `created_at`
- `updated_at`

### Order Items
- `id` (Primary Key)
- `order_id` (Foreign Key)
- `product_id` (Foreign Key)
- `quantity`
- `price`
- `created_at`

## Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS configuration
- Helmet security headers
- SQL injection prevention with parameterized queries

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Environment Variables

Required environment variables:
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - CORS origin URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License