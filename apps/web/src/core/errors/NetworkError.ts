export class NetworkError extends Error {
  constructor(err: Error) {
    super();
    this.name = 'NetworkError';
    this.cause = err;
  }
}
