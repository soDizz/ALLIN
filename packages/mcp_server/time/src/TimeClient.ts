import { aiFunction, AIFunctionsProvider } from '@agentic/core';
import z from 'zod';
import type { GetCurrentTimeResponse } from './time';

export class TimeClient extends AIFunctionsProvider {
  @aiFunction({
    name: 'get_current_time',
    description:
      'Get the current time. You must call this function when you need to get the current time.',
    inputSchema: z.object({}).describe('No input required'),
  })
  async getCurrentTime(): Promise<GetCurrentTimeResponse> {
    return {
      ok: true,
      currentTime: new Date().toISOString(),
    };
  }
}
