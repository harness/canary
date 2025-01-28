import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'

import { debug, warn } from './debug'
import Filter, { FilterProps } from './Filter'
import FiltersContent, { FiltersContentProps } from './FiltersContent'
import FiltersDropdown, { FiltersDropdownProps } from './FiltersDropdown'
import { FilterConfig, FilterRefType, FilterStatus, FilterType, InitializeFiltersConfigType } from './types'
import useRouter from './useRouter'
import { createQueryString, isNullable, mergeURLSearchParams } from './utils'

interface FiltersContextType<T extends Record<string, unknown>> {
  visibleFilters: (keyof T)[]
  availableFilters: (keyof T)[]
  removeFilter: (filterKey: keyof T) => void
  resetFilters: () => void
  addFilter: (filterKey: keyof T) => void
  getFilterValue: (filterKey: keyof T) => any
  updateFilter: (filterKey: keyof T, parsedValue: any, value: any) => void
  addInitialFilters: (filtersConfig: Record<keyof T, InitializeFiltersConfigType<T>>) => void
}

const FiltersContext = createContext<FiltersContextType<Record<string, unknown>> | null>(null)

interface FiltersProps<T extends Record<string, unknown>> {
  children?: ReactNode
  allFiltersSticky?: boolean
  onChange?: (filters: T) => void
}

const Filters = forwardRef(function Filters<T extends Record<string, unknown>>(
  { children, allFiltersSticky, onChange }: FiltersProps<T>,
  ref: React.Ref<FilterRefType<T>>
) {
  type FilterKeys = keyof T
  const [filtersOrder, setFiltersOrder] = useState<FilterKeys[]>([])
  const [filtersMap, setFiltersMap] = useState<Record<FilterKeys, FilterType>>({} as Record<FilterKeys, FilterType>)
  const [filtersConfig, setFiltersConfig] = useState<Record<FilterKeys, FilterConfig>>(
    {} as Record<FilterKeys, FilterConfig>
  )
  const { searchParams, updateURL: routerUpdateURL } = useRouter()
  const initialFiltersRef = useRef<Record<FilterKeys, FilterType> | undefined>(undefined)

  const updateURL = (params: URLSearchParams) => {
    // merge params into search params and update the URL.
    const paramsOtherthanFilters: URLSearchParams = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (!filtersMap[key as FilterKeys]) {
        paramsOtherthanFilters.append(key, value)
      }
    })
    const mergedParams = mergeURLSearchParams(paramsOtherthanFilters, params)
    routerUpdateURL(mergedParams)
  }

  const setFiltersMapTrigger = (filtersMap: Record<FilterKeys, FilterType>) => {
    setFiltersMap(filtersMap)
    onChange?.(getValues(filtersMap))
  }

  const addFilter = (filterKey: FilterKeys) => {
    debug('Adding filter with key: %s', filterKey)
    setFiltersMap(prev => ({
      ...prev,
      [filterKey]: createNewFilter()
    }))

    onChange?.(
      getValues({
        ...filtersMap,
        [filterKey]: createNewFilter()
      })
    )
    setFiltersOrder(prev => [...prev, filterKey])
  }

  const removeFilter = (filterKey: FilterKeys) => {
    debug('Removing filter with key: %s', filterKey)
    const updatedFiltersMap = { ...filtersMap }
    delete updatedFiltersMap[filterKey]
    const updatedFiltersOrder = filtersOrder.filter(key => key !== filterKey)
    setFiltersMapTrigger(updatedFiltersMap)
    setFiltersOrder(updatedFiltersOrder)

    const query = createQueryString(updatedFiltersOrder, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  const updateFilter = (filterKey: FilterKeys, parsedValue: any, value: any) => {
    debug('Updating filter: %s with value: %O', filterKey, value)
    const updatedFiltersMap = { ...filtersMap, [filterKey]: getUpdatedFilter(parsedValue, value) }
    setFiltersMapTrigger(updatedFiltersMap)

    // when updating URL, include params other than filters params.
    const query = createQueryString(filtersOrder, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  const initializeFilters = (initialFiltersConfig: Record<FilterKeys, InitializeFiltersConfigType<T>>) => {
    debug('Adding initial filters: %O', filtersMap)

    const map = {} as Record<FilterKeys, FilterType>
    const config = {} as Record<FilterKeys, FilterConfig>

    for (const key in initialFiltersConfig) {
      const { defaultValue, parser, isSticky } = initialFiltersConfig[key]
      const isStickyFilter = allFiltersSticky ? true : isSticky

      // If default values is set, check if it is a valid non-null value and apply filter_applied status
      // If not, set the filter state to visible
      const serializedDefaultValue = defaultValue ?? parser?.serialize(defaultValue)
      let filterState = isStickyFilter ? FilterStatus.VISIBLE : FilterStatus.HIDDEN

      if (!isNullable(serializedDefaultValue)) {
        filterState = FilterStatus.FILTER_APPLIED
      }

      map[key] = {
        value: defaultValue,
        query: serializedDefaultValue,
        state: filterState
      }

      config[key] = {
        defaultValue: serializedDefaultValue,
        parser: initialFiltersConfig[key].parser,
        isSticky: isStickyFilter
      }
    }

    // initialize filters
    // add sticky filters
    // update filters from search params;
    // updating filters map state from search params
    searchParams?.forEach((value, key) => {
      if (map[key as FilterKeys]) {
        const parser = config?.[key as FilterKeys]?.parser
        const parsedValue = parser ? parser.parse(value) : value

        map[key as FilterKeys] = {
          value: parsedValue,
          query: value,
          state: FilterStatus.FILTER_APPLIED
        }
      }
    })

    // setting updated filters map to state and ref
    setFiltersMapTrigger(map)
    setFiltersConfig(config)

    debug('Initial filters added: %O', map)
    debug('Initial filters config added: %O', config)

    // setting the order of filters based on the filtersMap
    // adding all the filters which are not hidden
    const newFiltersOrder = Object.keys(map).filter(
      filter => map[filter as FilterKeys].state !== FilterStatus.HIDDEN
    ) as FilterKeys[]
    setFiltersOrder(newFiltersOrder)

    const query = createQueryString(newFiltersOrder, map)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))

    // remove setVisibleFilters
    initialFiltersRef.current = map
  }

  useEffect(() => {
    if (!initialFiltersRef.current) return

    const currentQuery = createQueryString(filtersOrder, filtersMap)
    const searchParamsFiltersMap = {} as Record<FilterKeys, FilterType>

    // we don't need to update URL here since it's already updated
    debug('Syncing search params with filters: %s', currentQuery)

    searchParams.forEach((value, key) => {
      if (filtersMap[key as FilterKeys]) {
        const parser = filtersConfig?.[key as FilterKeys]?.parser
        const parsedValue = parser ? parser.parse(value) : value

        searchParamsFiltersMap[key as FilterKeys] = {
          value: parsedValue,
          query: value,
          state: FilterStatus.FILTER_APPLIED
        }
      }
    }, {})

    // check if filtersOrder should be passed or not
    const searchParamsQuery = createQueryString(filtersOrder, searchParamsFiltersMap)

    if (currentQuery === searchParamsQuery) {
      return
    }

    // check typecasting
    setFiltersMapTrigger(searchParamsFiltersMap as Record<FilterKeys, FilterType>)
    setFiltersOrder(Object.keys(searchParamsFiltersMap) as FilterKeys[])
  }, [searchParams])

  const createNewFilter = (): FilterType => ({
    value: undefined,
    query: undefined,
    state: FilterStatus.VISIBLE
  })

  const getUpdatedFilter = (parsedValue: any, value: any): FilterType => {
    const isValueNullable = isNullable(parsedValue)
    return {
      value: value,
      query: isValueNullable ? undefined : parsedValue,
      state: isValueNullable ? FilterStatus.VISIBLE : FilterStatus.FILTER_APPLIED
    }
  }

  const getValues = (updatedFiltersMap: Record<FilterKeys, FilterType>) => {
    const newFiltersMap = updatedFiltersMap || filtersMap
    const filters = Object.keys(newFiltersMap).length === 0 ? initialFiltersRef.current : newFiltersMap

    return Object.entries(filters || {}).reduce((acc: T, [filterKey, value]) => {
      acc[filterKey as keyof T] = value.value
      return acc
    }, {} as T)
  }

  const resetFilters = () => {
    // add only sticky filters and remove other filters.
    // remove values also from sticky filters
    const updatedFiltersMap = { ...filtersMap }
    Object.keys(updatedFiltersMap).forEach(key => {
      const isSticky = filtersConfig[key as FilterKeys]?.isSticky
      const defaultValue = filtersConfig[key as FilterKeys]?.defaultValue

      const serializedDefaultValue = defaultValue
      let filterState = isSticky ? FilterStatus.VISIBLE : FilterStatus.HIDDEN

      if (!isNullable(serializedDefaultValue)) {
        filterState = FilterStatus.FILTER_APPLIED
      }

      updatedFiltersMap[key as FilterKeys] = {
        value: defaultValue,
        query: serializedDefaultValue,
        state: filterState
      }
    })

    const newFiltersOrder = Object.keys(updatedFiltersMap).filter(
      filter => updatedFiltersMap[filter as FilterKeys].state !== FilterStatus.HIDDEN
    ) as FilterKeys[]

    setFiltersMapTrigger(updatedFiltersMap)
    setFiltersOrder(newFiltersOrder)

    const query = createQueryString(newFiltersOrder, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  useImperativeHandle(ref, () => ({
    // @ts-ignore
    getValues,
    reset: resetFilters
  }))

  const availableFilters = Object.keys(filtersMap).filter(
    filter => filtersMap[filter as FilterKeys].state === FilterStatus.HIDDEN
  )

  const getFilterValue = (filterKey: FilterKeys) => {
    return filtersMap[filterKey]?.value
  }

  return (
    <FiltersContext.Provider
      value={
        {
          visibleFilters: filtersOrder as string[],
          availableFilters,
          resetFilters,
          removeFilter,
          getFilterValue,
          addFilter,
          updateFilter,
          addInitialFilters: initializeFilters
        } as any
      }
    >
      <div id="filters">{children}</div>
    </FiltersContext.Provider>
  )
})

export const useFiltersContext = <T extends Record<string, unknown>>() => {
  const context = useContext(FiltersContext as React.Context<FiltersContextType<T> | null>)
  if (!context) {
    warn('FiltersContext is missing. Ensure this is used within a FiltersProvider.') // Warn if context is missing
    throw new Error('FiltersDropdown, FiltersRow, and Filter must be used within a FiltersAdapter.')
  }

  return context
}

export { Filters }

type FiltersView = 'dropdown' | 'row'
interface FiltersWrapperProps<T extends Record<string, unknown>> extends FiltersProps<T> {
  view?: FiltersView
}

const FiltersWrapper = forwardRef(function FiltersWrapper<T extends Record<string, unknown>>(
  { view = 'row', ...props },
  ref: React.Ref<FilterRefType<T>>
) {
  if (view === 'row') {
    return <Filters {...props} ref={ref} allFiltersSticky />
  }

  return <Filters {...props} ref={ref} />
})

export default FiltersWrapper

export const createFilters = <T extends Record<string, unknown>>() => {
  const Filters = forwardRef<FilterRefType<T>, FiltersWrapperProps<T>>(function filtersCore(props, ref) {
    return <FiltersWrapper ref={ref} {...props} />
  })

  const FiltersWithStatics = Filters as typeof Filters & {
    Dropdown: <K extends keyof T>(props: FiltersDropdownProps<T, K>) => JSX.Element
    Content: (props: FiltersContentProps) => JSX.Element
    Component: <K extends keyof T>(props: FilterProps<T, K>) => JSX.Element
  }

  FiltersWithStatics.Dropdown = function filtersDropdown<K extends keyof T>(props: FiltersDropdownProps<T, K>) {
    // @ts-ignore
    return <FiltersDropdown {...props} />
  }

  FiltersWithStatics.Content = function filtersContent(props: FiltersContentProps) {
    return <FiltersContent {...props} />
  }

  FiltersWithStatics.Component = function filtersComponent<K extends keyof T>(props: FilterProps<T, K>) {
    return <Filter {...props} />
  }

  return FiltersWithStatics
}
