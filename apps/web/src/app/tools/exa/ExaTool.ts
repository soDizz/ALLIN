import { RESOURCE_SERVER } from '@/lib/resourceServerPath';
import { rx } from '@/lib/rxjs/rx';
import type { BaseTool } from '../BaseTool';

export const EXA_TOOL_NAME = 'exa';

export class ExaTool implements BaseTool {
  private static instance: ExaTool;
  private name: typeof EXA_TOOL_NAME = EXA_TOOL_NAME;

  #metaData = rx({
    name: this.name,
    imgUrl: `${RESOURCE_SERVER}/tool-image/Exa-icon.png`,
  });
  #isActive = rx(true);
  #isVerified = rx(true);

  public static getInstance() {
    if (!ExaTool.instance) {
      ExaTool.instance = new ExaTool();
    }
    return ExaTool.instance;
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

  public getServerPayload(): ExaToolServerPayload {
    return {
      name: this.name,
    };
  }
}

export type ExaToolServerPayload = {
  name: typeof EXA_TOOL_NAME;
};
