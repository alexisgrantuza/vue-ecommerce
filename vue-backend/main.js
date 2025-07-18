// import axios from "axios";
// import { pool } from "./database";

// interface FakeStoreProduct {
//   id: number;
//   title: string;
//   image: string;
//   price: number;
//   description: string;
//   brand: string;
//   model: string;
//   color: string;
//   category: string;
//   discount?: number;
//   popular?: boolean;
//   onSale?: boolean;
// }

// interface FakeStoreResponse {
//   status: string;
//   message: string;
//   products: FakeStoreProduct[];
// }

// const seedData = async () => {
//   const connection = await pool.getConnection();
  
//   try {
//     // First, seed categories from the products
//     const productsResponse = await axios.get<FakeStoreResponse>("https://fakestoreapi.in/api/products?limit=150");
//     const products = productsResponse.data.products;
    
//     console.log("Seeding categories...");
    
//     // Extract unique categories from products
//     const uniqueCategories = [...new Set(products.map(product => product.category))];
    
//     for (let i = 0; i < uniqueCategories.length; i++) {
//       const categoryName = uniqueCategories[i];
//       const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
//       await connection.execute(
//         "INSERT IGNORE INTO categories (id, name, image, slug) VALUES (?, ?, ?, ?)",
//         [
//           i + 1,
//           categoryName,
//           `https://via.placeholder.com/300x200?text=${encodeURIComponent(categoryName)}`,
//           categorySlug
//         ]
//       );
//     }
    
//     console.log("Categories seeded successfully");
    
//     // Then seed products
//     console.log("Seeding products...");
    
//     for (const product of products) {
//       // Find category ID
//       const categoryId = uniqueCategories.indexOf(product.category) + 1;
      
//       // Insert product with all FakeStore API fields
//       await connection.execute(
//         `INSERT INTO products (
//           id, title, description, price, brand, model, color, 
//           category_id, image, discount, popular, onSale
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           product.id,
//           product.title,
//           product.description,
//           product.price,
//           product.brand || null,
//           product.model || null,
//           product.color || null,
//           categoryId,
//           product.image,
//           product.discount || 0,
//           product.popular || false,
//           product.onSale || false
//         ]
//       );
//     }
    
//     console.log("Products seeded successfully");
    
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     connection.release();
//   }
// };

// // Alternative function to seed from a smaller dataset (first 20 products)
// const seedLimitedData = async () => {
//   const connection = await pool.getConnection();
  
//   try {
//     // Seed categories and products with limit
//     const productsResponse = await axios.get<FakeStoreResponse>("https://fakestoreapi.in/api/products?limit=20");
//     const products = productsResponse.data.products;
    
//     console.log("Seeding categories...");
    
//     // Extract unique categories from products
//     const uniqueCategories = [...new Set(products.map(product => product.category))];
    
//     for (let i = 0; i < uniqueCategories.length; i++) {
//       const categoryName = uniqueCategories[i];
//       const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
//       await connection.execute(
//         "INSERT IGNORE INTO categories (id, name, image, slug) VALUES (?, ?, ?, ?)",
//         [
//           i + 1,
//           categoryName,
//           `https://via.placeholder.com/300x200?text=${encodeURIComponent(categoryName)}`,
//           categorySlug
//         ]
//       );
//     }
    
//     console.log("Limited categories seeded successfully");
    
//     // Seed limited products
//     console.log("Seeding limited products...");
    
//     for (const product of products) {
//       // Find category ID
//       const categoryId = uniqueCategories.indexOf(product.category) + 1;
      
//       // Insert product with all FakeStore API fields
//       await connection.execute(
//         `INSERT INTO products (
//           id, title, description, price, brand, model, color, 
//           category_id, image, discount, popular, onSale
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           product.id,
//           product.title,
//           product.description,
//           product.price,
//           product.brand || null,
//           product.model || null,
//           product.color || null,
//           categoryId,
//           product.image,
//           product.discount || 0,
//           product.popular || false,
//           product.onSale || false
//         ]
//       );
//     }
    
//     console.log("Limited products seeded successfully");
    
//   } catch (error) {
//     console.error("Error seeding limited data:", error);
//   } finally {
//     connection.release();
//   }
// };

// // Function to seed by category
// const seedByCategory = async (categoryName: string, limit: number = 50) => {
//   const connection = await pool.getConnection();
  
//   try {
//     console.log(`Seeding products for category: ${categoryName}`);
    
//     // Get all products first, then filter by category
//     const productsResponse = await axios.get<FakeStoreResponse>(`https://fakestoreapi.in/api/products?limit=${limit}`);
//     const allProducts = productsResponse.data.products;
//     const categoryProducts = allProducts.filter(product => 
//       product.category.toLowerCase() === categoryName.toLowerCase()
//     );
    
//     if (categoryProducts.length === 0) {
//       console.log(`No products found for category: ${categoryName}`);
//       return;
//     }
    
//     // Seed the specific category
//     const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
//     await connection.execute(
//       "INSERT IGNORE INTO categories (name, image, slug) VALUES (?, ?, ?)",
//       [
//         categoryName,
//         `https://via.placeholder.com/300x200?text=${encodeURIComponent(categoryName)}`,
//         categorySlug
//       ]
//     );
    
//     // Get the category ID
//     const [categoryRows] = await connection.execute(
//       "SELECT id FROM categories WHERE slug = ?",
//       [categorySlug]
//     ) as any;
    
//     const categoryId = categoryRows[0]?.id;
    
//     if (!categoryId) {
//       console.error(`Failed to get category ID for: ${categoryName}`);
//       return;
//     }
    
//     // Seed products for this category
//     for (const product of categoryProducts) {
//       await connection.execute(
//         `INSERT IGNORE INTO products (
//           id, title, description, price, brand, model, color, 
//           category_id, image, discount, popular, onSale
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           product.id,
//           product.title,
//           product.description,
//           product.price,
//           product.brand || null,
//           product.model || null,
//           product.color || null,
//           categoryId,
//           product.image,
//           product.discount || 0,
//           product.popular || false,
//           product.onSale || false
//         ]
//       );
//     }
    
//     console.log(`Successfully seeded ${categoryProducts.length} products for category: ${categoryName}`);
    
//   } catch (error) {
//     console.error(`Error seeding category ${categoryName}:`, error);
//   } finally {
//     connection.release();
//   }
// };

// // Function to clear all data (useful for re-seeding)
// const clearData = async () => {
//   const connection = await pool.getConnection();
  
//   try {
//     console.log("Clearing existing data...");
    
//     // Clear in reverse order due to foreign key constraints
//     await connection.execute("DELETE FROM products");
//     await connection.execute("DELETE FROM categories");
    
//     // Reset auto-increment counters
//     await connection.execute("ALTER TABLE products AUTO_INCREMENT = 1");
//     await connection.execute("ALTER TABLE categories AUTO_INCREMENT = 1");
    
//     console.log("Data cleared successfully");
    
//   } catch (error) {
//     console.error("Error clearing data:", error);
//   } finally {
//     connection.release();
//   }
// };

// // Function to seed sample users (for testing)
// const seedSampleUsers = async () => {
//   const connection = await pool.getConnection();
  
//   try {
//     console.log("Seeding sample users...");
    
//     const sampleUsers = [
//       {
//         name: "John Doe",
//         email: "john@example.com",
//         password: "$2b$10$example_hashed_password", // In real app, hash the password
//         phone: "+1234567890",
//         address: "123 Main St, City, State 12345",
//         role: "customer"
//       },
//       {
//         name: "Jane Smith",
//         email: "jane@example.com",
//         password: "$2b$10$example_hashed_password",
//         phone: "+0987654321",
//         address: "456 Oak Ave, City, State 67890",
//         role: "customer"
//       },
//       {
//         name: "Admin User",
//         email: "admin@example.com",
//         password: "$2b$10$example_hashed_password",
//         role: "admin"
//       }
//     ];
    
//     for (const user of sampleUsers) {
//       await connection.execute(
//         "INSERT IGNORE INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
//         [user.name, user.email, user.password, user.phone || null, user.address || null, user.role]
//       );
//     }
    
//     console.log("Sample users seeded successfully");
    
//   } catch (error) {
//     console.error("Error seeding sample users:", error);
//   } finally {
//     connection.release();
//   }
// };

// // Run the seeder
// const runSeeder = async () => {
//   try {
//     // Optional: Clear existing data first
//     // await clearData();
    
//     // Seed sample users
//     await seedSampleUsers();
    
//     // Choose one of the following options:
    
//     // Option 1: Seed limited data (20 products)
//     //await seedLimitedData();
    
//     // Option 2: Seed all data (up to 150 products)
//     await seedData();
    
//     // Option 3: Seed by specific category
//     // await seedByCategory('electronics', 30);
    
//     console.log('🎉 Seeding completed successfully');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Seeding failed:', error);
//     process.exit(1);
//   }
// };

// if (require.main === module) {
//   runSeeder();
// }

// export { seedData, seedLimitedData, seedByCategory, clearData, seedSampleUsers };












// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   address?: string;
//   role: "customer" | "admin";
//   created_at: Date;
//   updated_at: Date;
// }

// export interface Category {
//   id: number;
//   name: string;
//   image: string;
//   slug: string;
//   created_at?: Date;
//   updated_at?: Date;
// }

// export interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   brand?: string;
//   model?: string;
//   color?: string;
//   category?: Category;
//   image: string;
//   discount?: number;
//   popular?: boolean;
//   onSale?: boolean;
//   created_at?: Date;
//   updated_at?: Date;
// }

// export interface Cart {
//   id: number;
//   user_id: number;
//   product_id: number;
//   quantity: number;
//   created_at: Date;
//   updated_at: Date;
// }

// export interface Order {
//   id: number;
//   user_id: number;
//   total_amount: number;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
//   shipping_address: string;
//   payment_method: string;
//   payment_status: "pending" | "paid" | "failed";
//   created_at: Date;
//   updated_at: Date;
// }

// export interface OrderItem {
//   id: number;
//   order_id: number;
//   product_id: number;
//   quantity: number;
//   price: number;
//   created_at: Date;
// }

// // Extended types for API responses and joined data
// export interface CartWithProduct extends Cart {
//   product: Product;
// }

// export interface OrderWithItems extends Order {
//   items: (OrderItem & { product: Product })[];
// }

// export interface AuthRequest extends Request {
//   user?: User;
// }


// import { pool } from './database';

// const createTables = async () => {
//   try {
//     // Users table
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         phone VARCHAR(20),
//         address TEXT,
//         role ENUM('customer', 'admin') DEFAULT 'customer',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);

//     // Categories table
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         image VARCHAR(500),
//         slug VARCHAR(255) UNIQUE NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);

//     // Products table - Updated to match FakeStore API structure
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS products (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         price DECIMAL(10, 2) NOT NULL,
//         brand VARCHAR(255),
//         model VARCHAR(255),
//         color VARCHAR(100),
//         category_id INT,
//         image VARCHAR(500) NOT NULL,
//         discount DECIMAL(5, 2) DEFAULT 0,
//         popular BOOLEAN DEFAULT FALSE,
//         onSale BOOLEAN DEFAULT FALSE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
//       )
//     `);

//     // Carts table
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS carts (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         product_id INT NOT NULL,
//         quantity INT NOT NULL DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//         FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
//         UNIQUE KEY unique_user_product (user_id, product_id)
//       )
//     `);

//     // Orders table
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT NOT NULL,
//         total_amount DECIMAL(10, 2) NOT NULL,
//         status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
//         shipping_address TEXT NOT NULL,
//         payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
//         payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//       )
//     `);

//     // Order items table
//     await pool.execute(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         order_id INT NOT NULL,
//         product_id INT NOT NULL,
//         quantity INT NOT NULL,
//         price DECIMAL(10, 2) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
//         FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
//       )
//     `);

//     console.log('✅ All tables created successfully');
//   } catch (error) {
//     console.error('❌ Error creating tables:', error);
//     throw error;
//   }
// };

// // Run migration
// const runMigration = async () => {
//   try {
//     await createTables();
//     console.log('🎉 Migration completed successfully');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Migration failed:', error);
//     process.exit(1);
//   }
// };

// if (require.main === module) {
//   runMigration();
// }

// export { createTables };

















// import { pool } from "../config/database";
// import { Product } from "../types";
// import { Request, Response } from "express";

// export const getProducts = async (req: Request, res: Response) => {
//     try {
//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             ORDER BY p.created_at DESC
//         `;
        
//         const [rows] = await pool.execute(query);
//         const rawProducts = rows as any[];
        
//         const products: Product[] = rawProducts.map(row => ({
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: row.category_id ? {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             } : undefined,
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         }));
        
//         res.json(products);
//         console.log(products);
//     } catch (error) {
//         console.error('Get products error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const getProductById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
        
//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.id = ?
//         `;

//         const [rows] = await pool.execute(query, [id]);
//         const rawProducts = rows as any[];
        
//         if (rawProducts.length === 0) {
//             return res.status(404).json({ error: 'Product not found' });
//         }
        
//         const row = rawProducts[0];
//         const product: Product = {
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: row.category_id ? {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             } : undefined,
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         };

//         res.json(product);
//     } catch (error) {
//         console.error('Get product error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const getProductsByCategory = async (req: Request, res: Response) => {
//     try {
//         const { categoryId } = req.params;
        
//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.category_id = ?
//             ORDER BY p.created_at DESC
//         `;

//         const [rows] = await pool.execute(query, [categoryId]);
//         const rawProducts = rows as any[];
        
//         const products: Product[] = rawProducts.map(row => ({
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             },
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         }));

//         res.json(products);
//     } catch (error) {
//         console.error('Get products by category error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const getPopularProducts = async (req: Request, res: Response) => {
//     try {
//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.popular = true
//             ORDER BY p.created_at DESC
//         `;

//         const [rows] = await pool.execute(query);
//         const rawProducts = rows as any[];
        
//         const products: Product[] = rawProducts.map(row => ({
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: row.category_id ? {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             } : undefined,
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         }));

//         res.json(products);
//     } catch (error) {
//         console.error('Get popular products error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const getProductsOnSale = async (req: Request, res: Response) => {
//     try {
//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.onSale = true
//             ORDER BY p.discount DESC, p.created_at DESC
//         `;

//         const [rows] = await pool.execute(query);
//         const rawProducts = rows as any[];
        
//         const products: Product[] = rawProducts.map(row => ({
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: row.category_id ? {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             } : undefined,
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         }));

//         res.json(products);
//     } catch (error) {
//         console.error('Get products on sale error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// export const searchProducts = async (req: Request, res: Response) => {
//     try {
//         const { q } = req.query;
        
//         if (!q || typeof q !== 'string') {
//             return res.status(400).json({ error: 'Search query is required' });
//         }

//         const query = `
//             SELECT 
//                 p.id,
//                 p.title,
//                 p.description,
//                 p.price,
//                 p.brand,
//                 p.model,
//                 p.color,
//                 p.image,
//                 p.discount,
//                 p.popular,
//                 p.onSale,
//                 p.created_at,
//                 p.updated_at,
//                 c.id as category_id,
//                 c.name as category_name,
//                 c.image as category_image,
//                 c.slug as category_slug
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.title LIKE ? 
//                OR p.description LIKE ? 
//                OR p.brand LIKE ?
//                OR c.name LIKE ?
//             ORDER BY p.created_at DESC
//         `;

//         const searchTerm = `%${q}%`;
//         const [rows] = await pool.execute(query, [searchTerm, searchTerm, searchTerm, searchTerm]);
//         const rawProducts = rows as any[];
        
//         const products: Product[] = rawProducts.map(row => ({
//             id: row.id,
//             title: row.title,
//             description: row.description,
//             price: row.price,
//             brand: row.brand,
//             model: row.model,
//             color: row.color,
//             category: row.category_id ? {
//                 id: row.category_id,
//                 name: row.category_name,
//                 image: row.category_image,
//                 slug: row.category_slug
//             } : undefined,
//             image: row.image,
//             discount: row.discount,
//             popular: Boolean(row.popular),
//             onSale: Boolean(row.onSale),
//             created_at: row.created_at,
//             updated_at: row.updated_at
//         }));

//         res.json(products);
//     } catch (error) {
//         console.error('Search products error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };