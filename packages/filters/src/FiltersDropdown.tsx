import React, { ReactNode } from 'react'
import { useFiltersContext } from './Filters'

interface FiltersDropdownProps {
  children: (addFilter: (filterKey: string) => void, availableFilters: string[]) => ReactNode
}

const FiltersDropdown: React.FC<FiltersDropdownProps> = ({ children }) => {
  const { addFilter, availableFilters } = useFiltersContext()

  return <div id="filters-dropdown">{children(addFilter, availableFilters)}</div>
}

export default FiltersDropdown
