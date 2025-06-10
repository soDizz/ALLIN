import { type Rx, rx } from '@/lib/rxjs/rx';

type PluginName = 'slack';

type PluginState = {
  /**
   * if true, the plugin is verified
   * if false, the plugin is not verified
   */
  verified: boolean;
  /**
   * if true, the plugin is active
   * if false, the plugin is inactive
   * it never be true when the plugin is not verified
   */
  active: boolean;
};

type PluginDecorator<
  T extends {
    name: PluginName;
    [key: string]: unknown;
  },
> = T & PluginState;

type SlackPlugin = PluginDecorator<{
  name: 'slack';
}>;

export class Plugins {
  private slackPlugin$$: Rx<SlackPlugin> = rx<SlackPlugin>({
    name: 'slack',
    verified: false,
    active: false,
  });

  public get slack$$() {
    return this.slackPlugin$$;
  }
}

export const plugins = new Plugins();
