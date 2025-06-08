import { rx } from '@/lib/rxjs/rx';
import { distinctUntilChanged, map } from 'rxjs';

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

type Plugin = PluginDecorator<{
  name: 'slack';
}>;

type PluginMap = Map<PluginName, Plugin>;

const initialState: PluginMap = new Map([
  ['slack', { name: 'slack', verified: false, active: false, apiKey: '', teamId: '' }],
]);

export const plugins$$ = rx<PluginMap>(initialState);

export const slackPlugin$$ = rx(
  plugins$$.$.asObservable().pipe(
    map(plugins => plugins.get('slack')),
    distinctUntilChanged(
      (prev, curr) => prev?.verified === curr?.verified && prev?.active === curr?.active,
    ),
  ),
  {
    name: 'slack',
    verified: false,
    active: false,
  },
);
