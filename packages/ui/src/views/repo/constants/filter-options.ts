import { TFunctionWithFallback } from '@/context'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import {
  CalendarFilterOptionConfig,
  ComboBoxFilterOptionConfig,
  CustomFilterOptionConfig,
  FilterFieldTypes,
  FilterOptionConfig,
  MultiSelectFilterOptionConfig
} from '@components/filters/types'
import { Scope } from '@views/common'

import { Parser } from '@harnessio/filters'

import { ExtendedScope } from '../common'
import { getFilterScopeOptions } from '../common/util'
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
  principalData: { label: string; value: string }[]
  customFilterOptions?: PRListFilterOptionConfig
}

export const getPRListFilterOptions = ({
  t,
  onAuthorSearch,
  isPrincipalsLoading,
  principalData,
  customFilterOptions = [],
  scope
}: PRListFilterOptions & { scope: Scope }): PRListFilterOptionConfig => {
  const scopeFilterOptions = getFilterScopeOptions({ t, scope })
  const { accountId, orgIdentifier, projectIdentifier } = scope
  return [
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
    /**
     * Scope filter is only applicable at Account and Organization scope
     */
    ...(!(accountId && orgIdentifier && projectIdentifier)
      ? [
          {
            label: t('views:scope.label', 'Scope'),
            value: 'include_subspaces' as keyof PRListFilters,
            type: FilterFieldTypes.ComboBox as FilterFieldTypes.ComboBox,
            filterFieldConfig: {
              options: scopeFilterOptions,
              placeholder: 'Select scope',
              allowSearch: false
            },
            parser: {
              parse: (value: string): ComboBoxOptions => {
                let selectedValue: string
                if (accountId && orgIdentifier) {
                  selectedValue = value === 'true' ? ExtendedScope.OrgProg : ExtendedScope.Organization
                } else if (accountId) {
                  selectedValue = value === 'true' ? ExtendedScope.All : ExtendedScope.Account
                }

                return scopeFilterOptions.find(scope => scope.value === selectedValue) || { label: '', value }
              },
              serialize: (value: ComboBoxOptions): string => {
                const selected = value?.value

                if (accountId && orgIdentifier && projectIdentifier) return ''
                if (accountId && orgIdentifier) return String(selected === ExtendedScope.OrgProg)
                if (accountId) return String(selected === ExtendedScope.All)

                return ''
              }
            }
          }
        ]
      : []),
    ...customFilterOptions
  ]
}
