import { SearchResultItem } from '@harnessio/ui/views'

export interface SearchResultsStore {
  results: SearchResultItem[]
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
          segments: [
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
          segments: [
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
          segments: [
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
          segments: [
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
          segments: [
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
          segments: [
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
          segments: [
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
  page: 1,
  xNextPage: 2,
  xPrevPage: 0,
  setPage: () => {},
  setPaginationFromHeaders: () => {},
  setResults: () => {},
  addResult: () => {},
  removeResult: () => {}
}
