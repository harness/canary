import { FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import { TFunction } from 'i18next'

import { ConnectorListFilters } from './types'

export const getConnectorListFilterOptions = (t: TFunction): Array<FilterOptionConfig<keyof ConnectorListFilters>> => [
  {
    label: t('views:connectors.filterOptions.statusOption.label', 'Status'),
    value: 'status',
    type: FilterFieldTypes.Checkbox,
    filterFieldConfig: {
      options: [
        { label: t('views:connectors.filterOptions.statusOption.success', 'Success'), value: 'success' },
        { label: t('views:connectors.filterOptions.statusOption.failure', 'Failure'), value: 'failure' }
      ]
    }
  }
]
