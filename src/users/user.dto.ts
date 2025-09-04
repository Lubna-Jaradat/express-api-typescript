import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional()
});

export const CreateCoachSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type CreateCoachDto = z.infer<typeof CreateCoachSchema>;