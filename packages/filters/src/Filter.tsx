import React from 'react'

import { useFiltersContext } from './Filters'
import { defaultStringParser } from './parsers'

type Parser<T> = {
  parse: (value: string) => T
  serialize: (value: T) => string
}

// Spreads generics from Parser<number | string> -> Parser<number> | Parser<string>
type SpreadParser<T> = T extends unknown ? Parser<T> : never

export interface FilterProps<T extends Record<string, unknown>, K extends keyof T> {
  filterKey: K
  children: (props: {
    onChange: (value: T[K]) => void
    value?: Parser<T[K]> extends undefined ? string : T[K]
    removeFilter: (filterKey?: K) => void
  }) => React.ReactNode
  parser?: SpreadParser<T[K]>
  sticky?: boolean
  className?: string
}

const Filter = <T extends Record<string, unknown>, K extends keyof T>({
  filterKey,
  children,
  parser = defaultStringParser as SpreadParser<T[K]>,
  className
}: FilterProps<T, K>): React.ReactElement | null => {
  const { updateFilter, getFilterValue, removeFilter } = useFiltersContext<any>()
  // Handles when a new value is set
  const handleChange = (value: T[K]) => {
    const serializedValue = parser.serialize(value)
    updateFilter(filterKey as string, serializedValue, value)
  }

  // If no filter key is provided,
  // filterKey provided to component will be used
  const wrappedRemoveFilter = (fkey?: K) => {
    removeFilter(fkey ?? filterKey)
  }

  // Retrieves the raw and parsed filter value
  const rawValue = getFilterValue(filterKey as string)
  const parsedValue = rawValue as T

  // Render the children with the injected props
  return (
    <div id={`filter-${String(filterKey)}`} className={className}>
      {children({
        onChange: handleChange,
        value: parsedValue as T[K],
        removeFilter: wrappedRemoveFilter
      })}
    </div>
  )
}

export default Filter
