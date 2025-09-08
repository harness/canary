import { TFunctionWithFallback } from '@/context'
import {
  FilterFieldTypes,
  FilterOptionConfig,
  MultiSelectFilterOptionConfig,
  SecretListFilters
} from '@components/filters/types'
import { getMultiSelectParser } from '@components/filters/utils'

export const SECRET_SORT_OPTIONS = [
  { label: 'Last modified', value: 'lastModifiedAt,DESC' },
  { label: 'Newest', value: 'createdAt,DESC' },
  { label: 'Oldest', value: 'createdAt,ASC' },
  { label: 'Name (A->Z, 0->9)', value: 'name,ASC' },
  { label: 'Name (Z->A, 9->0)', value: 'name,DESC' }
]

export const SECRET_TYPE_OPTIONS = [
  { label: 'Text', value: 'SecretText' },
  { label: 'File', value: 'SecretFile' }
]

export const getSecretListFilterOptions = (
  t: TFunctionWithFallback,
  secretManagerFilterConfig: MultiSelectFilterOptionConfig['filterFieldConfig']
): FilterOptionConfig<Extract<keyof SecretListFilters, string>>[] => {
  return [
    {
      label: t('views:secrets.filterOptions.secretType.label', 'Secret Type'),
      value: 'secretTypes',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        options: SECRET_TYPE_OPTIONS
      },
      parser: getMultiSelectParser(SECRET_TYPE_OPTIONS)
    },
    {
      label: t('views:secrets.filterOptions.secretManagerOption.label', 'Secret Manager Identifier'),
      value: 'secretManagerIdentifiers',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: secretManagerFilterConfig,
      parser: getMultiSelectParser(secretManagerFilterConfig?.options || [])
    },
    {
      label: t('views:secrets.filterOptions.descriptionOption.label', 'Description'),
      value: 'description',
      type: FilterFieldTypes.Text
    }
  ]
}
