import { z } from 'zod';

const ResponseMetadataSchema = z.object({
  next_cursor: z.string().optional(),
});

// <--------------------------------------------------------------------->
// this is example of one channel response
// {
//     id: 'C08L5KUJDIW',
//     name: '인터렉션-좋아요',
//     is_channel: true,
//     is_group: false,
//     is_im: false,
//     is_mpim: false,
//     is_private: false,
//     created: 1743501950,
//     is_archived: false,
//     is_general: false,
//     unlinked: 0,
//     name_normalized: '인터렉션-좋아요',
//     is_shared: false,
//     is_org_shared: false,
//     is_pending_ext_shared: false,
//     pending_shared: [],
//     context_team_id: 'T0SP44K',
//     updated: 1746661696861,
//     parent_conversation: null,
//     creator: 'U047SSG1',
//     is_ext_shared: false,
//     shared_team_ids: [ 'T04P44K' ],
//     pending_connected_team_ids: [],
//     is_member: true,
//     topic: { value: '', creator: '', last_set: 0 },
//     purpose: {
//       value: '인터렉션관련 리소스, 레퍼런스 공유하면서 영감받는채널',
//       creator: 'U047WSSG1',
//       last_set: 174352054
//     },
//     properties: {
//       tabs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//       tabz: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
//     },
//     previous_names: [],
//     num_members: 6
//   }
export const SlackChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_channel: z.boolean(),
  is_group: z.boolean(),
  is_im: z.boolean(),
  is_mpim: z.boolean(),
  is_private: z.boolean(),
  created: z.number(),
  is_archived: z.boolean(),
  is_general: z.boolean(),
  unlinked: z.number(),
  name_normalized: z.string(),
  is_shared: z.boolean(),
  is_org_shared: z.boolean(),
  is_pending_ext_shared: z.boolean(),
  pending_shared: z.array(z.any()),
  context_team_id: z.string().optional(),
  updated: z.number(),
  parent_conversation: z.string().nullable(),
  creator: z.string(),
  is_ext_shared: z.boolean(),
  shared_team_ids: z.array(z.string()),
  pending_connected_team_ids: z.array(z.any()),
  is_member: z.boolean(),
  topic: z.object({
    value: z.string(),
    creator: z.string(),
    last_set: z.number(),
  }),
  purpose: z.object({
    value: z.string(),
    creator: z.string(),
    last_set: z.number(),
  }),
  properties: z
    .object({
      tabs: z.array(z.any()).optional(),
      tabz: z.array(z.any()).optional(),
    })
    .optional(),
  previous_names: z.array(z.any()),
  num_members: z.number(),
});

export const SlackChannelSchemaForMCP = SlackChannelSchema.pick({
  id: true,
  name: true,
  creator: true,
  is_member: true,
  num_members: true,
});

export const GetSlackChannelsResponseSchema = z.object({
  ok: z.boolean(),
  channels: z.array(SlackChannelSchemaForMCP),
  response_metadata: ResponseMetadataSchema,
});

export type GetSlackChannelsResponse = z.infer<typeof GetSlackChannelsResponseSchema>;

// <--------------------------------------------------------------------->
export const SlackBotProfileSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
  name: z.string(),
  updated: z.number(),
  app_id: z.string(),
  icons: z.object({
    image_36: z.string(),
    image_48: z.string(),
    image_72: z.string(),
  }),
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
  thread_ts: z.string(),
  parent_user_id: z.string().optional(),
  bot_profile: SlackBotProfileSchema.optional(),
});

export const SlackMessageSchemaForMCP = SlackMessageSchema.pick({
  type: true,
  text: true,
  user: true,
  ts: true,
});

export const SlackChannelHistorySchema = z.object({
  ok: z.boolean(),
  messages: z.array(SlackMessageSchemaForMCP),
  response_metadata: ResponseMetadataSchema,
});

export type SlackChannelHistoryResponse = z.infer<typeof SlackChannelHistorySchema>;

// <--------------------------------------------------------------------->

export const SlackRepliesSchema = z.object({
  ok: z.boolean(),
  messages: z.array(SlackMessageSchemaForMCP),
  has_more: z.boolean(),
  response_metadata: ResponseMetadataSchema,
});

export type SlackRepliesResponse = z.infer<typeof SlackRepliesSchema>;
