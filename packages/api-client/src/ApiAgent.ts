import ky, { type KyInstance } from 'ky';

export class ApiAgent {
  private static instance: ApiAgent;
  private bearerToken: string | null = null;
  private kyInstance: KyInstance;

  private constructor() {
    this.kyInstance = ky.create({
      prefixUrl: 'https://allin-backend.fly.dev',
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

  public get http(): KyInstance {
    return this.kyInstance;
  }
}
