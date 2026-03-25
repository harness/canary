import { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { DropdownMenu, Calendar as UICalendar } from '@/components'
import { cn } from '@utils/cn'
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths
} from 'date-fns'

import { DateRangePreset, DateRangeValue, FilterFieldConfig } from '../../../types'

interface DateRangeFieldProps {
  filter: FilterFieldConfig<DateRangeValue>
  presets?: DateRangePreset[]
  showCustomRange?: boolean
  onUpdateFilter: (filterValue?: DateRangeValue) => void
}

const formatRangeLabel = (from: Date, to: Date): string => {
  const currentYear = new Date().getFullYear()
  const sameYear = from.getFullYear() === to.getFullYear() && from.getFullYear() === currentYear

  if (sameYear) {
    return `${format(from, 'MMM d')} - ${format(to, 'MMM d')}`
  }

  if (from.getFullYear() === to.getFullYear()) {
    return `${format(from, 'MMM d')} - ${format(to, 'MMM d, yyyy')}`
  }

  return `${format(from, 'MMM d, yyyy')} - ${format(to, 'MMM d, yyyy')}`
}

const getDefaultPresets = (): DateRangePreset[] => {
  const now = new Date()

  return [
    {
      label: 'Last 7 Days',
      value: 'LAST_7_DAYS',
      group: 'recommended',
      getRange: () => ({ from: subDays(now, 7), to: now })
    },
    {
      label: 'This Month',
      value: 'CURRENT_MONTH',
      group: 'recommended',
      getRange: () => ({ from: startOfMonth(now), to: now })
    },

    {
      label: 'Last 7 Days',
      value: 'LAST_7_DAYS',
      group: 'relative',
      getRange: () => ({ from: subDays(now, 7), to: now })
    },
    {
      label: 'Last 30 Days',
      value: 'LAST_30_DAYS',
      group: 'relative',
      getRange: () => ({ from: subDays(now, 30), to: now })
    },

    {
      label: 'This Month',
      value: 'THIS_MONTH',
      group: 'calendar',
      getRange: () => ({ from: startOfMonth(now), to: now })
    },
    {
      label: 'This Quarter',
      value: 'THIS_QUARTER',
      group: 'calendar',
      getRange: () => ({ from: startOfQuarter(now), to: now })
    },
    {
      label: 'This Year',
      value: 'THIS_YEAR',
      group: 'calendar',
      getRange: () => ({ from: startOfYear(now), to: now })
    },
    {
      label: 'Last Month',
      value: 'LAST_MONTH',
      group: 'calendar',
      getRange: () => {
        const lastMonth = subMonths(now, 1)
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
      }
    },
    {
      label: 'Last Quarter',
      value: 'LAST_QUARTER',
      group: 'calendar',
      getRange: () => {
        const lastQuarter = subMonths(now, 3)
        return { from: startOfQuarter(lastQuarter), to: endOfQuarter(lastQuarter) }
      }
    },
    {
      label: 'Last Year',
      value: 'LAST_YEAR',
      group: 'calendar',
      getRange: () => {
        const lastYear = subMonths(now, 12)
        return { from: startOfYear(lastYear), to: endOfYear(lastYear) }
      }
    },
    {
      label: 'Last 3 Months',
      value: 'LAST_3_MONTHS',
      group: 'calendar',
      getRange: () => ({ from: subMonths(now, 3), to: now })
    },
    {
      label: 'Last 6 Months',
      value: 'LAST_6_MONTHS',
      group: 'calendar',
      getRange: () => ({ from: subMonths(now, 6), to: now })
    },
    {
      label: 'Last 12 Months',
      value: 'LAST_12_MONTHS',
      group: 'calendar',
      getRange: () => ({ from: subMonths(now, 12), to: now })
    }
  ]
}

interface PresetListProps {
  recommendedPresets: DateRangePreset[]
  relativePresets: DateRangePreset[]
  calendarPresets: DateRangePreset[]
  showCustomRange: boolean
  onPresetSelect: (preset: DateRangePreset) => void
  calendarContent: React.ReactNode
}

const PresetList = ({
  recommendedPresets,
  relativePresets,
  calendarPresets,
  showCustomRange,
  onPresetSelect,
  calendarContent
}: PresetListProps) => (
  <div className="flex flex-col">
    {recommendedPresets.length > 0 && (
      <DropdownMenu.Group label="Recommended">
        {recommendedPresets.map(preset => {
          const range = preset.getRange()
          return (
            <DropdownMenu.Item
              key={preset.value}
              title={preset.label}
              label={formatRangeLabel(range.from, range.to)}
              onSelect={() => onPresetSelect(preset)}
            />
          )
        })}
      </DropdownMenu.Group>
    )}

    {showCustomRange && (
      <>
        {recommendedPresets.length > 0 && <DropdownMenu.Separator />}
        <DropdownMenu.Item
          title="Select custom range"
          className="text-cn-brand"
          subContentProps={{ className: 'p-0 max-w-none' }}
        >
          <DropdownMenu.Group>{calendarContent}</DropdownMenu.Group>
        </DropdownMenu.Item>
      </>
    )}

    {relativePresets.length > 0 && (
      <>
        <DropdownMenu.Separator />
        <DropdownMenu.Group label="Relative dates">
          {relativePresets.map(preset => {
            const range = preset.getRange()
            return (
              <DropdownMenu.Item
                key={preset.value}
                title={preset.label}
                label={formatRangeLabel(range.from, range.to)}
                onSelect={() => onPresetSelect(preset)}
              />
            )
          })}
        </DropdownMenu.Group>
      </>
    )}

    {calendarPresets.length > 0 && (
      <>
        <DropdownMenu.Separator />
        <DropdownMenu.Group label="Calendar months">
          {calendarPresets.map(preset => {
            const range = preset.getRange()
            return (
              <DropdownMenu.Item
                key={preset.value}
                title={preset.label}
                label={formatRangeLabel(range.from, range.to)}
                onSelect={() => onPresetSelect(preset)}
              />
            )
          })}
        </DropdownMenu.Group>
      </>
    )}
  </div>
)

const DateRangeField = ({ filter, presets, showCustomRange = true, onUpdateFilter }: DateRangeFieldProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    filter.value ? { from: new Date(filter.value.from), to: new Date(filter.value.to) } : undefined
  )
  const [month, setMonth] = useState<Date>(filter.value ? new Date(filter.value.from) : new Date())

  // Sync internal state with external filter.value changes (e.g., when filter is cleared)
  useEffect(() => {
    if (filter.value) {
      setSelectedRange({ from: new Date(filter.value.from), to: new Date(filter.value.to) })
      setMonth(new Date(filter.value.from))
    } else {
      setSelectedRange(undefined)
      setMonth(new Date())
    }
  }, [filter.value])

  const allPresets = presets ?? getDefaultPresets()

  const recommendedPresets = allPresets.filter(p => p.group === 'recommended')
  const relativePresets = allPresets.filter(p => p.group === 'relative')
  const calendarPresets = allPresets.filter(p => p.group === 'calendar')

  const handlePresetSelect = (preset: DateRangePreset) => {
    const range = preset.getRange()
    setSelectedRange({ from: range.from, to: range.to })
    onUpdateFilter({ from: range.from, to: range.to, preset: preset.value })
  }

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range)

    if (range?.from && range?.to) {
      onUpdateFilter({ from: range.from, to: range.to, preset: 'CUSTOM' })
    }
  }

  const calendarContent = (
    <UICalendar
      mode="range"
      numberOfMonths={2}
      selected={selectedRange}
      month={month}
      onMonthChange={setMonth}
      onSelect={handleCustomRangeSelect}
      classNames={{
        months: 'flex flex-row space-x-cn-md',
        cell: cn(
          'relative p-0 text-center text-cn-size-2 focus-within:relative focus-within:z-20',
          '[&:has(>.day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-start)]:rounded-l-cn-3 first:[&:has([aria-selected])]:rounded-l-cn-3 last:[&:has([aria-selected])]:rounded-r-cn-3',
          '[&:has([aria-selected])]:bg-cn-brand-primary/10 [&:has([aria-selected].day-outside)]:bg-cn-brand-primary/5 [&:has([aria-selected].day-range-end)]:rounded-r-cn-3'
        ),
        day_range_middle: 'aria-selected:bg-transparent aria-selected:text-cn-1'
      }}
    />
  )

  return (
    <PresetList
      recommendedPresets={recommendedPresets}
      relativePresets={relativePresets}
      calendarPresets={calendarPresets}
      showCustomRange={showCustomRange}
      onPresetSelect={handlePresetSelect}
      calendarContent={calendarContent}
    />
  )
}

export default DateRangeField
