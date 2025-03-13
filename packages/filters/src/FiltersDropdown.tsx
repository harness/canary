import React, { ReactNode } from 'react'

import { useFiltersContext } from './Filters'

export interface FiltersDropdownProps<T, K extends keyof T> {
  children: (addFilter: (filterKey: K) => void, availableFilters: K[], resetFilters: () => void) => ReactNode
}

const FiltersDropdown = <T, K extends keyof T>({ children }: FiltersDropdownProps<T, K>): ReactNode => {
  const { addFilter: addFilterContext, availableFilters, resetFilters } = useFiltersContext<any>()

  const addFilter = (filterKey: K) => {
    addFilterContext(filterKey)
  }

  const getAvailableFilters = () => {
    return availableFilters as K[]
  }

  return children(addFilter, getAvailableFilters(), resetFilters)
}

export default FiltersDropdown
