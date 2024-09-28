import { useState } from 'react'

export const usePagination = (initialPage: number = 1, totalPages: number = 1) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage)

  const handleClick = (page: number) => {
    setCurrentPage(page)
  }

  const previousPage = () => {
    if (currentPage > 1) {
      handleClick(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      handleClick(currentPage + 1)
    }
  }

  return {
    currentPage,
    previousPage,
    nextPage,
    handleClick
  }
}
