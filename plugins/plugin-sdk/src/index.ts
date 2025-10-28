import type { OptionValue, OptionValues, PluginOption } from './options';

export type {
  NumberInputOption,
  OptionValue,
  OptionValues,
  PluginOption,
  SliderOption,
  TextareaOption,
  ToggleOption,
} from './options';

export interface WebAppAPI {
  sendMessage: (text: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

// The definitive Plugin interface
export interface Plugin<Name extends string = string> {
  name: Name;
  description?: string;
  options?: readonly PluginOption[];
  initialize: (api: WebAppAPI) => void;
  // Called whenever an option value changes
  onOptionChange?: (values: OptionValues) => void;
  cleanup?: () => void;
}
