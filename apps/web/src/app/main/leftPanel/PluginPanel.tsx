import type { Plugin } from '@allin/plugin-sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { pluginManagerAtom } from '../store/pluginStore';

export const PluginPanel = () => {
  const pluginManager = useAtomValue(pluginManagerAtom);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [activePlugins, setActivePlugins] = useState<string[]>([]);

  useEffect(() => {
    if (pluginManager) {
      setPlugins(pluginManager.getPlugins());
      setActivePlugins(pluginManager.getActivePlugins());
    }
  }, [pluginManager]);

  const handleToggle = (pluginName: string, checked: boolean) => {
    if (checked) {
      pluginManager?.startPlugin(pluginName);
    } else {
      pluginManager?.stopPlugin(pluginName);
    }
    // a bit of delay to reflect the change
    setTimeout(() => {
      setActivePlugins(pluginManager?.getActivePlugins() ?? []);
    }, 100);
  };

  if (!pluginManager) {
    return <div>Loading plugins...</div>;
  }

  return (
    <div className='p-4'>
      <h3 className='text-lg font-semibold mb-4'>Plugins</h3>
      <div className='space-y-4'>
        {plugins.map(plugin => (
          <div key={plugin.name} className='flex items-center justify-between'>
            <span>{plugin.name}</span>
            <Switch
              checked={activePlugins.includes(plugin.name)}
              onCheckedChange={checked => handleToggle(plugin.name, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
