import { createContext } from 'react';
import { ToolManager } from './ToolManager';
import { SlackTool } from './slack/SlackTool';
import { ExaTool } from './exa/ExaTool';
import { CrawlingTool } from './crawling/CrawlingTool';

export const initToolManager = () => {
  const toolManager = ToolManager.getInstance();
  toolManager.registerTool(SlackTool.getInstance());
  toolManager.registerTool(ExaTool.getInstance());
  toolManager.registerTool(CrawlingTool.getInstance());
  return toolManager;
};

export const ToolManagerContext = createContext<ToolManager>(initToolManager());
