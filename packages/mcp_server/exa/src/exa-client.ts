import { AIFunctionsProvider, aiFunction, assert, getEnv } from '@agentic/core';
import defaultKy, { type KyInstance } from 'ky';
import { exa } from './exa';

/**
 * Web search tailored for LLMs.
 *
 * @see https://docs.exa.ai
 */
export class ExaClient extends AIFunctionsProvider {
  protected readonly ky: KyInstance;
  protected readonly apiKey: string;
  protected readonly apiBaseUrl: string;

  constructor({
    apiKey = getEnv('EXA_API_KEY'),
    apiBaseUrl = getEnv('EXA_API_BASE_URL') ?? 'https://api.exa.ai',
    ky = defaultKy,
  }: {
    apiKey?: string;
    apiBaseUrl?: string;
    ky?: KyInstance;
  } = {}) {
    assert(
      apiKey,
      'ExaClient missing required "apiKey" (defaults to "EXA_API_KEY")',
    );
    super();

    this.apiKey = apiKey;
    this.apiBaseUrl = apiBaseUrl;

    this.ky = ky.extend({
      prefixUrl: this.apiBaseUrl,
      headers: {
        'x-api-key': apiKey,
      },
    });
  }

  /**
   * Performs an Exa search for the given query.
   */
  @aiFunction({
    name: 'exa_search',
    description:
      'Search the Exa index for the given query. Returns a list of relevant links. After this search, you must use web_crawler tool to fetch the contents of the links.',
    inputSchema: exa.RegularSearchOptionsSchema,
  })
  async search({ query }: exa.RegularSearchOptions) {
    const json = {
      query,
      type: 'keyword',
      numResults: 3,
      context: false,
    };

    const result = await this.ky
      .post('search', {
        json,
      })
      .json<exa.SearchResponse>();

    return result.results.map(r => ({
      title: r.title,
      url: r.url,
    }));
  }

  /**
   * Finds similar links to the provided URL.
   */
  // @aiFunction({
  //   name: 'exa_find_similar',
  //   description: 'Find similar links to the provided URL.',
  //   inputSchema: exa.FindSimilarOptionsSchema,
  // })
  // async findSimilar(opts: exa.FindSimilarOptions) {
  //   const { excludeSourceDomain, ...rest } = opts;
  //   const excludeDomains = (opts.excludeDomains ?? []).concat(
  //     excludeSourceDomain ? [new URL(opts.url).hostname] : [],
  //   );

  //   return this.ky
  //     .post('findSimilar', {
  //       json: pruneUndefined({
  //         ...rest,
  //         excludeDomains: excludeDomains.length ? excludeDomains : undefined,
  //       }),
  //     })
  //     .json<exa.SearchResponse>();
  // }

  /**
   * Retrieves contents of documents based on a list of Exa document IDs.
   */
  // @aiFunction({
  //   name: 'exa_get_contents',
  //   description:
  //     'Retrieve contents of documents based on a list of Exa document IDs.',
  //   inputSchema: exa.GetContentsOptionsSchema,
  // })
  // async getContents({ ids, ...opts }: exa.GetContentsOptions) {
  //   const documentIDs = Array.isArray(ids) ? ids : [ids];
  //   assert(documentIDs.length, 'Must provide at least one document ID');

  //   return this.ky
  //     .post('contents', {
  //       json: {
  //         ...opts,
  //         ids: documentIDs,
  //       },
  //     })
  //     .json<exa.SearchResponse>();
  // }
}
