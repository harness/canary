import { cn } from '@utils/cn'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Select } from '../form-primitives/select'
import { IconV2 } from '../icon-v2'
import { Popover } from '../popover'
import { Text } from '../text'
import { ToggleGroup } from '../toggle-group'
import { PositiveAmountInput } from './positive-amount-input'
import {
  DateRangeExclude,
  DateRangeUnit,
  DateRangeValue,
  RelativeAdjustment,
  RelativeDateRangeValue,
  Weekday
} from './types'

const WEEKDAYS: Array<{ value: Weekday; label: string }> = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' }
]

const OFFSET_UNITS: Array<{ value: DateRangeUnit; label: string }> = [
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
  { value: 'month', label: 'Months' }
]

const asRelative = (value?: DateRangeValue): RelativeDateRangeValue | undefined =>
  value?.kind === 'relative' ? value : undefined

const excludeOf = (value?: DateRangeValue): DateRangeExclude | undefined => {
  const adjustment = asRelative(value)?.adjustment
  return adjustment?.type === 'exclude' ? adjustment.exclude : undefined
}

const offsetOf = (value?: DateRangeValue) => {
  const adjustment = asRelative(value)?.adjustment
  return adjustment?.type === 'offset' ? adjustment.offset : undefined
}

/** Summaries live in the tooltip so the triggers keep a constant width. */
const excludeSummary = (exclude?: DateRangeExclude): string | undefined => {
  if (!exclude) return undefined
  const parts = [
    ...(exclude.incompleteInterval ? ['partial'] : []),
    ...(exclude.weekdays ?? []).map(day => WEEKDAYS.find(item => item.value === day)?.label ?? String(day))
  ]
  return parts.length ? `Excluding ${parts.join(', ')}` : undefined
}

const offsetSummary = (offset?: { amount: number; unit: DateRangeUnit }): string | undefined => {
  if (!offset) return undefined
  const plural = (OFFSET_UNITS.find(item => item.value === offset.unit)?.label ?? `${offset.unit}s`).toLowerCase()
  const unit = offset.amount === 1 ? plural.replace(/s$/, '') : plural
  return `Shifted back by ${offset.amount} ${unit}`
}

export interface DateRangeAdjustmentsProps {
  value?: DateRangeValue
  onChange: (value: DateRangeValue) => void
  enableOffset?: boolean
  enableExclusions?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Offset and exclusion controls for rolling ranges.
 */
export const DateRangeAdjustments = ({
  value,
  onChange,
  enableOffset = false,
  enableExclusions = false,
  disabled,
  className
}: DateRangeAdjustmentsProps) => {
  const relative = asRelative(value)
  const exclude = excludeOf(value)
  const offset = offsetOf(value)
  const excludeDisabled = disabled || !relative
  const offsetDisabled = disabled || !relative || relative.direction !== 'past'

  if (!enableOffset && !enableExclusions) return null

  const setAdjustment = (adjustment?: RelativeAdjustment) => {
    if (!relative) return
    const next = { ...relative }
    delete next.adjustment
    onChange((adjustment ? { ...next, adjustment } : next) as DateRangeValue)
  }

  const updateExclude = (patch: DateRangeExclude) => {
    const nextExclude = { ...(exclude ?? {}), ...patch }
    setAdjustment(
      nextExclude.incompleteInterval || nextExclude.weekdays?.length
        ? { type: 'exclude', exclude: nextExclude }
        : undefined
    )
  }

  const updateOffset = (patch: Partial<{ amount: number; unit: DateRangeUnit }>) => {
    const nextOffset = { amount: offset?.amount ?? 1, unit: offset?.unit ?? ('day' as DateRangeUnit), ...patch }
    setAdjustment({ type: 'offset', offset: nextOffset })
  }

  return (
    <div className={cn('flex min-w-0 items-center gap-cn-xs', className)}>
      {enableExclusions && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              size="sm"
              variant={exclude ? 'secondary' : 'outline'}
              disabled={excludeDisabled}
              data-selected={exclude ? 'true' : 'false'}
              tooltipProps={{
                content: excludeDisabled
                  ? 'Exclusions apply to rolling ranges'
                  : (excludeSummary(exclude) ?? 'Exclude intervals or weekdays')
              }}
            >
              Exclude
              <IconV2 name="nav-arrow-down" size="2xs" />
            </Button>
          </Popover.Trigger>
          <Popover.Content custom hideArrow align="end" sideOffset={8} className="w-[328px] p-0">
            <div className="border-cn-2 flex items-center justify-between gap-cn-sm border-x-0 border-t-0 border-b border-solid px-cn-md py-cn-sm">
              <Text variant="body-strong">Exclude from range</Text>
              <Button
                size="sm"
                variant="transparent"
                disabled={!exclude}
                onClick={() => setAdjustment(undefined)}
                className="-mr-cn-xs"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-cn-md p-cn-md">
              <Checkbox
                label="Incomplete current interval"
                checked={Boolean(exclude?.incompleteInterval)}
                onCheckedChange={checked => updateExclude({ incompleteInterval: checked === true })}
              />
              <div className="space-y-cn-xs">
                <Text variant="caption-normal" color="foreground-3" as="span" className="block">
                  Weekdays
                </Text>
                <ToggleGroup.Root
                  type="multiple"
                  size="sm"
                  value={(exclude?.weekdays ?? []).map(String)}
                  onChange={(days: string[]) => updateExclude({ weekdays: days.map(Number) as Weekday[] })}
                  aria-label="Excluded weekdays"
                  className="w-full"
                >
                  {WEEKDAYS.map(day => (
                    <ToggleGroup.Item
                      key={day.value}
                      value={String(day.value)}
                      text={day.label}
                      className="min-w-0 flex-1 px-0"
                    />
                  ))}
                </ToggleGroup.Root>
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      )}

      {enableOffset && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              size="sm"
              variant={offset ? 'secondary' : 'outline'}
              disabled={offsetDisabled}
              data-selected={offset ? 'true' : 'false'}
              tooltipProps={{
                content: offsetDisabled
                  ? 'Offsets apply to past rolling ranges'
                  : (offsetSummary(offset) ?? 'Shift the range back in time')
              }}
            >
              Offset
              <IconV2 name="nav-arrow-down" size="2xs" />
            </Button>
          </Popover.Trigger>
          <Popover.Content custom hideArrow align="end" sideOffset={8} className="w-[328px] p-0">
            <div className="border-cn-2 flex items-center justify-between gap-cn-sm border-x-0 border-t-0 border-b border-solid px-cn-md py-cn-sm">
              <Text variant="body-strong">Shift range back by</Text>
              <Button
                size="sm"
                variant="transparent"
                disabled={!offset}
                onClick={() => setAdjustment(undefined)}
                className="-mr-cn-xs"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-cn-xs p-cn-md">
              <div className="flex items-end gap-cn-xs">
                <PositiveAmountInput
                  aria-label="Offset amount"
                  value={offset?.amount ?? 1}
                  onChange={amount => updateOffset({ amount })}
                />
                <Select
                  aria-label="Offset unit"
                  options={OFFSET_UNITS}
                  value={offset?.unit ?? 'day'}
                  onChange={unit => updateOffset({ unit: unit as DateRangeUnit })}
                  size="sm"
                  wrapperClassName="flex-1"
                />
              </div>
              <Text variant="caption-normal" color="foreground-3" as="span" className="block">
                An offset replaces any exclusions on this range.
              </Text>
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  )
}

DateRangeAdjustments.displayName = 'DateRangeAdjustments'
