import { ApiInitializer } from './ApiInitializer';
import { HotkeyHandler } from './HotkeyHandler';
import { LocalStorageSync } from './LocalStorageSync';

export const Initializer = () => {
  return (
    <>
      <ApiInitializer />
      <LocalStorageSync />
      <HotkeyHandler />
    </>
  );
};
