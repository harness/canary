import React, { ReactNode, useRef } from 'react'

import { useFiltersContext } from './Filters'
import { FilterStatus, InitializeFiltersConfigType } from './types'

export interface FiltersContentProps {
  children: ReactNode
  className?: string
}

const FiltersContent: React.FC<FiltersContentProps> = ({ children, className }) => {
  const { visibleFilters, addInitialFilters } = useFiltersContext()
  const initializedFiltersRef = useRef(false)

  const reducerInitialState = {
    components: {
      filters: {},
      nonFilters: []
    },
    filtersConfig: {}
  }

  const { components, filtersConfig } = React.Children.toArray(children).reduce<{
    components: {
      filters: Record<string, ReactNode>
      nonFilters: ReactNode[]
    }
    filtersConfig: Record<string, InitializeFiltersConfigType>
  }>((acc, child) => {
    if (React.isValidElement(child) && child.props.filterKey !== null && typeof child.props.filterKey === 'string') {
      if (visibleFilters.includes(child.props.filterKey)) {
        acc.components.filters[child.props.filterKey] = child
      }

      acc.filtersConfig[child.props.filterKey] = {
        parser: child.props.parser,
        isSticky: child.props.sticky,
        state: FilterStatus.HIDDEN
      }
    } else {
      acc.components.nonFilters.push(child)
    }
    return acc
  }, reducerInitialState)

  if (initializedFiltersRef.current === false) {
    addInitialFilters(filtersConfig)
    initializedFiltersRef.current = true
  }

  const renderableComponents = visibleFilters.map(filterKey => components.filters[filterKey])

  return <div className={className}>{renderableComponents.concat(components.nonFilters)}</div>
}

export default FiltersContent
