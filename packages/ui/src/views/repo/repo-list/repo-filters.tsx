import { RepoListFilters, RepoListQueryFilters, RepoSortMethod } from './types'
import { FilterFieldTypes, FilterOptionConfig } from '@components/filters'
import { Scope } from '@views/common/types'
import { getFilterScopeOptions } from '../common/util'
import { TFunctionWithFallback } from '@/context/translation-context'
import { IconV2 } from '@/components'
import { booleanParser } from '@harnessio/filters'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { ExtendedScope } from '../common'

export const REPO_SORT_OPTIONS = [
  { label: 'Name (A->Z, 0->9)', value: RepoSortMethod.Identifier_Asc },
  { label: 'Name (Z->A, 9->0)', value: RepoSortMethod.Identifier_Desc },
  { label: 'Newest', value: RepoSortMethod.Newest },
  { label: 'Oldest', value: RepoSortMethod.Oldest },
  { label: 'Last push', value: RepoSortMethod.LastPush }
]




export const getRepoListFilterOptions = (
  t: TFunctionWithFallback,
  scope: Scope,
  queryFilterValues?: RepoListQueryFilters
): FilterOptionConfig<keyof RepoListFilters>[] => {
  const { options: scopeFilterOptions, defaultValue: scopeFilterDefaultValue } = getFilterScopeOptions({ t, scope })
  const { projectIdentifier, orgIdentifier, accountId } = scope

  const buildFilterOptions = (): FilterOptionConfig<keyof RepoListFilters>[] => {
    const favoriteFilterDefaultValue = false

    const favoriteFilterOption: FilterOptionConfig<keyof RepoListFilters> = {
      defaultValue: favoriteFilterDefaultValue,
      isDefaultValue: queryFilterValues?.favorite === String(favoriteFilterDefaultValue),
      label: t('views:connectors.filterOptions.statusOption.pinned', 'Pinned'),
      value: 'favorite',
      type: FilterFieldTypes.Checkbox,
      sticky: true,
      filterFieldConfig: {
        label: <IconV2 name="pin-solid" size="md" className="cursor-pointer" />
      },
      parser: booleanParser
    }

    if (!projectIdentifier) {
      const parse = (value: string): ComboBoxOptions => {
        let selectedValue: string
        if (accountId && orgIdentifier) {
          selectedValue = value === 'true' ? ExtendedScope.OrgProg : ExtendedScope.Organization
        } else if (accountId) {
          selectedValue = value === 'true' ? ExtendedScope.All : ExtendedScope.Account
        }

        return scopeFilterOptions.find(scope => scope.value === selectedValue) || { label: '', value }
      }

      const recursiveFilterOption: FilterOptionConfig<keyof RepoListFilters> = {
        defaultValue: scopeFilterDefaultValue,
        isDefaultValue: parse(String(queryFilterValues?.recursive)).value === String(scopeFilterDefaultValue.value),
        label: t('views:scope.label', 'Scope'),
        value: 'recursive',
        type: FilterFieldTypes.ComboBox,
        filterFieldConfig: {
          options: scopeFilterOptions,
          placeholder: 'Select scope',
          allowSearch: false
        },
        parser: {
          parse: parse,
          serialize: (value: ComboBoxOptions): string => {
            const selected = value?.value

            if (accountId && orgIdentifier && projectIdentifier) return ''
            if (accountId && orgIdentifier) return String(selected === ExtendedScope.OrgProg)
            if (accountId) return String(selected === ExtendedScope.All)

            return ''
          }
        }
      }

      return [favoriteFilterOption, recursiveFilterOption]
    }
    return [favoriteFilterOption]
  }

  return buildFilterOptions()
}