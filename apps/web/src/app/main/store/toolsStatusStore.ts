import { type Rx, rx } from '@/lib/rxjs/rx';
import { slack$$ } from './slackStore';

export type ToolName = 'slack' | 'time' | 'exa';

type Status = {
  verified: boolean | true;
  active: boolean;
};

type Tool<
  T extends {
    name: ToolName;
    [key: string]: unknown;
  },
> = T & Status;

type SlackTool = Tool<{
  name: 'slack';
}>;

type TimeTool = Tool<{
  name: 'time';
  // override. because Time doesn't need to be verified.
  verified: true;
}>;

type ExaTool = Tool<{
  name: 'exa';
  verified: true;
}>;

export class ToolsStatus {
  /////////////// common ///////////////
  public getEnabledTools() {
    const plugins = [];

    if (this.slackPlugin$$.get().active) {
      plugins.push({
        name: 'slack',
        token: slack$$.get().token,
        teamId: slack$$.get().workspaceId,
      });
    }

    if (this.timePlugin$$.get().active) {
      plugins.push({
        name: 'time',
      });
    }

    if (this.exa$$.get().active) {
      plugins.push({
        name: 'exa',
      });
    }
    return plugins;
  }
  /////////////// slack plugin ///////////////
  private slackPlugin$$: Rx<SlackTool> = rx<SlackTool>({
    name: 'slack',
    verified: false,
    active: false,
  });

  public get slack$$() {
    return this.slackPlugin$$;
  }

  /////////////// time plugin ///////////////
  private timePlugin$$: Rx<TimeTool> = rx<TimeTool>({
    name: 'time',
    verified: true,
    active: false,
  });

  public get time$$() {
    return this.timePlugin$$;
  }

  /////////////// exa plugin ///////////////
  public exa$$ = rx<ExaTool>({
    name: 'exa',
    verified: true,
    active: false,
  });
}

export const toolsStatus = new ToolsStatus();
