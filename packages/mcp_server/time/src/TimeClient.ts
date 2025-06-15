import { aiFunction, AIFunctionsProvider } from '@agentic/core';
import z from 'zod';

export class TimeClient extends AIFunctionsProvider {
  @aiFunction({
    name: 'get_current_time',
    description: 'Get the current time',
    inputSchema: z.object({}).describe('No input required'),
  })
  async getCurrentTime(): Promise<string> {
    return new Date().toISOString();
  }
}
