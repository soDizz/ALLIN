import { useLocalStorage } from 'usehooks-ts';
import { LOCAL_STORAGE_KEY, type LocalStorageData } from '../localStorageKey';
import { useEffect } from 'react';
import { useRxSet } from '@/lib/rxjs/useRx';
import { plugins } from '../store/pluginsStore';

export const LocalStorageTime = () => {
  const [status] = useLocalStorage<LocalStorageData['time'] | null>(LOCAL_STORAGE_KEY.TIME, null);
  const setPlugins = useRxSet(plugins.time$$);

  useEffect(() => {
    if (status?.active) {
      setPlugins(prev => ({
        ...prev,
        active: true,
      }));
    }
  }, [setPlugins, status?.active]);
  return <></>;
};
