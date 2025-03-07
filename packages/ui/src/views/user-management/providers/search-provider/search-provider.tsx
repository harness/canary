import { createContext } from 'react'

import { SearchContextType, SearchProviderProps } from '@/views/user-management/providers/search-provider'
import { useDebounceSearch } from '@hooks/use-debounce-search'

export const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children, searchQuery, setSearchQuery }: SearchProviderProps) => {
  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchInput,
        handleInputChange,
        handleResetSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
