import { ExaClient } from '@mcp-server/exa';
import { assert } from '@agentic/core';

export const generateExaClient = () => {
  const key = process.env.EXA_API_KEY;
  assert(key);

  const exaClient = new ExaClient({
    apiKey: key,
  });

  return exaClient;
};
