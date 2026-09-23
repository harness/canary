import type { ClassNames } from 'react-day-picker'

import {
  DateRangePickerContent,
  getBrowserTimeZone,
  normalizeDateRangeValue,
  type DateRangeInput,
  type DateRangePickerCalendarProps,
  type DateRangePreset as SemanticDateRangePreset,
  type DateRangeValue as SemanticDateRangeValue,
  type TimeZoneId,
  type Weekday
} from '../../../../date-range-picker'
import type { DateRangeCalendarProps, DateRangeFilterPreset, DateRangePreset, FilterFieldConfig } from '../../../types'

interface DateRangeFieldProps {
  filter: FilterFieldConfig<DateRangeInput>
  presets?: DateRangeFilterPreset[]
  showCustomRange?: boolean
  /** `filterValue` is `undefined` when the user clears the range in the editor and applies. */
  onUpdateFilter: (filterValue?: SemanticDateRangeValue) => void
  onCancel: () => void
  calendarProps?: DateRangeCalendarProps | DateRangePickerCalendarProps
  calendarClassNames?: ClassNames
  allowFuture?: boolean
  enableOffset?: boolean
  enableExclusions?: boolean
  weekStartsOn?: Weekday
  defaultTimeZone?: TimeZoneId
}

const isLegacyPreset = (preset: DateRangeFilterPreset): preset is DateRangePreset => 'getRange' in preset

export const adaptDateRangePresets = (
  presets: DateRangeFilterPreset[] | undefined,
  defaultTimeZone: TimeZoneId = 'UTC'
): SemanticDateRangePreset[] | undefined =>
  presets?.flatMap(preset => {
    if (!isLegacyPreset(preset)) return [preset]

    const range = preset.getRange()
    const value = normalizeDateRangeValue({ from: range.from, to: range.to }, defaultTimeZone)
    if (!value || value.kind !== 'absolute') return []

    return [
      {
        id: preset.value,
        label: preset.label,
        group: preset.group,
        value
      }
    ]
  })

const DateRangeField = ({
  filter,
  presets,
  showCustomRange = true,
  onUpdateFilter,
  onCancel,
  calendarProps,
  calendarClassNames,
  allowFuture,
  enableOffset,
  enableExclusions,
  weekStartsOn,
  // Defaults to the browser's own zone rather than UTC; consumers can still pin an
  // explicit defaultTimeZone via filterFieldConfig when they need a fixed zone.
  defaultTimeZone = getBrowserTimeZone()
}: DateRangeFieldProps) => (
  <DateRangePickerContent
    value={filter.value}
    presets={adaptDateRangePresets(presets, defaultTimeZone)}
    showFixedRange={showCustomRange}
    onApply={onUpdateFilter}
    onCancel={onCancel}
    calendarProps={calendarProps}
    calendarClassNames={calendarClassNames}
    allowFuture={allowFuture}
    enableOffset={enableOffset}
    enableExclusions={enableExclusions}
    weekStartsOn={weekStartsOn}
    defaultTimeZone={defaultTimeZone}
  />
)

export default DateRangeField
