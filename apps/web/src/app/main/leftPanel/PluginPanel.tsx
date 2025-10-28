import type { OptionValue, PluginOption } from '@allin/plugin-sdk';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import type { PluginName } from '@/app/plugins/registry';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { pluginManagerAtom } from '../store/pluginStore';

const PluginOptionControl = ({
  pluginName,
  option,
}: {
  pluginName: PluginName;
  option: PluginOption;
}) => {
  const pluginManager = useAtomValue(pluginManagerAtom);
  const [value, setValue] = useState(
    () => pluginManager?.getPluginOptions(pluginName)[option.name],
  );

  const handleValueChange = (newValue: OptionValue) => {
    setValue(newValue);
    pluginManager?.updatePluginOption(pluginName, option.name, newValue);
  };

  switch (option.type) {
    case 'toggle':
      return (
        <Switch
          checked={value as boolean}
          onCheckedChange={handleValueChange}
        />
      );
    case 'slider':
      return (
        <div className='flex items-center gap-2'>
          <Slider
            value={[value as number]}
            min={option.min}
            max={option.max}
            step={option.step}
            onValueChange={([val]) => handleValueChange(val)}
          />
        </div>
      );
    case 'number-input':
      return (
        <div className='relative'>
          <Input
            type='number'
            value={value as number}
            min={option.min}
            max={option.max}
            step={option.step}
            onChange={e => handleValueChange(Number(e.target.value))}
            className='pr-12'
          />
        </div>
      );
    case 'textarea':
      return (
        <textarea
          value={value as string}
          placeholder={option.placeholder}
          className='w-full p-2 border rounded'
          onChange={e => handleValueChange(e.target.value)}
        />
      );
    default:
      return null;
  }
};

export const PluginPanel = () => {
  const pluginManager = useAtomValue(pluginManagerAtom);
  const [activePlugins, setActivePlugins] = useState<PluginName[]>([]);

  const plugins = useMemo(
    () => pluginManager?.getPlugins() ?? [],
    [pluginManager],
  );

  const refreshActivePlugins = () => {
    setActivePlugins(pluginManager?.getActivePlugins() ?? []);
  };

  useEffect(() => {
    if (pluginManager) {
      refreshActivePlugins();
    }
  }, [pluginManager]);

  const handleToggle = (pluginName: PluginName, checked: boolean) => {
    if (checked) {
      pluginManager?.startPlugin(pluginName);
    } else {
      pluginManager?.stopPlugin(pluginName);
    }
    setTimeout(refreshActivePlugins, 100);
  };

  if (!pluginManager) return <div>Loading plugins...</div>;

  return (
    <div className='p-4 space-y-6'>
      {plugins.map(plugin => (
        <div key={plugin.name} className='space-y-4 p-4 border rounded-lg'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h4 className='font-semibold'>{plugin.name}</h4>
              {plugin.description && (
                <p className='text-sm text-muted-foreground'>
                  {plugin.description}
                </p>
              )}
            </div>
            <Switch
              checked={activePlugins.includes(plugin.name)}
              onCheckedChange={checked => handleToggle(plugin.name, checked)}
            />
          </div>
          {activePlugins.includes(plugin.name) && plugin.options && (
            <div className='space-y-4 pt-4 border-t'>
              {plugin.options.map(option => (
                <div key={option.name} className='flex flex-col space-y-2'>
                  <label className='text-sm font-medium'>{option.name}</label>
                  {option.description && (
                    <p className='text-xs text-muted-foreground'>
                      {option.description}
                    </p>
                  )}
                  <PluginOptionControl
                    pluginName={plugin.name}
                    option={option}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
