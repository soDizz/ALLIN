import { HotkeyHandler } from './HotkeyHandler';
import { LocalStorageSlack } from './LocalStorageSlack';
import { LocalStorageTime } from './LocalStorageTime';

export const Initializer = () => {
  return (
    <>
      <LocalStorageSlack />
      <LocalStorageTime />
      <HotkeyHandler />
    </>
  );
};
