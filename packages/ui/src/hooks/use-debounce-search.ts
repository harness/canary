import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

import { debounce } from 'lodash-es'

export interface UseDebounceSearchProps {
  handleChangeSearchValue?: (data: string) => void
  searchValue?: string
}

export const useDebounceSearch = ({ handleChangeSearchValue, searchValue }: UseDebounceSearchProps) => {
  const [search, setSearch] = useState('')

  const debouncedChangeSearchRef = useRef(debounce((value: string) => handleChangeSearchValue?.(value), 300))

  useEffect(() => setSearch(searchValue ?? ''), [searchValue])

  useEffect(() => {
    const debouncedChangeSearch = debouncedChangeSearchRef.current

    return () => {
      debouncedChangeSearch.cancel()
    }
  }, [])

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedChangeSearchRef.current(value)
  }, [])

  const handleResetSearch = useCallback(() => {
    setSearch('')
    handleChangeSearchValue?.('')
  }, [handleChangeSearchValue])

  return {
    handleResetSearch,
    handleSearchChange,
    search
  }
}
