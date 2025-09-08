import { TFunctionWithFallback } from '@/context'
import { CheckboxOptions, FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import { IconV2 } from '@components/icon-v2'

import { booleanParser } from '@harnessio/filters'

import { ConnectorListFilters } from './types'

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
      parser: {
        parse: (value: string) => {
          // Since "," can be encoded while appending to URL
          const valueArr = decodeURIComponent(value)
            .split(',')
            .filter(Boolean)
            .map(val => connectorTypeOptions.find(option => option.value === val))
            .filter((option): option is CheckboxOptions => option !== undefined)
          return valueArr
        },
        serialize: (value?: CheckboxOptions[]) => value?.reduce((acc, val) => (acc += `${val.value},`), '') || ''
      }
    },
    {
      label: t('views:connectors.filterOptions.statusOption.label', 'Connectivity Status'),
      value: 'status',
      type: FilterFieldTypes.MultiSelect,
      filterFieldConfig: {
        options
      },
      parser: {
        parse: (value: string) => {
          // Since "," can be encoded while appending to URL
          const valueArr = decodeURIComponent(value)
            .split(',')
            .filter(Boolean)
            .map(val => options.find(option => option.value === val))
            .filter((option): option is CheckboxOptions => option !== undefined)
          return valueArr
        },
        serialize: (value?: CheckboxOptions[]) => value?.reduce((acc, val) => (acc += `${val.value},`), '') || ''
      }
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
