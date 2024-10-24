import { useState } from 'react'
import usePageResponseHeaders from '../../hooks/usePageResponseHeaders'

interface Pagination {
  totalPages: number
  currentPage: number
  previousPage: () => void
  nextPage: () => void
  handleClick: (page: number) => void
}

export const usePagination = (responseHeaders: HeadersInit, initialPage: number = 1): Pagination => {
  const { xTotalPages: totalPages = 1 } = usePageResponseHeaders(responseHeaders)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)

  const handleClick = (page: number): void => setCurrentPage(page)

  const previousPage = (): void => {
    if (currentPage > 1) handleClick(currentPage - 1)
  }

  const nextPage = (): void => {
    if (currentPage < totalPages) handleClick(currentPage + 1)
  }

  return { totalPages, currentPage, previousPage, nextPage, handleClick }
}
