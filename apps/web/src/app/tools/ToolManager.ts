import type { BaseTool } from './BaseTool';
import type { ToolsServerPayload } from './ServerPayload';

export class ToolManager {
  private static instance: ToolManager;
  private tools: Map<string, BaseTool> = new Map();

  private constructor() {}

  public static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }

  public registerTool(tool: BaseTool): void {
    this.tools.set(tool.metaData.name, tool);
  }

  public getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
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
