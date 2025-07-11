export interface BaseTool {
  get metaData(): {
    name: string;
    imgUrl: string;
    description?: string;
  };
  get isActive(): boolean;
  get isVerified(): boolean;
  getServerPayload(): unknown;
}
