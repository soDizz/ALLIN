import { z } from 'zod';

//<--------------------------------------------------------------------->
// Schemas for Slack API Objects
//<--------------------------------------------------------------------->

export const SlackBotProfileSchema = z.object({
  id: z.string(),
  app_id: z.string(),
  name: z.string(),
  icons: z.record(z.string(), z.unknown()),
  deleted: z.boolean(),
  updated: z.number(),
  team_id: z.string(),
});

export const SlackMessageSchema = z.object({
  bot_id: z.string().optional(),
  client_msg_id: z.string().optional(),
  type: z.string(),
  text: z.string(),
  user: z.string(),
  ts: z.string(),
  app_id: z.string().optional(),
  blocks: z.array(z.record(z.string(), z.unknown())).optional(),
  reply_count: z.number().optional(),
  subscribed: z.boolean().optional(),
  last_read: z.string().optional(),
  unread_count: z.number().optional(),
  team: z.string().optional(),
  thread_ts: z.string().optional(),
  parent_user_id: z.string().optional(),
  bot_profile: SlackBotProfileSchema.optional(),
});
export const SlackMessageSchemaForMCP = SlackMessageSchema.pick({
  type: true,
  text: true,
  user: true,
  ts: true,
  thread_ts: true,
});

export type SlackMessage = z.infer<typeof SlackMessageSchema>;

export const SlackChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  created: z.number(),
  creator: z.string(),
  is_archived: z.boolean(),
  is_channel: z.boolean(),
  is_general: z.boolean(),
  is_group: z.boolean(),
  is_im: z.boolean(),
  is_member: z.boolean(),
  is_mpim: z.boolean(),
  is_org_shared: z.boolean(),
  is_pending_ext_shared: z.boolean(),
  is_private: z.boolean(),
  is_shared: z.boolean(),
  name_normalized: z.string(),
  num_members: z.number().nullable(),
  parent_conversation: z.string().nullable(),
  pending_connected_team_ids: z.array(z.string()).optional(),
  pending_shared: z.array(z.string()).optional(),
  previous_names: z.array(z.string()).optional(),
  purpose: z.object({
    creator: z.string(),
    last_set: z.number(),
    value: z.string(),
  }),
  shared_team_ids: z.array(z.string()),
  topic: z.object({
    creator: z.string(),
    last_set: z.number(),
    value: z.string(),
  }),
  unlinked: z.number(),
  updated: z.number().optional(),
  context_team_id: z.string().optional(),
});
export const SlackChannelSchemaForMCP = SlackChannelSchema.pick({
  id: true,
  name: true,
  creator: true,
  is_member: true,
  num_members: true,
});
export type SlackChannel = z.infer<typeof SlackChannelSchema>;

export const SlackResponseMetadataSchema = z.object({
  next_cursor: z.string().optional(),
});
export type SlackResponseMetadata = z.infer<typeof SlackResponseMetadataSchema>;

//<--------------------------------------------------------------------->
// Schemas for Slack API Method Responses
//<--------------------------------------------------------------------->

export const GetSlackChannelsResponseSchema = z.object({
  ok: z.boolean(),
  channels: z.array(SlackChannelSchemaForMCP),
  response_metadata: SlackResponseMetadataSchema,
});
export type GetSlackChannelsResponse = z.infer<typeof GetSlackChannelsResponseSchema>;

export const SlackChannelHistoryResponseSchema = z.object({
  ok: z.boolean(),
  messages: z.array(SlackMessageSchemaForMCP),
  has_more: z.boolean(),
  response_metadata: SlackResponseMetadataSchema.optional(),
});
export type SlackChannelHistoryResponse = z.infer<typeof SlackChannelHistoryResponseSchema>;

export const SlackRepliesResponseSchema = z.object({
  ok: z.boolean(),
  messages: z.array(SlackMessageSchemaForMCP).optional(),
  has_more: z.boolean().optional(),
  response_metadata: SlackResponseMetadataSchema.optional(),
  error: z.string().optional(),
});
export type SlackRepliesResponse = z.infer<typeof SlackRepliesResponseSchema>;

export const PostMessageResponseSchema = z.object({
  ok: z.boolean(),
  channel: z.string(),
  ts: z.string(),
  text: z.string().optional(),
  message: SlackMessageSchemaForMCP,
});
export type PostMessageResponse = z.infer<typeof PostMessageResponseSchema>;

export const AddReactionResponseSchema = z.object({
  ok: z.boolean(),
});
export type AddReactionResponse = z.infer<typeof AddReactionResponseSchema>;

//<--------------------------------------------------------------------->
// Schemas for User
//<--------------------------------------------------------------------->

export const SlackUserProfileSchema = z.object({
  title: z.string(),
  phone: z.string(),
  skype: z.string(),
  real_name: z.string(),
  real_name_normalized: z.string(),
  display_name: z.string(),
  display_name_normalized: z.string(),
  fields: z.record(z.string(), z.any()).nullable(),
  status_text: z.string(),
  status_emoji: z.string(),
  status_emoji_display_info: z.array(z.any()).optional(),
  status_expiration: z.number(),
  avatar_hash: z.string(),
  image_original: z.string().optional(),
  is_custom_image: z.boolean().optional(),
  email: z.string().optional().nullable(),
  huddle_state: z.string().optional(),
  huddle_state_expiration_ts: z.number().optional(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  image_24: z.string(),
  image_32: z.string(),
  image_48: z.string(),
  image_72: z.string(),
  image_192: z.string(),
  image_512: z.string(),
  image_1024: z.string().optional(),
  status_text_canonical: z.string().optional(),
  team: z.string().optional(),
});

export const SlackUserProfileSchemaForMCP = SlackUserProfileSchema.pick({
  real_name: true,
  email: true,
  phone: true,
  title: true,
  image_48: true,
  status_text: true,
});

export const SlackUserSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  name: z.string(),
  deleted: z.boolean(),
  color: z.string().optional(),
  real_name: z.string().optional(),
  tz: z.string().optional().nullable(),
  tz_label: z.string().optional(),
  tz_offset: z.number().optional(),
  profile: SlackUserProfileSchema,
  is_admin: z.boolean().optional(),
  is_owner: z.boolean().optional(),
  is_primary_owner: z.boolean().optional(),
  is_restricted: z.boolean().optional(),
  is_ultra_restricted: z.boolean().optional(),
  is_bot: z.boolean(),
  is_app_user: z.boolean(),
  updated: z.number(),
  is_email_confirmed: z.boolean().optional(),
  who_can_share_contact_card: z.string().optional(),
});

export const SlackUserSchemaForMCP = SlackUserSchema.pick({
  id: true,
  real_name: true,
  deleted: true,
});

export const GetUsersResponseSchema = z.object({
  ok: z.boolean(),
  members: z.array(SlackUserSchemaForMCP),
  response_metadata: SlackResponseMetadataSchema.optional(),
});

export const GetUserProfileResponseSchema = z.object({
  ok: z.boolean(),
  profile: SlackUserProfileSchemaForMCP,
});

export type SlackUser = z.infer<typeof SlackUserSchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
export type GetUserProfileResponse = z.infer<typeof GetUserProfileResponseSchema>;

//<--------------------------------------------------------------------->
// Schemas for AI Function Inputs
//<--------------------------------------------------------------------->

export const GetSlackChannelsInputSchema = z.object({
  limit: z
    .number()
    .optional()
    .describe('Maximum number of channels to return (default 100, max 200)'),
  cursor: z.string().optional().describe('Cursor to start from (default: empty)'),
});

export const PostMessageInputSchema = z.object({
  channel: z.string().describe('Channel ID to send message to. e.g. C1234567890'),
  text: z.string().describe('The formatted text of the message to be published.'),
});

export const ReplyToThreadInputSchema = z.object({
  channel: z.string().describe('Channel ID where the thread is. e.g. C1234567890'),
  thread_ts: z.string().describe('Timestamp of the parent message in the thread.'),
  text: z.string().describe('The formatted text of the reply to be published.'),
});

export const GetChannelHistoryInputSchema = z.object({
  channel: z.string().describe('The conversation ID to fetch history for.'),
  limit: z.number().optional().default(30).describe('The maximum number of items to return.'),
  cursor: z.string().optional().describe('Cursor to start from (default: empty)'),
});

export const GetThreadRepliesInputSchema = z.object({
  channel: z.string().describe('The conversation ID to fetch the thread from.'),
  ts: z.string().describe("Unique identifier of a thread's parent message."),
  limit: z.number().optional().default(10).describe('The maximum number of items to return.'),
  cursor: z.string().optional().describe('Cursor to start from (default: empty)'),
});

export const AddReactionInputSchema = z.object({
  channel: z.string().describe('Channel ID where the message is. e.g. C1234567890'),
  timestamp: z.string().describe('Timestamp of the message to add reaction to.'),
  reaction: z.string().describe('Reaction name. e.g. thumbsup'),
});

export const GetUsersInputSchema = z.object({
  limit: z.number().optional().default(100).describe('The maximum number of items to return.'),
  cursor: z.string().optional().describe('Cursor to start from (default: empty)'),
});

export const GetUserProfileInputSchema = z.object({
  userId: z.string().describe('User ID to fetch profile for.'),
});
