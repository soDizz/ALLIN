import { ApiAgent } from '../ApiAgent';
import { type CreateMessageInput, type Message, MessageSchema } from './types';

export * from './types';

const apiAgent = ApiAgent.getInstance();

export const createMessage = (json: CreateMessageInput) => {
  return apiAgent.http
    .post('message/create', { json })
    .json<Message>()
    .then(res => MessageSchema.parse(res));
};

export const listMessages = (channelId: string) => {
  return apiAgent.http
    .get(`message/list/${channelId}`)
    .json<Message[]>()
    .then(res => MessageSchema.array().parse(res));
};
