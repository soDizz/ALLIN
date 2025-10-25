import type { Plugin } from '@allin/plugin-sdk';

const AutoClipboardCopyPlugin: Plugin<'auto-clipboard-copy'> = {
  name: 'auto-clipboard-copy',
  initialize: api => {
    api.showToast('Auto Clipboard Copy Plugin is loaded!', 'success');
  },
};

export { AutoClipboardCopyPlugin };
