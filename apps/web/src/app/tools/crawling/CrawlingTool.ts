import { RESOURCE_SERVER } from '@/lib/resourceServerPath';
import { rx } from '@/lib/rxjs/rx';
import type { BaseTool } from '../BaseTool';

export const CRAWLING_TOOL_NAME = 'crawling';

export class CrawlingTool implements BaseTool {
  private static instance: CrawlingTool;
  private name: typeof CRAWLING_TOOL_NAME = CRAWLING_TOOL_NAME;

  #metaData = rx({
    name: this.name,
    imgUrl: `${RESOURCE_SERVER}/tool-image/crawling-icon.png`,
  });
  #isActive = rx(true);
  #isVerified = rx(true);

  public static getInstance() {
    if (!CrawlingTool.instance) {
      CrawlingTool.instance = new CrawlingTool();
    }
    return CrawlingTool.instance;
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
    };
  }
}

export type CrawlingToolServerPayload = {
  name: typeof CRAWLING_TOOL_NAME;
};
