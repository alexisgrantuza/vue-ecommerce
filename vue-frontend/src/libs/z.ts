import z from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Invalid name'),
  email: z
    .string()
    .email('Invalid email address')
    .min(10, 'Email must be at least 10 characters long')
    .max(255, 'Email must be at most 255 characters long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-\s()]+$/, 'Invalid password'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long')
    .max(15, 'Phone number must be at most 15 characters long')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(255, 'Address must be at most 255 characters long')
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-\s()]+$/, 'Invalid address')
    .optional()
    .or(z.literal('')),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(10, 'Email must be at least 10 characters long')
    .max(255, 'Email must be at most 255 characters long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-\s()]+$/, 'Invalid password'),
})
