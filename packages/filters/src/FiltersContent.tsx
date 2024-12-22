import React, { ReactElement, ReactNode, useRef } from 'react'
import { useFiltersContext } from './Filters'
import { FilterStatus, FilterTypeWithComponent } from './types'

interface FiltersContentProps {
  children: ReactNode
  className?: string
}

const FiltersContent: React.FC<FiltersContentProps> = ({ children, className }) => {
  const { visibleFilters, addInitialFilters } = useFiltersContext()
  const initializedFiltersRef = useRef(false)

  const { filterableChildrenMap, nonFilterableChildren } = React.Children.toArray(children).reduce<{
    filterableChildrenMap: Record<string, FilterTypeWithComponent>
    nonFilterableChildren: ReactNode[]
  }>(
    (acc, child) => {
      if (React.isValidElement(child) && child.props.filterKey !== null && typeof child.props.filterKey === 'string') {
        acc.filterableChildrenMap[child.props.filterKey] = {
          filterKey: child.props.filterKey,
          value: null,
          query: null,
          state: child.props.isSticky ? FilterStatus.VISIBLE : FilterStatus.HIDDEN,
          component: child as ReactElement,
          isSticky: child.props.isSticky,
          parser: child.props.parser
        }
      } else {
        acc.nonFilterableChildren.push(child) // Collect components without filterKey
      }
      return acc
    },
    { filterableChildrenMap: {}, nonFilterableChildren: [] }
  )

  if (initializedFiltersRef.current === false) {
    addInitialFilters(filterableChildrenMap)
    initializedFiltersRef.current = true
  }

  const orderedFilters = visibleFilters.map(key => filterableChildrenMap[key]?.component).filter(Boolean)

  return (
    <div className={className}>
      {orderedFilters}
      {nonFilterableChildren}
    </div>
  )
}

export default FiltersContent
