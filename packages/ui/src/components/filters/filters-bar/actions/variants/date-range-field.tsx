import type { ClassNames } from 'react-day-picker'

import {
  DateRangePickerContent,
  normalizeDateRangeValue,
  type DateRangeInput,
  type DateRangePickerCalendarProps,
  type InterpretDateRangeQuery,
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
  onUpdateFilter: (filterValue: SemanticDateRangeValue) => void
  onCancel: () => void
  calendarProps?: DateRangeCalendarProps | DateRangePickerCalendarProps
  calendarClassNames?: ClassNames
  allowFuture?: boolean
  enableTimeSelection?: boolean
  enableOffset?: boolean
  enableExclusions?: boolean
  onInterpretQuery?: InterpretDateRangeQuery
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
  enableTimeSelection,
  enableOffset,
  enableExclusions,
  onInterpretQuery,
  weekStartsOn,
  defaultTimeZone = 'UTC'
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
    enableTimeSelection={enableTimeSelection}
    enableOffset={enableOffset}
    enableExclusions={enableExclusions}
    onInterpretQuery={onInterpretQuery}
    weekStartsOn={weekStartsOn}
    defaultTimeZone={defaultTimeZone}
  />
)

export default DateRangeField
