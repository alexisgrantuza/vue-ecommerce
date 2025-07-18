import express from 'express';
import { getProducts, getProductById } from '../controllers/productController';

const router = express.Router();

// Get all products (public)
router.get('/', getProducts);

// Get product by ID (public)
router.get('/:id', getProductById);



export default router;