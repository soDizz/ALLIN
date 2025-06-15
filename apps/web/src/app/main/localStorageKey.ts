export type LocalStorageData = {
  slack: {
    token: string;
    teamId: string;
  };
  time: {
    active: boolean;
  };
};

export const LOCAL_STORAGE_KEY = {
  SLACK: 'slack',
  TIME: 'time',
} as const;
