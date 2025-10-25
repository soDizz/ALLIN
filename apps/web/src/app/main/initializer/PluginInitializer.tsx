'use client';

import type { WebAppAPI } from '@allin/plugin-sdk';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { plugins } from '@/app/plugins/registry';
import { PluginManager } from '../../plugins/PluginManager';
import { pluginManagerAtom } from '../store/pluginStore';

export const PluginInitializer = () => {
  const setPluginManager = useSetAtom(pluginManagerAtom);

  useEffect(() => {
    const webAppApi: WebAppAPI = {
      sendMessage: (text: string) => {},
      showToast: (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
          toast.success(message);
        } else {
          toast.error(message);
        }
      },
    };

    const manager = new PluginManager(webAppApi, plugins);
    setPluginManager(manager);

    console.log('PluginManager initialized');
  }, [setPluginManager]);

  return null;
};
