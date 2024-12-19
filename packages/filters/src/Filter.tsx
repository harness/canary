import React from 'react'
import { useFiltersContext } from './Filters'
import { defaultStringParser } from './parsers'

type Parser<T> = {
  parse: (value: string) => T
  serialize: (value: T) => string
}

interface FilterProps<T = string> {
  filterKey: string
  children: (props: { onChange: (value: T) => void; value: T }) => React.ReactNode
  parser?: Parser<T>
}

const Filter = <T,>({
  filterKey,
  children,
  parser = defaultStringParser as Parser<T>
}: FilterProps<T>): React.ReactElement | null => {
  const { updateFilter, getFilterValue } = useFiltersContext()

  // Handles when a new value is set
  const handleChange = (value: T) => {
    const serializedValue = parser.serialize(value)
    updateFilter(filterKey, serializedValue)
  }

  // Retrieves the raw and parsed filter value
  const rawValue = getFilterValue(filterKey)
  const parsedValue = parser.parse(rawValue) ?? (rawValue as T)

  // Render the children with the injected props
  return <>{children({ onChange: handleChange, value: parsedValue })}</>
}

export default Filter
