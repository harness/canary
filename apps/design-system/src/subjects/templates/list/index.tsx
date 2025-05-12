import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { createFilters } from '@harnessio/filters'
import { Button, FilterFieldTypes } from '@harnessio/ui/components'
import { CalendarFilterOptionConfig, FilterOptionConfig } from '@harnessio/ui/src/components'
import { ListTemplateProps } from '@harnessio/ui/src/templates'
import { ListTemplate } from '@harnessio/ui/templates'

export type ListFilters = {
  created_lt?: Date
  created_gt?: Date
}

const ListFilterHandler = createFilters<ListFilters>()

type ListFilterOptionConfig = Array<Extract<FilterOptionConfig<keyof ListFilters>, CalendarFilterOptionConfig>>

const FILTER_OPTIONS: ListFilterOptionConfig = [
  {
    label: 'Created Before',
    value: 'created_lt',
    type: FilterFieldTypes.Calendar
  },
  {
    label: 'Created After',
    value: 'created_gt',
    type: FilterFieldTypes.Calendar
  }
]

const paginationProps: ListTemplateProps['paginationProps'] = {
  currentPage: 2,
  goToPage: noop,
  totalPages: 10
  // nextPage: 3,
  // previousPage: 1
}

export const ListTemplateView = () => {
  const [search, setSearch] = useState('')

  return (
    <ListTemplate
      title="List template"
      description="List template description"
      useTranslationStore={useTranslationStore}
      listActions={
        <>
          <Button onClick={noop}>Action 1</Button>
          <Button onClick={noop}>Action 2</Button>
        </>
      }
      withSearch
      searchQuery={search}
      setSearchQuery={setSearch}
      paginationProps={paginationProps}
      filterHandler={ListFilterHandler}
      onFilterChange={noop}
    />
  )
}
