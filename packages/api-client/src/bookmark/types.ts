import { z } from 'zod';

export const CreateBookmarkBodySchema = z.object({
  message_id: z.string(),
});

export type CreateBookmarkBody = z.infer<typeof CreateBookmarkBodySchema>;

export const BookmarkStatusSchema = z.object({
  bookmark: z.boolean(),
});

export type BookmarkStatus = z.infer<typeof BookmarkStatusSchema>;
