export interface WebAppAPI {
  sendMessage: (text: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  // ... other functions to expose to plugins
}

export interface Plugin {
  name: string;
  initialize: (api: WebAppAPI) => void;
  cleanup?: () => void;
  // ... common properties or methods for all plugins
}
