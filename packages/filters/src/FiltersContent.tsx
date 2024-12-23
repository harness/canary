import React, { ReactNode, useRef } from 'react'
import { useFiltersContext } from './Filters'
import { FilterStatus, InitializeFiltersConfigType } from './types'

interface FiltersContentProps {
  children: ReactNode
  className?: string
}

const FiltersContent: React.FC<FiltersContentProps> = ({ children, className }) => {
  const { visibleFilters, addInitialFilters } = useFiltersContext()
  const initializedFiltersRef = useRef(false)

  const { components, filtersConfig } = React.Children.toArray(children).reduce<{
    components: ReactNode[]
    filtersConfig: Record<string, InitializeFiltersConfigType>
  }>(
    (acc, child) => {
      if (React.isValidElement(child) && child.props.filterKey !== null && typeof child.props.filterKey === 'string') {
        if (visibleFilters.includes(child.props.filterKey)) {
          acc.components.push(child)
        }

        acc.filtersConfig[child.props.filterKey] = {
          parser: child.props.parser,
          isSticky: child.props.sticky,
          state: FilterStatus.HIDDEN
        }
      } else {
        acc.components.push(child)
      }
      return acc
    },
    { components: [], filtersConfig: {} }
  )

  if (initializedFiltersRef.current === false) {
    addInitialFilters(filtersConfig)
    initializedFiltersRef.current = true
  }

  return <div className={className}>{components}</div>
}

export default FiltersContent
