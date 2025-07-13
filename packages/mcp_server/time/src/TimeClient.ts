import { AIFunctionsProvider, aiFunction } from '@agentic/core';
import z from 'zod';
import type { GetCurrentTimeResponse } from './time';

export class TimeClient extends AIFunctionsProvider {
  @aiFunction({
    name: 'get_current_time',
    description: 'Get the current zulu time.',
    inputSchema: z.object({}).describe('No input required'),
  })
  async getCurrentTime(): Promise<GetCurrentTimeResponse> {
    return new Promise(done => {
      setTimeout(() => {
        done({
          ok: true,
          currentTime: new Date().toISOString(),
        });
        // useChat 의 throttleTime 50ms 을 걸어둬서 동기적으로 바로 리턴하면 응답이 무시되는 문제가 있어서 추가함
      }, 100);
    });
  }
}
