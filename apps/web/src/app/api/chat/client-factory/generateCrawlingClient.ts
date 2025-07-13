import { WebCrawlerClient } from '@mcp-server/web-crawler';

export const generateCrawlingClient = () => {
  return new WebCrawlerClient();
};
