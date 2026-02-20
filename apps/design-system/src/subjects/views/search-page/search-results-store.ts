import { SearchResultItem, SemanticSearchResultItem } from '@harnessio/views'

export interface SearchResultsStore {
  results: SearchResultItem[]
  semanticResults: SemanticSearchResultItem[]
  page: number
  xNextPage: number
  xPrevPage: number
  setPage: (page: number) => void
  setPaginationFromHeaders: () => void
  setResults: (results: SearchResultItem[]) => void
  addResult: (result: SearchResultItem) => void
  removeResult: (id: string) => void
}

export const searchResultsStore: SearchResultsStore = {
  results: [
    {
      file_name: 'user-service.ts',
      repo_path: 'packages/api/services',
      repo_branch: 'main',
      language: 'typescript',
      matches: [
        {
          line_num: 42,
          before: 'export const userService = {',
          after: '};',
          fragments: [
            {
              pre: '  ',
              match: 'searchUsers',
              post: ': async (query: string) => {'
            }
          ]
        },
        {
          line_num: 124,
          before: 'const searchUsersByName = async (name: string) => {',
          after: '  return results;',
          fragments: [
            {
              pre: '  const results = await db.users.find({ name: { $regex: ',
              match: 'searchPattern',
              post: ', $options: "i" } });'
            }
          ]
        }
      ]
    },
    {
      file_name: 'SearchComponent.tsx',
      repo_path: 'packages/ui/components/search',
      repo_branch: 'feature/search-improvements',
      language: 'tsx',
      matches: [
        {
          line_num: 15,
          before: 'interface SearchProps {',
          after: '}',
          fragments: [
            {
              pre: '  ',
              match: 'onSearch',
              post: ': (query: string) => void;'
            }
          ]
        },
        {
          line_num: 57,
          before: 'const handleSearch = useCallback(() => {',
          after: '}, [searchTerm, onSearch]);',
          fragments: [
            {
              pre: '  ',
              match: 'onSearch',
              post: '(searchTerm);'
            }
          ]
        }
      ]
    },
    {
      file_name: 'search-api.test.js',
      repo_path: 'tests/api',
      repo_branch: 'main',
      language: 'javascript',
      matches: [
        {
          line_num: 32,
          before: 'describe("Search API", () => {',
          after: '  });',
          fragments: [
            {
              pre: '  it("should return results when ',
              match: 'search',
              post: 'ing by valid term", async () => {'
            }
          ]
        }
      ]
    },
    {
      file_name: 'SearchService.java',
      repo_path: 'src/main/java/com/harness/services',
      repo_branch: 'main',
      language: 'java',
      matches: [
        {
          line_num: 45,
          before: '@Service',
          after: '}',
          fragments: [
            {
              pre: 'public class ',
              match: 'SearchService',
              post: ' implements ISearchService {'
            }
          ]
        },
        {
          line_num: 78,
          before: '  @Override',
          after: '  }',
          fragments: [
            {
              pre: '  public List<SearchResult> ',
              match: 'search',
              post: '(String query, SearchOptions options) {'
            }
          ]
        }
      ]
    }
  ],
  semanticResults: [
    {
      commit: 'a3f7b2c8e9d1f4a6b8c2d5e7f9a1b3c5d7e9f1a3',
      file_path: 'packages/api/services/user-service.ts',
      start_line: 42,
      end_line: 58,
      file_name: 'user-service.ts',
      lines: [
        'export const userService = {',
        '  searchUsers: async (query: string) => {',
        '    const sanitizedQuery = sanitizeInput(query);',
        '    const results = await db.users.find({',
        '      $or: [',
        '        { name: { $regex: sanitizedQuery, $options: "i" } },',
        '        { email: { $regex: sanitizedQuery, $options: "i" } }',
        '      ]',
        '    });',
        '    return results.map(user => ({',
        '      id: user.id,',
        '      name: user.name,',
        '      email: user.email,',
        '      avatar: user.avatar',
        '    }));',
        '  },',
        '};'
      ]
    },
    {
      commit: 'b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
      file_path: 'packages/ui/components/search/SearchComponent.tsx',
      start_line: 12,
      end_line: 35,
      file_name: 'SearchComponent.tsx',
      lines: [
        'import React, { useState, useCallback } from "react";',
        'import { Input } from "@/components/ui/input";',
        '',
        'interface SearchProps {',
        '  placeholder?: string;',
        '  onSearch: (query: string) => void;',
        '  debounceMs?: number;',
        '}',
        '',
        'export const SearchComponent: React.FC<SearchProps> = ({',
        '  placeholder = "Search...",',
        '  onSearch,',
        '  debounceMs = 300',
        '}) => {',
        '  const [searchTerm, setSearchTerm] = useState("");',
        '',
        '  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {',
        '    const value = e.target.value;',
        '    setSearchTerm(value);',
        '  };',
        '',
        '  return (',
        '    <Input',
        '      value={searchTerm}',
        '      onChange={handleChange}'
      ]
    },
    {
      commit: 'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      file_path: 'src/main/java/com/harness/services/SearchService.java',
      start_line: 45,
      end_line: 92,
      file_name: 'SearchService.java',
      lines: [
        '@Service',
        'public class SearchService implements ISearchService {',
        '',
        '  @Autowired',
        '  private SearchRepository searchRepository;',
        '',
        '  @Autowired',
        '  private CacheManager cacheManager;',
        '',
        '  private static final Logger logger = LoggerFactory.getLogger(SearchService.class);',
        '',
        '  /**',
        '   * Performs a search operation with the given query and options.',
        '   * Results are cached for improved performance.',
        '   *',
        '   * @param query The search query string',
        '   * @param options Additional search options including filters and sorting',
        '   * @return List of search results matching the criteria',
        '   */',
        '  @Override',
        '  public List<SearchResult> search(String query, SearchOptions options) {',
        '    String cacheKey = generateCacheKey(query, options);',
        '    ',
        '    List<SearchResult> cachedResults = cacheManager.get(cacheKey);',
        '    if (cachedResults != null) {',
        '      logger.debug("Returning cached results for query: {}", query);',
        '      return cachedResults;',
        '    }',
        '',
        '    logger.info("Executing search query: {}", query);',
        '    List<SearchResult> results = searchRepository.findByQueryAndOptions(query, options);',
        '    ',
        '    cacheManager.put(cacheKey, results);',
        '    return results;',
        '  }',
        '',
        '  private String generateCacheKey(String query, SearchOptions options) {',
        '    return String.format("search:%s:%s", query, options.hashCode());',
        '  }',
        '',
        '  @Override',
        '  public void clearCache() {',
        '    cacheManager.clear();',
        '    logger.info("Search cache cleared");',
        '  }',
        '',
        '}'
      ]
    },
    {
      commit: 'd9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
      file_path: 'packages/api/middleware/search-validator.ts',
      start_line: 18,
      end_line: 42,
      file_name: 'search-validator.ts',
      lines: [
        'import { z } from "zod";',
        'import type { Request, Response, NextFunction } from "express";',
        '',
        'const searchQuerySchema = z.object({',
        '  q: z.string().min(1, "Search query cannot be empty").max(200),',
        '  page: z.coerce.number().int().positive().default(1),',
        '  limit: z.coerce.number().int().min(1).max(100).default(20),',
        '  filters: z.record(z.string()).optional(),',
        '  sort: z.enum(["relevance", "date", "name"]).default("relevance")',
        '});',
        '',
        'export const validateSearchQuery = (',
        '  req: Request,',
        '  res: Response,',
        '  next: NextFunction',
        ') => {',
        '  try {',
        '    const validated = searchQuerySchema.parse(req.query);',
        '    req.query = validated as any;',
        '    next();',
        '  } catch (error) {',
        '    if (error instanceof z.ZodError) {',
        '      return res.status(400).json({',
        '        error: "Invalid search parameters",',
        '        details: error.errors'
      ]
    },
    {
      commit: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      file_path: 'packages/ui/hooks/useSearch.ts',
      start_line: 5,
      end_line: 38,
      file_name: 'useSearch.ts',
      lines: [
        'import { useState, useEffect, useCallback, useRef } from "react";',
        'import { useDebounce } from "./useDebounce";',
        '',
        'export interface UseSearchOptions<T> {',
        '  searchFn: (query: string) => Promise<T[]>;',
        '  debounceMs?: number;',
        '  minChars?: number;',
        '}',
        '',
        'export const useSearch = <T>({',
        '  searchFn,',
        '  debounceMs = 300,',
        '  minChars = 2',
        '}: UseSearchOptions<T>) => {',
        '  const [query, setQuery] = useState("");',
        '  const [results, setResults] = useState<T[]>([]);',
        '  const [isLoading, setIsLoading] = useState(false);',
        '  const [error, setError] = useState<Error | null>(null);',
        '  const debouncedQuery = useDebounce(query, debounceMs);',
        '  const abortControllerRef = useRef<AbortController | null>(null);',
        '',
        '  const performSearch = useCallback(async (searchQuery: string) => {',
        '    if (searchQuery.length < minChars) {',
        '      setResults([]);',
        '      return;',
        '    }',
        '',
        '    // Cancel previous request',
        '    abortControllerRef.current?.abort();',
        '    abortControllerRef.current = new AbortController();',
        '',
        '    setIsLoading(true);',
        '    setError(null);',
        ''
      ]
    }
  ],
  page: 1,
  xNextPage: 2,
  xPrevPage: 0,
  setPage: () => {},
  setPaginationFromHeaders: () => {},
  setResults: () => {},
  addResult: () => {},
  removeResult: () => {}
}
