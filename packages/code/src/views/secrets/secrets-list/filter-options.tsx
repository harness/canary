import {
  FilterFieldTypes,
  FilterOptionConfig,
  getMultiSelectParser,
  MultiSelectFilterOptionConfig,
  SecretListFilters
} from '@harnessio/ui/components'
import { TFunctionWithFallback } from '@harnessio/ui/context'

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
      label: t('views:secrets.filterOptions.secretType.label', 'Type'),
      value: 'secretTypes',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        options: SECRET_TYPE_OPTIONS
      },
      parser: getMultiSelectParser(SECRET_TYPE_OPTIONS)
    },
    {
      label: t('views:secrets.filterOptions.secretManagerOption.label', 'Secret Manager'),
      value: 'secretManagerIdentifiers',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: secretManagerFilterConfig,
      parser: getMultiSelectParser(secretManagerFilterConfig?.options || [])
    },
    {
      label: t('views:secrets.filterOptions.descriptionOption.label', 'Description'),
      value: 'description',
      type: FilterFieldTypes.Text
    },
    {
      label: t('views:secrets.filterOptions.tagsOption.label', 'Tags'),
      value: 'tags',
      type: FilterFieldTypes.Text
    }
  ]
}
