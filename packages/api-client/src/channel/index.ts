import { z } from 'zod';
import { ApiAgent } from '../ApiAgent';
import type { CreateChannelInput, UpdateChannelInput } from './types';
import { ChannelSchema } from './types';

const apiAgent = ApiAgent.getInstance();

export const createChannel = async (json: CreateChannelInput) => {
  const res = await apiAgent.http.post('channel/create', { json }).json();
  return ChannelSchema.parse(res);
};

export const listChannelsByAccountId = async (accountId: string) => {
  const res = await apiAgent.http.get(`channel/list/${accountId}`).json();
  return z.array(ChannelSchema).parse(res);
};

export const updateChannel = async (
  channelId: string,
  json: UpdateChannelInput,
) => {
  const res = await apiAgent.http
    .put(`channel/update/${channelId}`, { json })
    .json();
  return ChannelSchema.parse(res);
};
