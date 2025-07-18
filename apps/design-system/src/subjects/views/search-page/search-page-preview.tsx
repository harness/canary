import { useCallback, useState } from 'react'

import { SearchPageView } from '@harnessio/ui/views'

import { searchResultsStore } from './search-results-store'

export const SearchPagePreview = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>({})

  const useSearchResultsStore = useCallback(() => searchResultsStore, [])

  return (
    <SearchPageView
      isLoading={false}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      useSearchResultsStore={useSearchResultsStore}
      filters={filters}
      setFilters={setFilters}
      toRepoFileDetails={() => '#'}
    />
  )
}
