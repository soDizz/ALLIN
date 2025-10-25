export interface WebAppAPI {
  sendMessage: (text: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  // ... other functions to expose to plugins
}

export interface Plugin<T extends string = string> {
  name: T;
  initialize: (api: WebAppAPI) => void;
  cleanup?: () => void;
  // ... common properties or methods for all plugins
}
