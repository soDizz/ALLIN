import { z } from 'zod';

export const CreateChannelInputSchema = z.object({
  account_id: z.number(),
  name: z.string().optional(),
  channel_img_url: z.string().url().optional(),
  script: z.string().optional(),
  ai_model: z.string().optional(),
});

export type CreateChannelInput = z.infer<typeof CreateChannelInputSchema>;

export const UpdateChannelInputSchema = z.object({
  name: z.string().optional(),
  channel_img_url: z.string().url().optional(),
  script: z.string().optional(),
  ai_model: z.string().optional(),
});

export type UpdateChannelInput = z.infer<typeof UpdateChannelInputSchema>;

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  channel_img_url: z.string().url().optional().nullable(),
  account_id: z.number(),
  script: z.string().optional().nullable(),
  ai_model: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string().optional().nullable(),
  deleted_at: z.string().optional().nullable(),
});

export type Channel = z.infer<typeof ChannelSchema>;
