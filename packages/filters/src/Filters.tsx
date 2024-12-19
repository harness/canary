import React, {
  ReactNode,
  useImperativeHandle,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef
} from 'react'
import { FilterType, FilterStatus } from './types'
import { createQueryString, mergeURLSearchParams } from './utils'
import useRouter from './useRouter'
import { debug, warn } from './debug'

interface FiltersContextType<FilterKeys extends string> {
  visibleFilters: FilterKeys[]
  availableFilters: FilterKeys[]
  removeFilter: (filterKey: FilterKeys) => void
  addFilter: (filterKey: FilterKeys) => void
  getFilterValue: (filterKey: FilterKeys) => any
  updateFilter: (filterKey: FilterKeys, value: any) => void
  addInitialFilters: (filtersMap: Record<FilterKeys, FilterType>) => void
}

const FiltersContext = createContext<FiltersContextType<any> | null>(null)

interface FiltersProps<FilterKeys extends string> {
  filters: FilterKeys[]
  stickyFilters?: FilterKeys[]
  children: ReactNode
}

const Filters = forwardRef(function Filters<FilterKeys extends string>(
  { filters, stickyFilters = [], children }: FiltersProps<FilterKeys>,
  ref: React.Ref<{ getValues: () => { key: FilterKeys; value: any }[] }>
) {
  const [filtersOrder, setFiltersOrder] = useState<FilterKeys[]>([])
  const [filtersMap, setFiltersMap] = useState<Record<FilterKeys, FilterType>>({} as Record<FilterKeys, FilterType>)
  const { searchParams, updateURL: routerUpdateURL } = useRouter()
  const initialFiltersRef = useRef<Record<FilterKeys, FilterType> | undefined>(undefined)

  const updateURL = (params: URLSearchParams) => {
    // merge params into search params and update the URL.
    const paramsOtherthanFilters: URLSearchParams = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (!filters.includes(key as FilterKeys)) {
        paramsOtherthanFilters.append(key, value)
      }
    })
    const mergedParams = mergeURLSearchParams(paramsOtherthanFilters, params)
    routerUpdateURL(mergedParams)
  }

  const addFilter = (filterKey: FilterKeys) => {
    debug('Adding filter with key: %s', filterKey)
    setFiltersMap(prev => ({
      ...prev,
      [filterKey]: createNewFilter(filterKey)
    }))
    setFiltersOrder(prev => [...prev, filterKey])
  }

  const removeFilter = (filterKey: FilterKeys) => {
    debug('Removing filter with key: %s', filterKey)
    const updatedFiltersMap = { ...filtersMap }
    delete updatedFiltersMap[filterKey]
    const updatedFiltersOrder = filtersOrder.filter(key => key !== filterKey)
    setFiltersMap(updatedFiltersMap)
    setFiltersOrder(updatedFiltersOrder)

    const query = createQueryString(updatedFiltersOrder, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  const updateFilter = (filterKey: FilterKeys, value: any) => {
    debug('Updating filter: %s with value: %O', filterKey, value)
    const updatedFiltersMap = { ...filtersMap, [filterKey]: getUpdatedFilter(filterKey, value) }
    setFiltersMap(updatedFiltersMap)

    // when updating URL, include params other than filters params.
    const query = createQueryString(filtersOrder, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  const initializeFilters = (filtersMap: Record<FilterKeys, FilterType>) => {
    debug('Adding initial filters: %O', filtersMap)

    // initialize filters
    // add sticky filters
    // update filters from search params;

    // updating filters map state from search params
    searchParams?.forEach((value, key) => {
      if (filtersMap[key as FilterKeys]) {
        filtersMap[key as FilterKeys] = {
          ...filtersMap[key as FilterKeys],
          value,
          query: value,
          state: FilterStatus.FILTER_APPLIED
        }
      }
    })

    // add sticky filters
    stickyFilters.forEach(filter => {
      if (!filtersMap[filter]) {
        filtersMap[filter] = createNewFilter(filter)
      }

      if (filtersMap[filter].state === FilterStatus.HIDDEN) {
        filtersMap[filter].state = FilterStatus.VISIBLE
      }
    })

    // setting updated filters map to state and ref
    setFiltersMap(filtersMap)

    // setting the order of filters based on the filtersMap
    // adding all the filters which are not hidden
    setFiltersOrder(
      Object.keys(filtersMap).filter(
        filter => filtersMap[filter as FilterKeys].state !== FilterStatus.HIDDEN
      ) as FilterKeys[]
    )
    // remove setVisibleFilters
    initialFiltersRef.current = filtersMap
  }

  useEffect(() => {
    if (!initialFiltersRef.current) return

    const currentQuery = createQueryString(filtersOrder, filtersMap)
    const searchParamsFiltersMap = {}

    // we don't need to update URL here since it's already updated
    debug('Syncing search params with filters: %s', currentQuery)

    searchParams.forEach((value, key) => {
      if (filtersMap[key as FilterKeys]) {
        // @ts-ignore
        searchParamsFiltersMap[key] = {
          ...filtersMap[key as FilterKeys],
          value,
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
    setFiltersMap(searchParamsFiltersMap as Record<FilterKeys, FilterType>)
    setFiltersOrder(Object.keys(searchParamsFiltersMap) as FilterKeys[])
  }, [searchParams])

  const createNewFilter = (filterKey: FilterKeys): FilterType => ({
    filterKey,
    value: null,
    query: null,
    state: FilterStatus.VISIBLE
  })

  const getUpdatedFilter = (filterKey: FilterKeys, value: any): FilterType => {
    const parsedValue = value
    const isValueNullable = parsedValue === '' || parsedValue === undefined || parsedValue === null
    return {
      filterKey,
      value: parsedValue,
      query: isValueNullable ? null : parsedValue,
      state: isValueNullable ? FilterStatus.VISIBLE : FilterStatus.FILTER_APPLIED
    }
  }

  const getValues = () => {
    if (Object.keys(filtersMap).length === 0) {
      if (initialFiltersRef.current) {
        return Object.keys(initialFiltersRef.current).map(key => ({
          key,
          value: initialFiltersRef.current?.[key as FilterKeys].value
        }))
      }
    }

    return Object.keys(filtersMap).map(key => ({ key, value: filtersMap[key as FilterKeys].value }))
  }

  const resetFilters = () => {
    // add only sticky filters and remove other filters.
    // remove values also from sticky filters
    const updatedFiltersMap = { ...filtersMap }
    Object.keys(updatedFiltersMap).forEach(key => {
      if (!stickyFilters.includes(key as FilterKeys)) {
        delete updatedFiltersMap[key as FilterKeys]
      } else {
        updatedFiltersMap[key as FilterKeys] = {
          ...updatedFiltersMap[key as FilterKeys],
          value: null,
          query: null,
          state: FilterStatus.VISIBLE
        }
      }
    })

    setFiltersMap(updatedFiltersMap)
    setFiltersOrder(stickyFilters)
    const query = createQueryString(stickyFilters, updatedFiltersMap)
    debug('Updating URL with query: %s', query)
    updateURL(new URLSearchParams(query))
  }

  useImperativeHandle(ref, () => ({
    // @ts-ignore
    getValues,
    reset: resetFilters
  }))

  const availableFilters = filters.filter(filter => !filtersOrder.includes(filter))

  const getFilterValue = (filterKey: FilterKeys) => {
    return filtersMap[filterKey]?.value || null
  }

  return (
    <FiltersContext.Provider
      value={{
        visibleFilters: filtersOrder,
        availableFilters,
        removeFilter,
        getFilterValue,
        addFilter,
        updateFilter,
        addInitialFilters: initializeFilters
      }}
    >
      <div id="filters">{children}</div>
    </FiltersContext.Provider>
  )
})

export const useFiltersContext = <FilterKeys extends string>() => {
  const context = useContext(FiltersContext as React.Context<FiltersContextType<FilterKeys> | null>)
  if (!context) {
    warn('FiltersContext is missing. Ensure this is used within a FiltersProvider.') // Warn if context is missing
    throw new Error('FiltersDropdown, FiltersRow, and Filter must be used within a FiltersAdapter.')
  }

  return context
}

export { Filters }

type FiltersView = 'dropdown' | 'row'
interface FiltersWrapperProps extends FiltersProps<string> {
  view?: FiltersView
}

const FiltersWrapper = forwardRef(function FiltersWrapper(
  { view = 'row', ...props }: FiltersWrapperProps,
  ref: React.Ref<{ getValues: () => { key: string; value: any }[] }>
) {
  if (view === 'row') {
    // Forward the ref to Filters when using 'row' view
    return <Filters {...props} ref={ref} stickyFilters={[...props.filters]} />
  }

  // Forward the ref to Filters when using other views
  return <Filters {...props} ref={ref} />
})

export default FiltersWrapper
