// Base interface for all options
interface OptionBase {
  name: string;
  description?: string;
}

// Specific option interfaces based on UI type
export interface ToggleOption extends OptionBase {
  type: 'toggle';
  defaultValue: boolean;
}

export interface SliderOption extends OptionBase {
  type: 'slider';
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface NumberInputOption extends OptionBase {
  type: 'number-input';
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface TextareaOption extends OptionBase {
  type: 'textarea';
  defaultValue: string;
  placeholder?: string;
}

// A union of all possible option types
export type PluginOption =
  | ToggleOption
  | SliderOption
  | NumberInputOption
  | TextareaOption;

// A record of option names to their current values
export type OptionValue = string | number | boolean;
export type OptionValues = Record<string, OptionValue>;
