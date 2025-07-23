import { TFunctionWithFallback } from '@/context'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import {
  CalendarFilterOptionConfig,
  CheckboxOptions,
  ComboBoxFilterOptionConfig,
  CustomFilterOptionConfig,
  FilterFieldTypes,
  FilterOptionConfig,
  MultiSelectFilterOptionConfig
} from '@components/filters/types'

import { Parser } from '@harnessio/filters'

import { LabelsValue } from '../pull-request/components/labels'
import { PRListFilters } from '../pull-request/pull-request.types'

const dateParser: Parser<Date> = {
  parse: (value: string): Date => (value ? new Date(Number(value)) : new Date()),
  serialize: (value: Date): string => value?.getTime().toString() || ''
}

type PRListFilterOptionConfig = Array<
  Extract<
    FilterOptionConfig<keyof PRListFilters, LabelsValue>,
    | CalendarFilterOptionConfig
    | ComboBoxFilterOptionConfig
    | CustomFilterOptionConfig<keyof PRListFilters, LabelsValue>
    | MultiSelectFilterOptionConfig
  >
>

interface PRListFilterOptions {
  t: TFunctionWithFallback
  onAuthorSearch: (name: string) => void
  isPrincipalsLoading?: boolean
  reviewOptions: CheckboxOptions[]
  principalData: { label: string; value: string }[]
  customFilterOptions?: PRListFilterOptionConfig
}

export const getPRListFilterOptions = ({
  t,
  onAuthorSearch,
  isPrincipalsLoading,
  principalData,
  reviewOptions,
  customFilterOptions = []
}: PRListFilterOptions): PRListFilterOptionConfig => [
  {
    label: t('views:repos.prListFilterOptions.authorOption.label', 'Author'),
    value: 'created_by',
    type: FilterFieldTypes.ComboBox,
    filterFieldConfig: {
      options: principalData,
      onSearch: onAuthorSearch,
      noResultsMessage: t('views:repos.prListFilterOptions.authorOption.noResults', 'No results found'),
      loadingMessage: t('views:repos.prListFilterOptions.authorOption.loading', 'Loading Authors...'),
      placeholder: t('views:repos.prListFilterOptions.authorOption.placeholder', 'Search by author'),
      isLoading: isPrincipalsLoading
    },
    parser: {
      parse: (value: string): ComboBoxOptions =>
        principalData.find(user => user.value === value) || { label: '', value },
      serialize: (value: ComboBoxOptions): string => value?.value || ''
    }
  },
  {
    label: t('views:repos.prListFilterOptions.beforeOption.label', 'Created Before'),
    value: 'created_lt',
    type: FilterFieldTypes.Calendar,
    parser: dateParser
  },
  {
    label: t('views:repos.prListFilterOptions.afterOption.label', 'Created After'),
    value: 'created_gt',
    type: FilterFieldTypes.Calendar,
    parser: dateParser
  },
  {
    label: t('views:repos.prListFilterOptions.review.label', 'Reviews'),
    value: 'review_decision',
    type: FilterFieldTypes.MultiSelect,
    filterFieldConfig: {
      options: reviewOptions
    },
    parser: {
      parse: (value: string) => {
        // Since "," can be encoded while appending to URL
        const valueArr = decodeURIComponent(value)
          .split(',')
          .filter(Boolean)
          .map(val => reviewOptions.find(option => option.value === val))
          .filter((option): option is CheckboxOptions => option !== undefined)
        return valueArr
      },
      serialize: (value: CheckboxOptions[]) => value.reduce((acc, val) => (acc += `${val.value},`), '')
    }
  },
  ...customFilterOptions
]
