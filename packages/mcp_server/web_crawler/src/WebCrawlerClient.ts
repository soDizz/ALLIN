import { AIFunctionsProvider, aiFunction } from "@agentic/core";
import z from "zod";
import { crawl } from "./crawl";

const CrawlRequestParams = z
  .object({
    urls: z.array(z.string()),
  })
  .describe("urls to web search");

type CrawlResponse = {
  url: string;
  markdownContent: string;
  status: "Success" | "Error";
};

export class WebCrawlerClient extends AIFunctionsProvider {
  @aiFunction({
    name: "crawl",
    description: "get website content from URLs. return format is markdown.",
    inputSchema: CrawlRequestParams,
  })
  async crawl({
    urls,
  }: z.infer<typeof CrawlRequestParams>): Promise<CrawlResponse[]> {
    const documentMarkdownContents = urls.map((url) => crawl(url));
    const results = await Promise.allSettled(documentMarkdownContents);

    return results.map((result, index) => ({
      url: urls[index],
      markdownContent: result.status === "fulfilled" ? result.value : "",
      status: result.status === "fulfilled" ? "Success" : "Error",
    }));
  }
}
