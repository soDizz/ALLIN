import { ApiAgent } from '../ApiAgent';

const apiAgent = ApiAgent.getInstance();

export const getHealth = () => {
  return apiAgent.http.get('health');
};

export const getAuthHealth = () => {
  return apiAgent.http.get('health/auth');
};
