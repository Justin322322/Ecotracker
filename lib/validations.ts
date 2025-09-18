import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must be at most 100 characters' }),
    email: z.string().email({ message: 'Invalid email address' }).max(255),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(72, { message: 'Password must be at most 72 characters' }),
  })
  .strict();

// type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).max(255),
    password: z.string().min(1, { message: 'Password is required' }).max(72),
  })
  .strict();

// type LoginInput = z.infer<typeof loginSchema>;


