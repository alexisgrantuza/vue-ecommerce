// controllers/authController.ts
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { User, AuthRequest } from '../types';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });


const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';


export const authController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, address } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Check if user already exists
      const [existingUsers] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      // Insert new user
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO users (name, email, password, phone, address) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone || null, address || null]
      );

      // Get the created user
      const [newUser] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
      );

      const user = newUser[0] as User;

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set HTTP-only cookie
      res.cookie('auth_Token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      console.log(users);
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });

      }

      const user = users[0] as User;

      // Verify password
      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log(token);

      // Set HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  },

  // Logout user
  logout: async (req: Request, res: Response) => {
    try {
      // Clear the authentication cookie
      res.clearCookie('authToken');

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  },

  // Get user profile
  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0] as User;

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { name, phone, address } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Update user profile
      await pool.execute(
        'UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, phone, address, userId]
      );

      // Get updated user data
      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      const user = users[0] as User;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating profile'
      });
    }
  },

  // Get user by ID (admin function)
  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0] as User;

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching user'
      });
    }
  },

  // Delete user (admin function)
  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const [users] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete user (CASCADE will handle related records)
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting user'
      });
    }
  },
  

  
};

