import type { OptionValues, Plugin, WebAppAPI } from '@allin/plugin-sdk';
import type { PluginName } from './registry';

export class PluginManager {
  private plugins: ReadonlyArray<Plugin<PluginName>>;
  private activePlugins = new Set<PluginName>();
  private pluginOptionValues = new Map<PluginName, OptionValues>();
  private api: WebAppAPI;

  constructor(api: WebAppAPI, plugins: ReadonlyArray<Plugin<PluginName>>) {
    this.api = api;
    this.plugins = plugins;
    this.initializeOptionValues();
  }

  private initializeOptionValues() {
    this.plugins.forEach(plugin => {
      const defaultValues: OptionValues = {};
      plugin.options?.forEach(option => {
        defaultValues[option.name] = option.defaultValue;
      });
      this.pluginOptionValues.set(plugin.name, defaultValues);
    });
  }

  public getPlugins() {
    return this.plugins;
  }

  public getActivePlugins() {
    return Array.from(this.activePlugins);
  }

  public getPluginOptions(pluginName: PluginName): OptionValues {
    return this.pluginOptionValues.get(pluginName) ?? {};
  }

  public startPlugin(pluginName: PluginName) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && !this.activePlugins.has(pluginName)) {
      plugin.initialize(this.api);
      // Pass initial values after initialization
      plugin.onOptionChange?.(this.getPluginOptions(pluginName));
      this.activePlugins.add(pluginName);
    }
  }

  public stopPlugin(pluginName: PluginName) {
    const plugin = this.plugins.find(p => p.name === pluginName);
    if (plugin && this.activePlugins.has(pluginName)) {
      plugin.cleanup?.();
      this.activePlugins.delete(pluginName);
    }
  }

  public updatePluginOption(
    pluginName: PluginName,
    optionName: string,
    newValue: any,
  ) {
    const currentOptions = this.pluginOptionValues.get(pluginName);
    if (currentOptions) {
      const newOptions = { ...currentOptions, [optionName]: newValue };
      this.pluginOptionValues.set(pluginName, newOptions);

      if (this.activePlugins.has(pluginName)) {
        const plugin = this.plugins.find(p => p.name === pluginName);
        plugin?.onOptionChange?.(newOptions);
      }
    }
  }
}
