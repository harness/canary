import {
  type FilterCondition,
  type FilterOption,
  type SortDirection,
  type SortOption,
  type ViewLayoutOption
} from '@components/filters'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import { TFunction } from 'i18next'

import { Parser } from '@harnessio/filters'

import { PRListFilters } from '../pull-request/pull-request.types'

export const getBasicConditions = (t: TFunction): FilterCondition[] => [
  { label: t('component:filter.is', 'is'), value: 'is' },
  { label: t('component:filter.isNot', 'is not'), value: 'is_not' },
  { label: t('component:filter.isEmpty', 'is empty'), value: 'is_empty' },
  { label: t('component:filter.isNotEmpty', 'is not empty'), value: 'is_not_empty' }
]

export const getRangeConditions = (t: TFunction): FilterCondition[] => [
  { label: t('component:filter.is', 'is'), value: 'is' },
  { label: t('component:filter.isBefore', 'is before'), value: 'is_before' },
  { label: t('component:filter.isAfter', 'is after'), value: 'is_after' },
  { label: t('component:filter.isBetween', 'is between'), value: 'is_between' },
  { label: t('component:filter.isEmpty', 'is empty'), value: 'is_empty' },
  { label: t('component:filter.isNotEmpty', 'is not empty'), value: 'is_not_empty' }
]

export const getTextConditions = (t: TFunction): FilterCondition[] => [
  { label: t('component:filter.is', 'is'), value: 'is' },
  { label: t('component:filter.isNot', 'is not'), value: 'is_not' },
  { label: t('component:filter.contains', 'contains'), value: 'contains' },
  { label: t('component:filter.doesNotContain', 'does not contain'), value: 'does_not_contain' },
  { label: t('component:filter.startsWith', 'starts with'), value: 'starts_with' },
  { label: t('component:filter.endsWith', 'ends with'), value: 'ends_with' },
  { label: t('component:filter.isEmpty', 'is empty'), value: 'is_empty' },
  { label: t('component:filter.isNotEmpty', 'is not empty'), value: 'is_not_empty' }
]

export const getNumberConditions = (t: TFunction): FilterCondition[] => [
  { label: '=', value: 'equals' },
  { label: '≠', value: 'not_equals' },
  { label: '>', value: 'greater' },
  { label: '<', value: 'less' },
  { label: '≥', value: 'greater_equals' },
  { label: '≤', value: 'less_equals' },
  { label: t('component:filter.isEmpty', 'is empty'), value: 'is_empty' },
  { label: t('component:filter.isNotEmpty', 'is not empty'), value: 'is_not_empty' }
]

export const getFilterOptions = (t: TFunction): FilterOption[] => [
  {
    label: t('component:filter.type', 'Type'),
    value: 'type',
    type: 'checkbox',
    conditions: getBasicConditions(t),
    options: [
      { label: t('component:filter.public', 'Public'), value: 'public' },
      { label: t('component:filter.private', 'Private'), value: 'private' },
      { label: t('component:filter.fork', 'Fork'), value: 'fork' }
    ]
  },
  {
    label: t('component:filter.createdTime', 'Created Time'),
    value: 'created_time',
    type: 'calendar',
    conditions: getRangeConditions(t)
  },
  {
    label: t('component:filter.name', 'Name'),
    value: 'name',
    type: 'text',
    conditions: getTextConditions(t)
  },
  {
    label: t('component:filter.stars', 'Stars'),
    value: 'stars',
    type: 'number',
    conditions: getNumberConditions(t)
  }
]

export const getSortOptions = (t: TFunction): SortOption[] => [
  { label: t('component:sort.lastUpdated', 'Last updated'), value: 'updated' },
  { label: t('component:sort.stars', 'Stars'), value: 'stars' },
  { label: t('component:sort.forks', 'Forks'), value: 'forks' },
  { label: t('component:sort.pullRequests', 'Pull Requests'), value: 'pulls' },
  { label: t('component:sort.title', 'Title'), value: 'title' }
]

export const getSortDirections = (t: TFunction): SortDirection[] => [
  { label: t('component:filter.ascending', 'Ascending'), value: 'asc' },
  { label: t('component:filter.descending', 'Descending'), value: 'desc' }
]

export const getLayoutOptions = (t: TFunction): ViewLayoutOption[] => [
  { label: t('component:layout.table', 'Table'), value: 'table' },
  { label: t('component:layout.list', 'List'), value: 'list' }
]

const dateParser: Parser<Date> = {
  parse: (value: string): Date => (value ? new Date(Number(value)) : new Date()),
  serialize: (value: Date): string => value?.getTime().toString() || ''
}

interface PRListFilterOptions {
  t: TFunction
  onAuthorSearch: (name: string) => void
  isPrincipalsLoading?: boolean
  principalData: { label: string; value: string }[]
}

export const getPRListFilterOptions = ({
  t,
  onAuthorSearch,
  isPrincipalsLoading,
  principalData
}: PRListFilterOptions): Array<FilterOptionConfig<keyof PRListFilters>> => [
  {
    label: t('component:filter.author', 'Author'),
    value: 'created_by',
    type: FilterFieldTypes.ComboBox,
    filterFieldConfig: {
      options: principalData,
      onSearch: onAuthorSearch,
      noResultsMessage: 'No results found',
      placeholder: 'Search by author',
      isLoading: isPrincipalsLoading
    },
    parser: {
      parse: (value: string): ComboBoxOptions =>
        principalData.find(user => user.value === value) || { label: '', value },
      serialize: (value: ComboBoxOptions): string => value?.value || ''
    }
  },
  {
    label: t('component:filter.createdBefore', 'Created Before'),
    value: 'created_lt',
    type: FilterFieldTypes.Calendar,
    parser: dateParser
  },
  {
    label: t('component:filter.createdAfter', 'Created After'),
    value: 'created_gt',
    type: FilterFieldTypes.Calendar,
    parser: dateParser
  }
]
