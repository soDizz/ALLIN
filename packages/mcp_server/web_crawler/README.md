# @mcp-server/web_crawler

This package provides a robust, type-safe WebCrawler client designed for integration with AI agents, built on top of `@agentic/core`. It offers a suite of methods for interacting with the WebCrawler API, all of which are exposed as AI-callable functions.

** It optimizes API response for less token usage. **
So, you can use it as a tool for AI agents without any additional processing.

## How to get WebCrawler API Token

1. Go to WebCrawler developer portal
2. Create a new app
3. Generate API token
4. Copy the token

## Features

- **AI-Ready:** All public methods are decorated with `@aiFunction`, making them instantly available to AI agents.
- **Type-Safe:** Leverages `zod` to validate API responses, ensuring data integrity and providing strong type safety.
- **Modern Asynchronous API:** Built with `async/await` and modern JavaScript features.

## Test Code (optional)

This package has a test code that tests the client. To run the test, you need to set the following environment variables. (`.env` file)

- `WEB_CRAWLER_TOKEN`

## Usage

```typescript
import { WebCrawlerClient } from '@mcp-server/web_crawler';

const client = new WebCrawlerClient({
  token: 'your-api-token',
});

// Use with AI agents
const result = await client.exampleFunction({
  message: 'Hello, world!',
});
```
