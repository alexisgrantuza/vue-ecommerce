import { pool } from "../config/database";
import { Product } from "../types";
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Query to get all products with their categories and images
    const query = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.is_active,
        p.rating,
        p.num_reviews,
        p.discount,
        p.popular,
        p.onSale,
        p.created_at,
        p.updated_at,
        c.id as category_id,
        c.name as category_name,
        GROUP_CONCAT(pi.image_url) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id, c.id
      ORDER BY p.created_at DESC
    `;

    const [rows] = await pool.execute(query);
    const rawProducts = rows as any[];

    // Transform the data to match the Product interface
    const products: Product[] = rawProducts.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      is_active: !!row.is_active,
      rating: parseFloat(row.rating),
      num_reviews: row.num_reviews,
      discount: parseFloat(row.discount),
      popular: !!row.popular,
      onSale: !!row.onSale,
      category: {
        id: row.category_id,
        name: row.category_name,
      },
      images: row.images ? row.images.split(",") : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Enhanced query for single product with category and images
    const query = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.is_active,
        p.rating,
        p.num_reviews,
        p.discount,
        p.popular,
        p.onSale,
        p.created_at,
        p.updated_at,
        c.id as category_id,
        c.name as category_name,
        GROUP_CONCAT(pi.image_url) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id, c.id
    `;

    const [rows] = await pool.execute(query, [id]);
    const rawProducts = rows as any[];

    if (rawProducts.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const row = rawProducts[0];
    const product: Product = {
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      is_active: !!row.is_active,
      rating: parseFloat(row.rating),
      num_reviews: row.num_reviews,
      discount: parseFloat(row.discount),
      popular: !!row.popular,
      onSale: !!row.onSale,
      category: {
        id: row.category_id,
        name: row.category_name,
      },
      images: row.images ? row.images.split(",") : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
