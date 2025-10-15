export interface ContentProps {
  totalItems: number
  pageSize: number
  currentPage: number
  setPage: (page: number) => void
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
}
