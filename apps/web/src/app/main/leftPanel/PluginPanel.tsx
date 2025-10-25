import type { Plugin } from '@allin/plugin-sdk';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import type { PluginName } from '@/app/plugins/registry';
import { Switch } from '@/components/ui/switch';
import { pluginManagerAtom } from '../store/pluginStore';

export const PluginPanel = () => {
  const pluginManager = useAtomValue(pluginManagerAtom);
  const [activePlugins, setActivePlugins] = useState<PluginName[]>([]);

  const plugins = useMemo(() => {
    return pluginManager?.getPlugins() ?? [];
  }, [pluginManager]);

  useEffect(() => {
    if (pluginManager) {
      setActivePlugins(pluginManager.getActivePlugins());
    }
  }, [pluginManager]);

  const handleToggle = (pluginName: PluginName, checked: boolean) => {
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
