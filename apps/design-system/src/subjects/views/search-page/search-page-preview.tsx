import { useCallback, useState } from 'react'

import { SearchPageView, SearchResultItem } from '@harnessio/ui/views'

import { searchResultsStore } from './search-results-store'

export const SearchPagePreview = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>({})

  const useSearchResultsStore = useCallback(() => searchResultsStore, [])

  const handleItemClick = useCallback((item: SearchResultItem) => {
    console.log('Item clicked:', item)
    // In a real app, this would navigate to the item's URL or perform some action
  }, [])

  return (
    <SearchPageView
      isLoading={false}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      useSearchResultsStore={useSearchResultsStore}
      onItemClick={handleItemClick}
      filters={filters}
      setFilters={setFilters}
    />
  )
}
