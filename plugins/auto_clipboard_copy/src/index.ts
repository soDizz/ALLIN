import type { Plugin } from '@allin/plugin-sdk';

const AutoClipboardCopyPlugin: Plugin = {
  name: 'My First Plugin',
  initialize: api => {
    console.log('My First Plugin initialized!');

    // Example of using the API
    api.showToast('My First Plugin is loaded!', 'success');

    // Example of adding a command
    // This is a hypothetical example, the API would need to support this
    // api.registerCommand('helloPlugin', () => {
    //   api.sendMessage('Hello from My First Plugin!');
    // });
  },
};

export { AutoClipboardCopyPlugin };
