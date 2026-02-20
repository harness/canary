import { createContext } from 'react'

import { SearchContextType, SearchProviderProps } from '@views/user-management/providers/search-provider'

export const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children, searchQuery, setSearchQuery }: SearchProviderProps) => {
  const handleInputChange = (val: string) => setSearchQuery(val.length ? val : null)
  const handleResetSearch = () => setSearchQuery(null)

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleInputChange,
        handleResetSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
