import { describe, expect, it } from 'vitest';
import { TimeClient } from '../TimeClient';

describe('TimeClient test', () => {
  it('should be defined', () => {
    expect(TimeClient).toBeDefined();
  });

  it('should be able to get current time', async () => {
    const timeClient = new TimeClient();
    const currentTime = await timeClient.getCurrentTime();
    expect(currentTime).toBeDefined();
  });
});
