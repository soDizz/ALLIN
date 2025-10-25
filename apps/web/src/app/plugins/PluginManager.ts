import type { Plugin, WebAppAPI } from '@allin/plugin-sdk';

export class PluginManager {
  private plugins: Plugin[] = [];
  private activePlugins = new Set<string>();
  private api: WebAppAPI;

  constructor(api: WebAppAPI, plugins: Plugin[]) {
    this.api = api;
    this.plugins = plugins;
  }

  getPlugins() {
    return this.plugins;
  }

  getActivePlugins() {
    return Array.from(this.activePlugins);
  }

  startPlugin(pluginName: string) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && !this.activePlugins.has(pluginName)) {
      plugin.initialize(this.api);
      this.activePlugins.add(pluginName);
      console.log(`Plugin started: ${pluginName}`);
    }
  }

  stopPlugin(pluginName: string) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && this.activePlugins.has(pluginName)) {
      plugin.cleanup?.();
      this.activePlugins.delete(pluginName);
      console.log(`Plugin stopped: ${pluginName}`);
    }
  }
}
