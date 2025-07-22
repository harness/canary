import { useCallback, useState } from 'react'

import { SearchPageView } from '@harnessio/ui/views'

import { searchResultsStore } from './search-results-store'

export const SearchPagePreview = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [regex, setRegex] = useState(false)
  const useSearchResultsStore = useCallback(() => searchResultsStore, [])

  return (
    <SearchPageView
      isLoading={false}
      searchQuery={searchQuery}
      regex={regex}
      setRegex={setRegex}
      setSearchQuery={setSearchQuery}
      useSearchResultsStore={useSearchResultsStore}
      toRepoFileDetails={() => '#'}
    />
  )
}
