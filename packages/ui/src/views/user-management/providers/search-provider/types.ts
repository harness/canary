import { ChangeEvent, PropsWithChildren } from 'react'

export interface SearchContextType {
  searchQuery: string | null
  searchInput: string | null
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleResetSearch: () => void
}

export interface SearchProviderProps
  extends PropsWithChildren<{
    searchQuery: string | null
    setSearchQuery: (query: string | null) => void
  }> {}
