import { atom } from 'jotai';
import type { PluginManager } from '../../plugins/PluginManager';

export const pluginManagerAtom = atom<PluginManager | null>(null);
