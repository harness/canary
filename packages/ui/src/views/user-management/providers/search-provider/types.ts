export interface SearchContextType {
  searchQuery: string | null
  searchInput: string | null
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleResetSearch: () => void
}

export interface SearchProviderProps {
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  children: React.ReactNode
}
