import { ApiAgent } from '../ApiAgent';
import type { CreateUserInput, LoginWithEmailInput } from './types';
import { UserSchema } from './types';

export * from './types';

const apiAgent = ApiAgent.getInstance();

export const createAuth = async (json: CreateUserInput) => {
  const res = await apiAgent.http.post('auth/create', { json }).json();
  return UserSchema.parse(res);
};

export const loginWithEmail = async (json: LoginWithEmailInput) => {
  const res = await apiAgent.http.post('auth/login', { json }).json();
  return res;
};
