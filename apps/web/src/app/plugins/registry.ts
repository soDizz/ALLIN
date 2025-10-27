import { AutoClipboardCopyPlugin } from '@allin/auto-clipboard-copy-plugin';

export const plugins = [AutoClipboardCopyPlugin] as const;

export type PluginName = (typeof plugins)[number]['name'];
