'use client';

import type { WebAppAPI } from '@allin/plugin-sdk';
import { useSetAtom } from 'jotai';
import { useLayoutEffect } from 'react';
import { toast } from 'sonner';
import { plugins } from '@/app/plugins/registry';
import { PluginManager } from '../../plugins/PluginManager';
import { pluginManagerAtom } from '../store/pluginStore';

export const PluginInitializer = () => {
  const setPluginManager = useSetAtom(pluginManagerAtom);

  useLayoutEffect(() => {
    const webAppApi: WebAppAPI = {
      sendMessage: (text: string) => {},
      showToast: (
        message: string,
        type: 'success' | 'error' | 'info' | 'warning',
        options: {
          duration?: number;
          position?:
            | 'top-center'
            | 'top-right'
            | 'top-left'
            | 'bottom-center'
            | 'bottom-right'
            | 'bottom-left';
        } = {},
      ) => {
        toast[type](message, {
          duration: options.duration,
          position: options.position,
        });
      },
    };

    const manager = new PluginManager(webAppApi, plugins);
    setPluginManager(manager);
  }, [setPluginManager]);

  return null;
};
