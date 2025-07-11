import { RESOURCE_SERVER } from '@/lib/resourceServerPath';
import { rx } from '@/lib/rxjs/rx';
import type { BaseTool } from '../BaseTool';
import { ToolManager } from '../ToolManager';

const SLACK_TOOL_NAME = 'SlackTool';

export class SlackTool implements BaseTool {
  private static instance: SlackTool;
  private name: typeof SLACK_TOOL_NAME = SLACK_TOOL_NAME;
  private toolManager: ToolManager;

  #metaData = rx({
    name: this.name,
    imgUrl: `${RESOURCE_SERVER}/tool-image/slack-icon.png`,
  });
  #isActive = rx(false);
  #isVerified = rx(false);
  #cert = {
    API_KEY: '',
    WORKSPACE_ID: '',
  };

  public static getInstance() {
    if (!SlackTool.instance) {
      SlackTool.instance = new SlackTool(ToolManager.getInstance());
    }
    return SlackTool.instance;
  }

  constructor(toolManager: ToolManager) {
    this.toolManager = toolManager;
    this.toolManager.registerTool(this);
  }

  get metaData() {
    return this.#metaData.get();
  }
  get isActive() {
    return this.#isActive.get();
  }
  get isVerified() {
    return this.#isVerified.get();
  }
  get cert() {
    return this.#cert;
  }

  get metaData$() {
    return this.#metaData.$.asObservable();
  }
  get isActive$() {
    return this.#isActive.$.asObservable();
  }
  get isVerified$() {
    return this.#isVerified.$.asObservable();
  }
  get cert$() {
    return rx(this.#cert).$.asObservable();
  }

  public setMetaData(newMetaData: typeof this.metaData) {
    this.#metaData.set(newMetaData);
  }
  public setIsActive(isActive: boolean) {
    this.#isActive.set(isActive);
  }
  public setIsVerified(isVerified: boolean) {
    this.#isVerified.set(isVerified);
  }
  public setCert(cert: { API_KEY: string; WORKSPACE_ID: string }) {
    this.#cert = cert;
  }

  public getServerPayload(): SlackToolServerPayload {
    return {
      name: this.name,
      isActive: this.isActive,
      cert: this.cert,
    };
  }
}

export type SlackToolServerPayload = {
  name: typeof SLACK_TOOL_NAME;
  isActive: boolean;
  cert: typeof SlackTool.prototype.cert;
};
