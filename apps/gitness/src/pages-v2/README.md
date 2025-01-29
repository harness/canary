# Repository Query with Pagination and Filtering

This example demonstrates querying a list of repositories with filtering and pagination using `useQueryState` for URL state management and `useListReposQuery` for fetching data.
The `useCommonFilter` hook provides default query parameters, while `getPaginationHeaders` extracts pagination metadata.

## Example Code

```typescript
import { parseAsInteger, useQueryState } from 'nuqs'
import { useListReposQuery } from '@harnessio/code-service-client'

export default function RepositoryList({ space }: { space: string }) {
  // Manage page parameters in URL state with "nuqs" library
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  // Fetch repositories based on the current query, sort order, and page number
  const { isFetching, data } = useListReposQuery({
    queryParams: { page, ... },
    ...
  })

  // Access the list of repositories from the response
  const repositories = data?.body

  // Extract total pages for pagination control from response headers
  const totalPages = parseInt(data?.headers?.get(PageResponseHeader.xTotalPages) || '')

  return (
    <div>
      {/*
          Render <RepoList />
          ...
      */}
      <PaginationControls
        page={page}
        setPage={(pageNum: number) => setPage(pageNum)}
        totalPages={totalPages} /* From headers */
      />
    </div>
  )
}
```
