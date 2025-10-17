import { PropsWithChildren } from 'react'

export interface SearchContextType {
  searchQuery: string | null
  handleInputChange: (value: string) => void
  handleResetSearch: () => void
}

export interface SearchProviderProps
  extends PropsWithChildren<{
    searchQuery: string | null
    setSearchQuery: (query: string | null) => void
  }> {}
