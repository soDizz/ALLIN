import type { BaseTool } from './BaseTool';
import type {
  CRAWLING_TOOL_NAME,
  CrawlingTool,
  CrawlingToolServerPayload,
} from './crawling/CrawlingTool';
import type {
  EXA_TOOL_NAME,
  ExaTool,
  ExaToolServerPayload,
} from './exa/ExaTool';
import type {
  SLACK_TOOL_NAME,
  SlackTool,
  SlackToolServerPayload,
} from './slack/SlackTool';

export class ToolManager {
  private static instance: ToolManager;
  private tools: Map<ToolName, BaseTool> = new Map();

  private constructor() {}

  public static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }

  public registerTool(tool: BaseTool): void {
    this.tools.set(tool.metaData.name as ToolName, tool);
  }

  public getTool<T extends ToolName>(name: T): ToolMap[T] {
    const tool = this.tools.get(name);

    // 리액트가 init 되기 전에 tool이나 싱글톤들이 초기화 되었다면 이 에러가 발생하면 안됨.
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return tool as ToolMap[T];
  }

  public getAllTools(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  public getServerPayload(): ToolsServerPayload {
    return this.getAllTools()
      .filter(tool => tool.isActive)
      .map(tool => tool.getServerPayload()) as ToolsServerPayload;
  }
}

export type ToolsServerPayload = Array<
  SlackToolServerPayload | ExaToolServerPayload | CrawlingToolServerPayload
>;

export type ToolName =
  | typeof SLACK_TOOL_NAME
  | typeof EXA_TOOL_NAME
  | typeof CRAWLING_TOOL_NAME;

export type ToolMap = {
  [SLACK_TOOL_NAME]: SlackTool;
  [EXA_TOOL_NAME]: ExaTool;
  [CRAWLING_TOOL_NAME]: CrawlingTool;
};
