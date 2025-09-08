import { TFunctionWithFallback } from '@/context'
import { CheckboxOptions, FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import { getMultiSelectParser } from '@components/filters/utils'
import { IconV2 } from '@components/icon-v2'

import { booleanParser } from '@harnessio/filters'

import { ConnectorListFilters } from './types'

export const CONNECTOR_SORT_OPTIONS = [
  { label: 'Last modified', value: 'lastModifiedAt,DESC' },
  { label: 'Newest', value: 'createdAt,DESC' },
  { label: 'Oldest', value: 'createdAt,ASC' },
  { label: 'Name (A->Z, 0->9)', value: 'name,ASC' },
  { label: 'Name (Z->A, 9->0)', value: 'name,DESC' }
]

export const getConnectorListFilterOptions = (
  t: TFunctionWithFallback,
  connectorTypeOptions: CheckboxOptions[]
): Array<FilterOptionConfig<keyof ConnectorListFilters>> => {
  const options = [
    { label: t('views:connectors.filterOptions.statusOption.success', 'Success'), value: 'SUCCESS' },
    { label: t('views:connectors.filterOptions.statusOption.failure', 'Failed'), value: 'FAILURE' }
  ]
  return [
    {
      label: t('views:connectors.filterOptions.statusOption.label', 'Connector Type'),
      value: 'type',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        options: connectorTypeOptions
      },
      parser: getMultiSelectParser(connectorTypeOptions)
    },
    {
      label: t('views:connectors.filterOptions.statusOption.label', 'Connectivity Status'),
      value: 'status',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        options
      },
      parser: getMultiSelectParser(options)
    },
    {
      label: t('views:connectors.filterOptions.statusOption.favorite', 'Favorites'),
      value: 'favorite',
      type: FilterFieldTypes.Checkbox,
      filterFieldConfig: {
        label: <IconV2 name="star-solid" size="md" color="warning" className="cursor-pointer" />
      },
      parser: booleanParser
    },
    // {
    //   label: t('views:connectors.filterOptions.tagsOption.label', 'Tags'),
    //   value: 'tags',
    //   type: FilterFieldTypes.MultiTag
    // },
    {
      label: t('views:connectors.filterOptions.connectorIdentifierOption.label', 'Connector Identifier'),
      value: 'connectorIdentifier',
      type: FilterFieldTypes.Text
    },
    {
      label: t('views:connectors.filterOptions.descriptionOption.label', 'Description'),
      value: 'description',
      type: FilterFieldTypes.Text
    }
  ]
}
