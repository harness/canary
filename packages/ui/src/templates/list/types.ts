import { ReactNode } from 'react'

import { PaginationProps } from '@/components'
import { TranslationStore } from '@/views'

import { createFilters } from '@harnessio/filters'

interface ListTemplateCommonProps {
  title: string
  description?: string
  useTranslationStore: () => TranslationStore
  listActions?: ReactNode
  paginationProps?: Omit<PaginationProps, 't'>
}

export interface SearchProps {
  searchQuery: string
  setSearchQuery: (value: string | null) => void
  searchLabel?: string
}

export interface FiltersProps<T> {
  filterHandler: ReturnType<typeof createFilters<T>>
  onFilterChange: (val: T) => void
}

export type ListTemplateProps<T> = ListTemplateCommonProps &
  (T extends undefined ? {} : FiltersProps<T>) &
  (({ withSearch: true } & SearchProps) | { withSearch?: false | undefined })
