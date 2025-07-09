export interface ContentProps {
  totalItems: number
  pageSize: number
  currentPage: number
  setPage: (page: number) => void
}
