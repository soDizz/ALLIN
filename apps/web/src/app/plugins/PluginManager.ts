import type { Plugin, WebAppAPI } from '@allin/plugin-sdk';
import type { PluginName } from './registry';

export class PluginManager {
  private plugins: ReadonlyArray<Plugin<PluginName>>;
  private activePlugins = new Set<PluginName>();
  private api: WebAppAPI;

  constructor(api: WebAppAPI, plugins: ReadonlyArray<Plugin<PluginName>>) {
    this.api = api;
    this.plugins = plugins;
  }

  getPlugins(): ReadonlyArray<Plugin<PluginName>> {
    return this.plugins;
  }

  getActivePlugins(): PluginName[] {
    return Array.from(this.activePlugins);
  }

  startPlugin(pluginName: PluginName) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && !this.activePlugins.has(pluginName)) {
      plugin.initialize(this.api);
      this.activePlugins.add(pluginName);
      console.log(`Plugin started: ${pluginName}`);
    }
  }

  stopPlugin(pluginName: PluginName) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && this.activePlugins.has(pluginName)) {
      plugin.cleanup?.();
      this.activePlugins.delete(pluginName);
      console.log(`Plugin stopped: ${pluginName}`);
    }
  }
}
