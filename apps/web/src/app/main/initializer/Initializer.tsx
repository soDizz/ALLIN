import { HotkeyHandler } from './HotkeyHandler';
import { LocalStorageSync } from './LocalStorageSync';

export const Initializer = () => {
  return (
    <>
      <LocalStorageSync />
      <HotkeyHandler />
    </>
  );
};
