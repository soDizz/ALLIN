import type { CrawlingToolServerPayload } from './crawling/CrawlingTool';
import type { ExaToolServerPayload } from './exa/ExaTool';
import type { SlackToolServerPayload } from './slack/SlackTool';

export type ToolsServerPayload = Array<
  SlackToolServerPayload | ExaToolServerPayload | CrawlingToolServerPayload
>;
