import ky, { type KyInstance } from 'ky';

export const ALLIN_API_BASE_URL = 'https://allin-backend.fly.dev';
export const ALLIN_API_BASE_URL_LOCAL = 'http://localhost:8080';

export class ApiAgent {
  private static instance: ApiAgent;
  private bearerToken: string | null = null;
  private kyInstance: KyInstance;

  private constructor() {
    this.kyInstance = ky.create({
      prefixUrl: ALLIN_API_BASE_URL,
      hooks: {
        beforeRequest: [
          request => {
            if (this.bearerToken) {
              request.headers.set(
                'Authorization',
                `Bearer ${this.bearerToken}`,
              );
            }
          },
        ],
      },
    });
  }

  public static getInstance(): ApiAgent {
    if (!ApiAgent.instance) {
      ApiAgent.instance = new ApiAgent();
    }
    return ApiAgent.instance;
  }

  public setBearerToken(token: string | null) {
    this.bearerToken = token;
  }

  public setBaseUrl(
    baseUrl: typeof ALLIN_API_BASE_URL | typeof ALLIN_API_BASE_URL_LOCAL,
  ) {
    this.kyInstance = this.kyInstance.extend({
      prefixUrl: baseUrl,
    });
  }

  public get http(): KyInstance {
    return this.kyInstance;
  }
}
