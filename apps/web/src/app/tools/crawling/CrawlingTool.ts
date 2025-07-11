import { RESOURCE_SERVER } from '@/lib/resourceServerPath';
import { rx } from '@/lib/rxjs/rx';
import type { BaseTool } from '../BaseTool';
import { ToolManager } from '../ToolManager';

const Crawling_TOOL_NAME = 'CrawlingTool';

export class CrawlingTool implements BaseTool {
  private static instance: CrawlingTool;
  private name: typeof Crawling_TOOL_NAME = Crawling_TOOL_NAME;
  private toolManager: ToolManager;

  #metaData = rx({
    name: this.name,
    imgUrl: `${RESOURCE_SERVER}/tool-image/crawling-icon.png`,
  });
  #isActive = rx(false);
  #isVerified = rx(false);

  public static getInstance() {
    if (!CrawlingTool.instance) {
      CrawlingTool.instance = new CrawlingTool(ToolManager.getInstance());
    }
    return CrawlingTool.instance;
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

  get metaData$() {
    return this.#metaData.$.asObservable();
  }
  get isActive$() {
    return this.#isActive.$.asObservable();
  }
  get isVerified$() {
    return this.#isVerified.$.asObservable();
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

  public getServerPayload(): CrawlingToolServerPayload {
    return {
      name: this.name,
      isActive: this.isActive,
    };
  }
}

export type CrawlingToolServerPayload = {
  name: typeof Crawling_TOOL_NAME;
  isActive: boolean;
};
