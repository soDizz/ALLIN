import { z } from 'zod';

export const CreateUserInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  profile_img_url: z.string().url().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UserSchema = z.object({
  id: z.number(),
  identification: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email(),
  profile_img_url: z.string().url().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string().optional().nullable(),
  deleted_at: z.string().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginWithEmailInputSchema = z.object({
  email: z.string().email(),
});

export type LoginWithEmailInput = z.infer<typeof LoginWithEmailInputSchema>;
