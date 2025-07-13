import type { Tool } from '../route';
import { generateCrawlingClient } from './generateCrawlingClient';
import { generateExaClient } from './generateExaClient';
import { generateSlackClient } from './generateSlackClient';

export const clientFactory = (tool: Tool) => {
  const { name } = tool;

  switch (name) {
    case 'slack':
      return generateSlackClient(tool);
    case 'exa':
      return generateExaClient();
    case 'crawling':
      return generateCrawlingClient();
    default:
      return null;
  }
};
