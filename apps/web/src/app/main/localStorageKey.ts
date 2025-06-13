export type LocalStorageData = {
  slack: {
    token: string;
    teamId: string;
  };
};

export const LOCAL_STORAGE_KEY = {
  SLACK: 'slack',
} as const;
