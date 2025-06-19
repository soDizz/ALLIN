import type { Slack } from '@/app/main/store/slackStore';
import type { ToolName } from '@/app/main/store/toolsStatusStore';

export type LocalStorageData = {
  slack: Slack;
  time: {
    active: boolean;
  };
  activeTools: ToolName[];
};

export const LOCAL_STORAGE_KEY = {
  SLACK: 'slack',
  TIME: 'time',
  ACTIVE_TOOLS: 'active_tools',
} as const;
