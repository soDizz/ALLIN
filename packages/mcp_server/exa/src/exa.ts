import z from 'zod';

export namespace exa {
  export const TextContentsOptionsSchema = z.object({
    maxCharacters: z
      .number()
      .optional()
      .describe('The maximum number of characters to return.'),
    includeHtmlTags: z
      .boolean()
      .optional()
      .describe('If true, includes HTML tags in the returned text.'),
  });
  export type TextContentsOptions = z.infer<typeof TextContentsOptionsSchema>;

  export const HighlightsContentsOptionsSchema = z.object({
    query: z
      .string()
      .optional()
      .describe('The query string to use for highlights search.'),
    numSentences: z
      .number()
      .optional()
      .describe('The number of sentences to return for each highlight.'),
    highlightsPerUrl: z
      .number()
      .optional()
      .describe('The number of highlights to return for each URL.'),
  });
  export type HighlightsContentsOptions = z.infer<
    typeof HighlightsContentsOptionsSchema
  >;

  export const ContentsOptionsSchema = z.object({
    text: z.union([TextContentsOptionsSchema, z.literal(true)]).optional(),
    highlights: z
      .union([HighlightsContentsOptionsSchema, z.literal(true)])
      .optional(),
  });
  export type ContentsOptions = z.infer<typeof ContentsOptionsSchema>;

  export const BaseSearchOptionsSchema = z.object({
    numResults: z
      .number()
      .optional()
      .describe('Number of search results to return.'),
    includeDomains: z
      .array(z.string())
      .optional()
      .describe('List of domains to include in the search.'),
    // excludeDomains: z
    //   .array(z.string())
    //   .optional()
    //   .describe('List of domains to exclude from the search.'),
    // startCrawlDate: z
    //   .string()
    //   .optional()
    //   .describe(
    //     'Start date for results based on crawl date (ISO 8601 format).',
    //   ),
    // endCrawlDate: z
    //   .string()
    //   .optional()
    //   .describe('End date for results based on crawl date (ISO 8601 format).'),
    // startPublishedDate: z
    //   .string()
    //   .optional()
    //   .describe(
    //     'Start date for results based on published date (ISO 8601 format).',
    //   ),
    // endPublishedDate: z
    //   .string()
    //   .optional()
    //   .describe(
    //     'End date for results based on published date (ISO 8601 format).',
    //   ),
    category: z
      .string()
      .optional()
      .describe(
        'A data category to focus on, with higher comprehensivity and data cleanliness. Currently, the only category is company.',
      ),
    contents: ContentsOptionsSchema.optional().describe(
      'Whether to include the contents of the search results.',
    ),
  });
  export type BaseSearchOptions = z.infer<typeof BaseSearchOptionsSchema>;

  export const RegularSearchOptionsSchema = z.object({
    query: z.string().describe('The query string for the search.'),

    // useAutoprompt: z.boolean().optional(),
    /**
     * @default 'auto'
     */
    // type: z.enum(['keyword', 'neural']).optional(),
  });

  export type RegularSearchOptions = z.infer<typeof RegularSearchOptionsSchema>;

  export const FindSimilarOptionsSchema = BaseSearchOptionsSchema.extend({
    url: z
      .string()
      .describe('The url for which you would like to find similar links'),
    excludeSourceDomain: z
      .boolean()
      .optional()
      .describe('If true, excludes links from the base domain of the input.'),
  });
  export type FindSimilarOptions = z.infer<typeof FindSimilarOptionsSchema>;

  export const GetContentsOptionsSchema = ContentsOptionsSchema.extend({
    ids: z
      .array(z.string())
      .nonempty()
      .describe('Exa IDs of the documents to retrieve.'),
  });
  export type GetContentsOptions = z.infer<typeof GetContentsOptionsSchema>;

  /**
   * Represents a search result object.
   */
  export type SearchResult = {
    /** The title of the search result. */
    title: string | null;

    /** The URL of the search result. */
    url: string;

    /** The estimated creation date of the content (ISO 8601 format). */
    publishedDate?: string;

    /** The author of the content, if available. */
    author?: string;

    /** Similarity score between the query/url and the result. */
    score?: number;

    /** The temporary Exa ID for the document. */
    id: string;

    /** Text from page */
    text?: string;

    /** The highlights as an array of strings. */
    highlights?: string[];

    /** The corresponding scores as an array of floats, 0 to 1 */
    highlightScores?: number[];
  };

  /**
   * Represents a search response object.
   */
  export type SearchResponse = {
    /** The list of search results. */
    results: SearchResult[];

    /** The autoprompt string, if applicable. */
    autopromptString?: string;

    /** Internal ID of this request. */
    requestId?: string;
  };
}
