import React, { ReactNode } from 'react'
import { useFiltersContext } from './Filters'

export interface FiltersDropdownProps<T> {
  children: (addFilter: (filterKey: keyof T) => void, availableFilters: (keyof T)[]) => ReactNode
}

const FiltersDropdown = <T,>({ children }: FiltersDropdownProps<T>) => {
  const { addFilter, availableFilters } = useFiltersContext()

  return <div id="filters-dropdown">{children(addFilter, availableFilters)}</div>
}

export default FiltersDropdown
