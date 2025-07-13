import { RESOURCE_SERVER } from '@/lib/resourceServerPath';
import { rx, RxSetterParam } from '@/lib/rxjs/rx';
import type { BaseTool } from '../BaseTool';
import { LOCAL_STORAGE_KEY } from '@/app/main/localStorageKey';

export const SLACK_TOOL_NAME = 'slack';

export class SlackTool implements BaseTool {
  private static instance: SlackTool;
  private name: typeof SLACK_TOOL_NAME = SLACK_TOOL_NAME;

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
  #pointedChannels = rx<Array<SlackPointedChannel>>([]);

  public static getInstance() {
    if (!SlackTool.instance) {
      SlackTool.instance = new SlackTool();
    }
    return SlackTool.instance;
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
  get pointedChannels() {
    return this.#pointedChannels.get();
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
  get pointedChannels$() {
    return this.#pointedChannels.$.asObservable();
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
    localStorage.setItem(LOCAL_STORAGE_KEY.SLACK_CERT, JSON.stringify(cert));
  }
  public setPointedChannels(
    valueOrFn: RxSetterParam<Array<SlackPointedChannel>>,
  ) {
    this.#pointedChannels.set(valueOrFn);
    if (this.pointedChannels.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.SLACK_POINTED_CHANNELS,
        JSON.stringify(this.pointedChannels),
      );
    }
  }

  public getServerPayload(): SlackToolServerPayload {
    return {
      name: this.name,
      cert: this.cert,
      pointedChannels: this.pointedChannels,
    };
  }
}

export type SlackToolServerPayload = {
  name: typeof SLACK_TOOL_NAME;
  cert: typeof SlackTool.prototype.cert;
  pointedChannels: Array<SlackPointedChannel>;
};

export type SlackPointedChannel = {
  id: string;
  name: string;
};
