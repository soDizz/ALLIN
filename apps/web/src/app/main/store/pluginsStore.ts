import { type Rx, rx } from '@/lib/rxjs/rx';
import { slackKey$$ } from './slackKey';

type PluginName = 'slack' | 'time';

type PluginState = {
  /**
   * if true, the plugin is verified
   * if false, the plugin is not verified
   *
   */
  verified: boolean | true;
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

type TimePlugin = PluginDecorator<{
  name: 'time';
  verified: true;
}>;

export class Plugins {
  /////////////// common ///////////////
  public get enabledPlugins() {
    const plugins = [];

    if (this.slackPlugin$$.get().active) {
      plugins.push({
        name: 'slack',
        token: slackKey$$.get().token,
        teamId: slackKey$$.get().teamId,
      });
    }

    if (this.timePlugin$$.get().active) {
      plugins.push({
        name: 'time',
      });
    }

    return plugins;
  }
  /////////////// slack plugin ///////////////
  private slackPlugin$$: Rx<SlackPlugin> = rx<SlackPlugin>({
    name: 'slack',
    verified: false,
    active: false,
  });

  public get slack$$() {
    return this.slackPlugin$$;
  }

  /////////////// time plugin ///////////////
  private timePlugin$$: Rx<TimePlugin> = rx<TimePlugin>({
    name: 'time',
    verified: true,
    active: false,
  });

  public get time$$() {
    return this.timePlugin$$;
  }
}

export const plugins = new Plugins();
