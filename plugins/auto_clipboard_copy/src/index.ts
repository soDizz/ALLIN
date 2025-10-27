import type { Plugin } from '@allin/plugin-sdk';

const handleSelectionChange = () => {
  const selectedText = window.getSelection()?.toString();
  if (selectedText) {
    console.log('Selected Text:', selectedText);
  }
};

const AutoClipboardCopyPlugin: Plugin<'Auto Clipboard Copy'> = {
  name: 'Auto Clipboard Copy',
  initialize: api => {
    api.showToast('Auto Clipboard Copy Plugin is loaded!', 'success');
    document.addEventListener('selectionchange', handleSelectionChange);
  },
  options: [
    {
      type: 'toggle',
      name: 'Enable Notifications',
      defaultValue: true,
    },
    {
      type: 'slider',
      name: 'Copy Delay (ms)',
      defaultValue: 1000,
      min: 0,
      max: 5000,
      step: 100,
      unit: 'ms',
      description: 'Delay before copying after selection.',
    },
    {
      type: 'number-input',
      name: 'Max Text Length',
      defaultValue: 500,
      min: 0,
      max: 9999,
      step: 10,
      unit: 'chars',
      description: 'Only copy text shorter than this length.',
    },
    {
      type: 'textarea',
      name: 'Prefix Text',
      defaultValue: '',
      placeholder: 'e.g., "Source: "',
    },
  ],
  cleanup: () => {
    document.removeEventListener('selectionchange', handleSelectionChange);
    console.log('Auto Clipboard Copy Plugin stopped.');
  },
};

export { AutoClipboardCopyPlugin };
