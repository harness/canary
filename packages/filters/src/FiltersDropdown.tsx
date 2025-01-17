import React, { ReactNode } from 'react'
import { useFiltersContext } from './Filters'

export interface FiltersDropdownProps<T, K extends keyof T> {
  className: string
  children: (addFilter: (filterKey: K) => void, availableFilters: K[]) => ReactNode
}

const FiltersDropdown = <T, K extends keyof T>({ children, className }: FiltersDropdownProps<T, K>): React.ReactElement | null => {
  const { addFilter: addFilterContext, availableFilters } = useFiltersContext<any>()

  const addFilter = (filterKey: K) => {
    addFilterContext(filterKey)
  }

  const getAvailableFilters = () => {
    return availableFilters as K[]
  }

  return <div id="filters-dropdown" className={className}>{children(addFilter, getAvailableFilters())}</div>
}

export default FiltersDropdown
