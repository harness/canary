import { Fragment, ReactNode, useRef, useState } from 'react'

import { ListActions, Pagination, SearchBox, Spacer, Text } from '@/components'
import { useDebounceSearch } from '@/hooks'
import {FiltersProps, ListTemplateProps, SearchProps} from '@/templates'
import { SandboxLayout } from '@/views'

import { FilterRefType } from '@harnessio/filters'

const getSearchProps = <T,>(props: ListTemplateProps<T>): SearchProps => {
  if (props.withSearch) {
    const { searchQuery, setSearchQuery, searchLabel } = props
    return {
      searchQuery,
      setSearchQuery,
      searchLabel
    }
  }

  return {
    searchQuery: '',
    setSearchQuery: () => {}
  }
}

const getFiltersProps = <T,>(props: ListTemplateProps<T>): Partial<FiltersProps<T>> => {
    if ('filterHandler' in props && 'onFilterChange' in props) {
        return {
            filterHandler: props.filterHandler,
            onFilterChange: props.onFilterChange,
        }
    }

    return {
        filterHandler: undefined,
        onFilterChange: undefined,
    }
}


export const ListTemplate = <T,>(props: ListTemplateProps<T>) => {
  const {
    title,
    description,
    useTranslationStore,
    withSearch,
    listActions,
    paginationProps
  } = props

  const { searchQuery, setSearchQuery, searchLabel } = getSearchProps<T>(props)
  const {
      filterHandler: FilterHandler,
      onFilterChange
  } = getFiltersProps(props)

  const { t } = useTranslationStore()

  const filtersRef = useRef<FilterRefType<T> | null>(null)
  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  const isShowListActions = !!withSearch || !!listActions

  const onFilterSelectionChange = (filterValues: (keyof T)[]) => {
    setSelectedFiltersCnt(filterValues.length)
  }

  const onFilterValueChange = (filterValues: T) => {
    const _filterValues = Object.entries(filterValues).reduce((acc: Record<string, T[keyof T]>, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {})

    onFilterChange?.(_filterValues)
  }

  const FilterWrapper = FilterHandler
    ? (props: { children: ReactNode }) => (
        <FilterHandler
          ref={filtersRef}
          onFilterSelectionChange={onFilterSelectionChange}
          onChange={onFilterValueChange}
          view="dropdown"
        >
          {props.children}
        </FilterHandler>
      )
    : Fragment

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Spacer size={2} />
        <Text className="leading-tight" size={5} as="h1" weight="medium">
          {title}
        </Text>
        {!!description && (
          <Text className="leading-tight mt-3" as="p" color="secondary">
            {description}
          </Text>
        )}
        <Spacer size={6} />
        {isShowListActions && (
          <FilterWrapper>
            <ListActions.Root>
              <ListActions.Left>
                {!!withSearch && (
                  <SearchBox.Root
                    width="full"
                    className="max-w-80"
                    value={search || ''}
                    handleChange={handleSearchChange}
                    placeholder={!!searchLabel ? searchLabel : t('views:repos.search', 'Search')}
                  />
                )}
              </ListActions.Left>
              <ListActions.Right>{listActions}</ListActions.Right>
            </ListActions.Root>
            <Spacer size={4.5} />
          </FilterWrapper>
        )}

        {!!paginationProps && <Pagination t={t} {...paginationProps} />}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
