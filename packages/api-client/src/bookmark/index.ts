import { ApiAgent } from '../ApiAgent';
import { type Message, MessageSchema } from '../message/types';
import {
  type BookmarkStatus,
  BookmarkStatusSchema,
  type CreateBookmarkBody,
} from './types';

const apiAgent = ApiAgent.getInstance();

export const listBookmarks = (channelId: string) => {
  return apiAgent.http
    .get('bookmark/list', {
      searchParams: { channel_id: channelId },
    })
    .json<Message[]>()
    .then(res => MessageSchema.array().parse(res));
};

export const createBookmark = (json: CreateBookmarkBody) => {
  return apiAgent.http
    .post('bookmark/create', { json })
    .json<BookmarkStatus>()
    .then(res => BookmarkStatusSchema.parse(res));
};

export const deleteBookmark = (json: CreateBookmarkBody) => {
  return apiAgent.http
    .delete('bookmark/delete', { json })
    .json<BookmarkStatus>()
    .then(res => BookmarkStatusSchema.parse(res));
};
