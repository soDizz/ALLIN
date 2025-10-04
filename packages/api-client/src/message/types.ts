import { z } from 'zod';

export const ChatRoleSchema = z.enum(['user', 'assistant', 'system']);

export type ChatRole = z.infer<typeof ChatRoleSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  channel_id: z.string(),
  role: ChatRoleSchema,
  content: z.string(),
  ai_model: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const CreateMessageInputSchema = z.object({
  channel_id: z.string(),
  role: ChatRoleSchema,
  content: z.string(),
  ai_model: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageInputSchema>;
