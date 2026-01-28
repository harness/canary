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
import { PrincipalType } from '@/types'
import { Scope } from '@views/common'

import { Parser } from '@harnessio/filters'

import { ExtendedScope } from '../common'
import { getFilterScopeOptions } from '../common/util'
import { LabelsValue } from '../pull-request/components/labels'
import { PRListFilters } from '../pull-request/pull-request.types'

// Helper function to generate a string label from user data
const getAuthorStringLabel = (user: Partial<PrincipalType>): string => {
  const { display_name, email } = user
  if (display_name && email && display_name !== email) {
    return `${display_name} (${email})`
  }
  return display_name || email || String(user.id || '')
}

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
  isProjectLevel?: boolean
  principalData: { label: string | React.ReactNode; value: string }[]
  // Original user data for generating string labels
  principalUserData?: Partial<PrincipalType>[]
  customFilterOptions?: PRListFilterOptionConfig
}

export const getPRListFilterOptions = ({
  t,
  onAuthorSearch,
  isPrincipalsLoading,
  principalData,
  principalUserData,
  isProjectLevel,
  customFilterOptions = [],
  scope
}: PRListFilterOptions & { scope: Scope }): PRListFilterOptionConfig => {
  const { options: scopeFilterOptions, defaultValue: scopeFilterDefaultValue } = getFilterScopeOptions({ t, scope })
  const { accountId, orgIdentifier, projectIdentifier } = scope
  return [
    {
      label: t('views:repos.prListFilterOptions.authorOption.label', 'Author'),
      value: 'created_by',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        // Use React node labels for dropdown display, but map to string labels for filter options
        options: principalData.map(user => {
          // If we have original user data, use it to generate string label
          // Otherwise, try to extract string from React node or use value
          const userObj = principalUserData?.find(u => String(u.id) === user.value)
          const stringLabel = userObj ? getAuthorStringLabel(userObj) : (typeof user.label === 'string' ? user.label : user.value)
          return { label: stringLabel, value: user.value }
        }),
        onSearch: onAuthorSearch,
        noResultsMessage: t('views:repos.prListFilterOptions.authorOption.noResults', 'No results found'),
        loadingMessage: t('views:repos.prListFilterOptions.authorOption.loading', 'Loading Authors...'),
        placeholder: t('views:repos.prListFilterOptions.authorOption.placeholder', 'Search by author'),
        isLoading: isPrincipalsLoading
      },
      parser: {
        parse: (value: string): CheckboxOptions[] => {
          // Handle comma-separated author IDs (for URL state)
          const authorIds = decodeURIComponent(value).split(',').filter(Boolean)
          return authorIds.map(authorId => {
            // Try to find in original user data first
            const userObj = principalUserData?.find(u => String(u.id) === authorId)
            if (userObj) {
              return { label: getAuthorStringLabel(userObj), value: authorId }
            }
            // Fallback to principalData
            const user = principalData.find(u => u.value === authorId)
            if (user) {
              const stringLabel = typeof user.label === 'string' ? user.label : user.value
              return { label: stringLabel, value: authorId }
            }
            // Last resort: use the ID
            return { label: authorId, value: authorId }
          })
        },
        // Serialize as comma-separated for URL state
        serialize: (value: CheckboxOptions[]): string => value.map(v => v.value).join(',')
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
    ...(!(accountId && orgIdentifier && projectIdentifier) && isProjectLevel
      ? [
        {
          label: t('views:scope.label', 'Scope'),
          value: 'include_subspaces' as keyof PRListFilters,
          type: FilterFieldTypes.ComboBox as FilterFieldTypes.ComboBox,
          defaultValue: scopeFilterDefaultValue,
          filterFieldConfig: {
            options: scopeFilterOptions,
            placeholder: 'Select scope',
            allowSearch: false
          },
          sticky: true,
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
