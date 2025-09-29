import { NetworkError } from './NetworkError';

export const wrapError = (err: Error) => {
  const errorMessage = err.message;
  if (errorMessage.includes('getaddrinfo ENOTFOUND')) {
    return new NetworkError(err);
  }

  return err;
};

export const getErrorType = (err: Error) => {
  const wrapped = wrapError(err);
  if (wrapped instanceof NetworkError) {
    return 'NetWorkError';
  }
  return 'Error';
};
