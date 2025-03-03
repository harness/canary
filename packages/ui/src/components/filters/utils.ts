import { format } from 'date-fns'

import { ComboBoxOptions } from './filters-bar/actions/variants/combo-box'
import {
  CheckboxFilterOption,
  FilterField,
  FilterFieldTypes,
  FilterOptionConfig,
  FilterSearchQueries,
  FilterValueTypes,
  SortOption,
  SortValue,
  type FilterOption,
  type FilterValue
} from './types'

/**
 * Gets the label and icon for the sort trigger button
 *
 * @param {SortValue[]} activeSorts - Array of currently active sorts
 * @param {SortOption[]} sortOptions - Array of available sort options
 * @returns {{ label: string, icon: string, isDescending?: boolean }} Object containing:
 *   - label: Display text for the trigger
 *   - icon: Icon name to display
 *   - isDescending: Whether the sort is in descending order (for single sort)
 *
 * @description
 * Returns different configurations based on number of active sorts:
 * - No sorts: Empty label with default icon
 * - Single sort: Sort option label with direction indicator
 * - Multiple sorts: Count of active sorts with default icon
 */
export const getSortTriggerLabel = (activeSorts: SortValue[], sortOptions: SortOption[]) => {
  if (activeSorts.length === 0) return { label: '', icon: 'circle-arrows-updown' as const }

  if (activeSorts.length === 1) {
    const currentSort = activeSorts[0]
    const label = sortOptions.find(opt => opt.value === currentSort.type)?.label

    return {
      label,
      icon: 'circle-arrow-top' as const,
      isDescending: currentSort.direction === 'desc'
    }
  }

  return {
    label: `${activeSorts.length} sorts`,
    icon: 'circle-arrows-updown' as const,
    isDescending: false
  }
}

/**
 * Formats the display value for a filter based on its type and selected values
 *
 * @param {FilterOption} filterOption - The filter option configuration
 * @param {FilterValue} filter - The current filter state
 * @returns {string} Formatted display value for the filter
 *
 * @description
 * Handles different filter types:
 * - Checkbox: Joins selected option labels with commas
 * - Calendar: Formats dates based on whether they're in current year
 *   - Single date: "MMM d" or "MMM d, yyyy"
 *   - Date range: "MMM d - MMM d" or "MMM d, yyyy - MMM d, yyyy"
 */
export const getFilterDisplayValue = (filterOption: FilterOption, filter: FilterValue): string => {
  switch (filterOption.type) {
    case 'checkbox':
      return filter.selectedValues
        .map(
          value =>
            (filterOption as CheckboxFilterOption).options.find(
              (opt: { label: string; value: string }) => opt.value === value
            )?.label
        )
        .join(', ')
    case 'calendar': {
      if (filter.selectedValues.length === 0) return ''

      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const currentYear = new Date().getFullYear()
        return date.getFullYear() === currentYear ? format(date, 'MMM d') : format(date, 'MMM d, yyyy')
      }

      if (filter.selectedValues.length === 1) {
        return formatDate(filter.selectedValues[0])
      }
      return `${formatDate(filter.selectedValues[0])} - ${formatDate(filter.selectedValues[1])}`
    }
    case 'text': {
      return filter.selectedValues.join(', ')
    }
    case 'number': {
      return filter.selectedValues.join(', ')
    }
    default:
      return ''
  }
}

export const getFilterLabelValue = <T extends FilterValueTypes>(
  filterOption: FilterOptionConfig,
  filter: FilterField<T>
): string => {
  switch (filterOption.type) {
    case FilterFieldTypes.Calendar: {
      const filterValue = filter.value as Date
      if (!filterValue) return ''

      const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        const currentYear = new Date().getFullYear()
        return date.getFullYear() === currentYear ? format(date, 'MMM d') : format(date, 'MMM d, yyyy')
      }

      return formatDate(filterValue)
    }
    case FilterFieldTypes.Number:
      return filter.value as string

    case FilterFieldTypes.ComboBox: {
      return (filter.value as ComboBoxOptions)?.label
    }
    default:
      return ''
  }
}

/**
 * Filters options based on search query for a specific filter type
 *
 * @param {FilterOption} filterOption - The filter option configuration
 * @param {FilterValue} filter - The current filter state
 * @param {FilterSearchQueries} searchQueries - Object containing search queries for different filters
 * @returns {Array} Filtered array of options based on search query
 *
 * @description
 * Currently supports:
 * - Checkbox filters: Filters options based on label matching search query
 * - Other filter types: Returns empty array
 *
 * Search is case-insensitive and matches partial strings
 */
export const getFilteredOptions = (
  filterOption: FilterOption,
  filter: FilterValue,
  searchQueries: FilterSearchQueries
) => {
  if (filterOption.type === 'checkbox') {
    return filterOption.options.filter(
      option =>
        !searchQueries.filters[filter.type] ||
        option.label.toLowerCase().includes(searchQueries.filters[filter.type].toLowerCase())
    )
  }
  return []
}
