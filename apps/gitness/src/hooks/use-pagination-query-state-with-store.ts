import { useEffect, useState } from 'react'

export interface UsePaginationQueryStateWithStoreProps {
  page: number
  setPage: (val: number) => void
}

/**
 * A hook for working with pagination, useQueryState, and updating entity store values based on pagination.
 *
 * @param page - page from store
 * @param setPage - setPage from store
 */
const usePaginationQueryStateWithStore = ({ page, setPage }: UsePaginationQueryStateWithStoreProps) => {
  const [queryPage, setQueryPage] = useState(page)

  /**
   * Update query state if store page change
   */
  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  /**
   * Set page from query state to store
   */
  useEffect(() => {
    setPage(queryPage)
  }, [queryPage, setPage])

  return {
    queryPage,
    setQueryPage
  }
}

export default usePaginationQueryStateWithStore
