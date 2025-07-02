import { useHotkeys } from 'react-hotkeys-hook';
import { leftPanel$$ } from '../store/leftPanelStore';

export const HotkeyHandler = () => {
  useHotkeys('mod+b', () => {
    leftPanel$$.set(prev => !prev);
  });
  return null;
};
