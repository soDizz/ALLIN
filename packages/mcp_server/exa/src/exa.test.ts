import dotenv from 'dotenv';
import ky from 'ky';
import { describe, it } from 'vitest';
import { ExaClient } from './exa-client';

dotenv.config();

describe('exa api test', () => {
  it('search api', async () => {
    const exaClient = new ExaClient({
      apiKey: process.env.EXA_API_KEY,
    });

    const res = await exaClient.search({
      query: 'What is the weather today in Seoul?',
    });
  });
});
