import { Fragment, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'

import { cn } from '@utils/cn'

import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Calendar } from '../calendar'
import { DropdownMenu } from '../dropdown-menu'
import { Select } from '../form-primitives/select'
import { IconV2 } from '../icon-v2'
import { SearchInput } from '../inputs'
import { Popover } from '../popover'
import { Separator } from '../separator'
import { Sidebar } from '../sidebar'
import { Text } from '../text'
import { ToggleGroup } from '../toggle-group'
import { TooltipProvider } from '../tooltip'
import { DateRangeAdjustments } from './date-range-adjustments'
import { DateTimeEndpointField } from './date-time-endpoint-field'
import {
  formatDateRangeLabel,
  formatDateRangeTriggerLabel,
  formatResolvedDateRange,
  formatTimeZoneBadge
} from './format-date-range-label'
import { normalizeDateRangeValue } from './normalize-date-range-value'
import { PositiveAmountInput } from './positive-amount-input'
import { getDefaultDateRangeQuickPresets } from './presets'
import { resolveDateRange } from './resolve-date-range'
import {
  formatTimeZoneOffset,
  getPreferredTimeZones,
  getSupportedTimeZones,
  normalizeTimeZone,
  utcToCivilDate
} from './timezone-utils'
import {
  AbsoluteDateRangeValue,
  CivilDate,
  DateRangeDirection,
  DateRangePickerContentProps,
  DateRangePickerMode,
  DateRangePickerProps,
  DateRangeQuickPreset,
  DateRangeUnit,
  DateRangeValue,
  DEFAULT_TIME_ZONE,
  TimeZoneId,
  Weekday
} from './types'

type EditorSection = 'presets' | 'last' | 'period-to-date' | 'previous-period' | 'fixed'

const ROLLING_UNITS: Array<{ value: DateRangeUnit; label: string }> = [
  { value: 'minute', label: 'Minutes' },
  { value: 'hour', label: 'Hours' },
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
  { value: 'month', label: 'Months' },
  { value: 'quarter', label: 'Quarters' },
  { value: 'year', label: 'Years' }
]

const defaultValue = (timeZone: TimeZoneId = DEFAULT_TIME_ZONE): DateRangeValue => ({
  kind: 'relative',
  direction: 'past',
  amount: 7,
  unit: 'day',
  timeZone
})

/** An unselected fixed draft: the editor opens on Fixed with nothing highlighted. */
const blankValue = (timeZone: TimeZoneId = DEFAULT_TIME_ZONE): DateRangeValue => {
  const today = new Date()
  const date = localToCivilDate(today)
  return {
    kind: 'absolute',
    timeZone,
    from: { date },
    to: { date }
  }
}

const civilDateToLocal = (value: CivilDate): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const localToCivilDate = (value: Date): CivilDate =>
  [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join(
    '-'
  ) as CivilDate

const modeForValue = (value: DateRangeValue): DateRangePickerMode =>
  value.kind === 'absolute' ? 'fixed' : value.kind === 'relative' ? 'rolling' : 'presets'

const matchesQuickPreset = (value: DateRangeValue, preset: DateRangeQuickPreset): boolean => {
  if (!preset.value || value.kind !== preset.value.kind) return false
  if (preset.supportsDirection && value.kind === 'relative' && preset.value.kind === 'relative') {
    return (
      value.amount === preset.value.amount &&
      value.unit === preset.value.unit &&
      JSON.stringify(value.adjustment) === JSON.stringify(preset.value.adjustment)
    )
  }
  return JSON.stringify({ ...value, timeZone: preset.value.timeZone }) === JSON.stringify(preset.value)
}

const sectionForValue = (value: DateRangeValue, quickPresets: DateRangeQuickPreset[] = []): EditorSection => {
  if (quickPresets.some(preset => matchesQuickPreset(value, preset))) return 'presets'
  if (value.kind === 'absolute') return 'fixed'
  if (value.kind === 'relative') return 'last'
  return value.period.startsWith('last_') ? 'previous-period' : 'period-to-date'
}

const selectedForValue = (value: DateRangeValue, weekStartsOn?: Weekday): DateRange | undefined => {
  if (value.kind === 'absolute') {
    return { from: civilDateToLocal(value.from.date), to: civilDateToLocal(value.to.date) }
  }

  try {
    const resolved = resolveDateRange(value, { weekStartsOn })
    return {
      from: civilDateToLocal(utcToCivilDate(resolved.from, value.timeZone)),
      to: civilDateToLocal(utcToCivilDate(new Date(resolved.to.getTime() - 1), value.timeZone))
    }
  } catch {
    return undefined
  }
}

const fixedValueFromRange = (
  range: DateRange,
  timeZone: TimeZoneId,
  previous?: AbsoluteDateRangeValue
): AbsoluteDateRangeValue | undefined => {
  if (!range.from || !range.to) return undefined

  return {
    kind: 'absolute',
    timeZone,
    from: {
      date: localToCivilDate(range.from),
      ...(previous?.from.time ? { time: previous.from.time } : {})
    },
    to: {
      date: localToCivilDate(range.to),
      ...(previous?.to.time ? { time: previous.to.time } : {})
    }
  }
}

const getDisabledMatchers = (
  allowFuture: boolean,
  configured: Matcher | Matcher[] | undefined
): Matcher | Matcher[] | undefined => {
  if (allowFuture) return configured
  const future: Matcher = { after: new Date() }
  if (!configured) return future
  return Array.isArray(configured) ? [...configured, future] : [configured, future]
}

const NAV_ITEMS: Array<{ id: EditorSection; label: string }> = [
  { id: 'presets', label: 'Presets' },
  { id: 'last', label: 'Rolling' },
  { id: 'period-to-date', label: 'Period to date' },
  { id: 'previous-period', label: 'Previous period' },
  { id: 'fixed', label: 'Fixed' }
]

const PERIOD_TO_DATE_OPTIONS = [
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'this_quarter', label: 'This quarter' },
  { value: 'this_year', label: 'This year' }
]

const PREVIOUS_PERIOD_OPTIONS = [
  { value: 'last_week', label: 'Last week' },
  { value: 'last_month', label: 'Last month' },
  { value: 'last_quarter', label: 'Last quarter' },
  { value: 'last_year', label: 'Last year' }
]

export const DateRangePickerContent = ({
  value,
  onApply,
  onCancel,
  presets: customPresets = [],
  allowFuture = true,
  enableOffset = false,
  enableExclusions = false,
  showAdjustmentControls = true,
  quickPresets: configuredQuickPresets,
  defaultTimeZone = DEFAULT_TIME_ZONE,
  weekStartsOn,
  onInterpretQuery,
  calendarProps,
  calendarClassNames,
  showFixedRange = true,
  className
}: DateRangePickerContentProps) => {
  const safeDefaultTimeZone = normalizeTimeZone(defaultTimeZone)
  const quickPresets = useMemo(
    () =>
      (configuredQuickPresets ?? getDefaultDateRangeQuickPresets(safeDefaultTimeZone)).map(preset => ({
        ...preset,
        ...(preset.value ? { value: { ...preset.value, timeZone: safeDefaultTimeZone } as DateRangeValue } : {})
      })),
    [configuredQuickPresets, safeDefaultTimeZone]
  )
  const normalizedValue = normalizeDateRangeValue(value, safeDefaultTimeZone)
  const emptyDraft = () => (showFixedRange ? blankValue(safeDefaultTimeZone) : defaultValue(safeDefaultTimeZone))
  const initial = normalizedValue ?? emptyDraft()
  const [draft, setDraft] = useState<DateRangeValue>(initial)
  const [hasDraftValue, setHasDraftValue] = useState(Boolean(normalizedValue))
  const [mode, setMode] = useState<DateRangePickerMode>(modeForValue(initial))
  const [section, setSection] = useState<EditorSection>(
    normalizedValue ? sectionForValue(initial, quickPresets) : 'presets'
  )
  const [fixedSelection, setFixedSelection] = useState<DateRange | undefined>(
    normalizedValue ? selectedForValue(initial, weekStartsOn) : undefined
  )
  const [month, setMonth] = useState<Date>(() => selectedForValue(initial, weekStartsOn)?.from ?? new Date())
  const [query, setQuery] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState('')
  const [presetDirection, setPresetDirection] = useState<DateRangeDirection>(
    initial.kind === 'relative' ? initial.direction : 'past'
  )
  const timeZoneOptions = useMemo(() => {
    const preferred = getPreferredTimeZones()
    const zoneOption = (zone: TimeZoneId, name: string) => ({
      label: `${formatTimeZoneOffset(zone)}  ${name}`,
      value: zone
    })
    const rest = getSupportedTimeZones().filter(zone => !preferred.includes(zone))

    return [
      ...preferred.map(zone =>
        zone === DEFAULT_TIME_ZONE
          ? zoneOption(zone, 'Universal Coordinated Time')
          : zoneOption(zone, `Browser Time (${zone})`)
      ),
      '-' as const,
      ...rest.map(zone => zoneOption(zone, zone.replace(/_/g, ' ')))
    ]
  }, [])

  const timeZone = draft.timeZone
  const previewSelection = hasDraftValue
    ? mode === 'fixed'
      ? fixedSelection
      : selectedForValue(draft, weekStartsOn)
    : undefined
  const fixedComplete = mode !== 'fixed' || Boolean(fixedSelection?.from && fixedSelection.to)
  const draftValid = hasDraftValue && fixedComplete

  const resetDraft = () => {
    const applied = normalizeDateRangeValue(value, safeDefaultTimeZone)
    const next = applied ?? emptyDraft()
    const selection = applied ? selectedForValue(next, weekStartsOn) : undefined
    setDraft(next)
    setHasDraftValue(Boolean(applied))
    setMode(modeForValue(next))
    setSection(applied ? sectionForValue(next, quickPresets) : 'presets')
    setFixedSelection(selection)
    setMonth(selection?.from ?? new Date())
    setQuery('')
    setQueryError('')
    if (next.kind === 'relative') setPresetDirection(next.direction)
  }

  /** Empties the date selection while preserving the selected time zone. */
  const clearRange = () => {
    const next = showFixedRange ? blankValue(timeZone) : defaultValue(timeZone)
    setDraft(next)
    setHasDraftValue(false)
    setMode(modeForValue(next))
    setSection('presets')
    setFixedSelection(undefined)
    setMonth(new Date())
    setQuery('')
    setQueryError('')
  }

  useEffect(() => {
    resetDraft()
  }, [value, safeDefaultTimeZone, weekStartsOn])

  const switchToFixed = () => {
    const selection = selectedForValue(draft, weekStartsOn)
    const nextSelection = selection?.from && selection.to ? selection : { from: new Date(), to: new Date() }
    const previous = draft.kind === 'absolute' ? draft : undefined
    const nextDraft = fixedValueFromRange(nextSelection, timeZone, previous)
    if (nextDraft) setDraft(nextDraft)
    setFixedSelection(nextSelection)
    setMonth(nextSelection.from ?? new Date())
    setMode('fixed')
    setSection('fixed')
  }

  const handleSectionChange = (nextSection: EditorSection) => {
    setSection(nextSection)
    if (nextSection === 'presets') return
    setHasDraftValue(true)
    if (nextSection === 'fixed') {
      switchToFixed()
      return
    }
    if (nextSection === 'last') {
      setMode('rolling')
      if (draft.kind !== 'relative') setDraft(defaultValue(timeZone))
      return
    }
    const period = nextSection === 'period-to-date' ? 'this_month' : 'last_month'
    const nextDraft: DateRangeValue = {
      kind: 'calendar',
      period,
      ...(nextSection === 'period-to-date' ? { extent: 'to_now' as const } : {}),
      timeZone
    }
    setDraft(nextDraft)
    setMode('presets')
    const selection = selectedForValue(nextDraft, weekStartsOn)
    setFixedSelection(selection)
    if (selection?.from) setMonth(selection.from)
  }

  const updateCalendarPeriod = (period: string) => {
    const nextDraft: DateRangeValue = {
      kind: 'calendar',
      period: period as Extract<DateRangeValue, { kind: 'calendar' }>['period'],
      ...(period.startsWith('this_') ? { extent: 'to_now' as const } : {}),
      timeZone
    }
    setDraft(nextDraft)
    setHasDraftValue(true)
    setMode('presets')
    const selection = selectedForValue(nextDraft, weekStartsOn)
    setFixedSelection(selection)
    if (selection?.from) setMonth(selection.from)
  }

  const updateEndpointDate = (endpoint: 'from' | 'to', date: CivilDate) => {
    if (draft.kind !== 'absolute') return

    const next: AbsoluteDateRangeValue = { ...draft, [endpoint]: { ...draft[endpoint], date } }
    // Typing past the opposite endpoint collapses the range onto the edited day.
    if (next.from.date > next.to.date) {
      const opposite = endpoint === 'from' ? 'to' : 'from'
      next[opposite] = { ...next[opposite], date }
    }

    setDraft(next)
    setHasDraftValue(true)
    setFixedSelection({ from: civilDateToLocal(next.from.date), to: civilDateToLocal(next.to.date) })
    setMonth(civilDateToLocal(date))
  }

  const handleCalendarClick = (day: Date) => {
    if (!showFixedRange) return
    setHasDraftValue(true)

    if (mode !== 'fixed') {
      switchToFixed()
      const nextSelection = { from: day, to: undefined }
      setFixedSelection(nextSelection)
      return
    }

    if (!fixedSelection?.from || fixedSelection.to) {
      setFixedSelection({ from: day, to: undefined })
      // Keep the endpoint fields in step with the pending start; Apply stays
      // disabled until the second click completes the range.
      const started = fixedValueFromRange(
        { from: day, to: day },
        timeZone,
        draft.kind === 'absolute' ? draft : undefined
      )
      if (started) setDraft(started)
      return
    }

    const nextSelection =
      day < fixedSelection.from ? { from: day, to: fixedSelection.from } : { from: fixedSelection.from, to: day }
    setFixedSelection(nextSelection)
    const nextDraft = fixedValueFromRange(nextSelection, timeZone, draft.kind === 'absolute' ? draft : undefined)
    if (nextDraft) setDraft(nextDraft)
  }

  const updateRolling = (patch: Partial<Extract<DateRangeValue, { kind: 'relative' }>>) => {
    const current = draft.kind === 'relative' ? draft : defaultValue(timeZone)
    const next = { ...current, ...patch }
    if (next.direction === 'future' && next.adjustment?.type === 'offset') {
      delete next.adjustment
    }
    setDraft(next as DateRangeValue)
    setHasDraftValue(true)
  }

  const updateTimeZone = (nextTimeZone: string) => {
    const zone = normalizeTimeZone(nextTimeZone)
    setDraft({ ...draft, timeZone: zone } as DateRangeValue)
    setHasDraftValue(true)
  }

  const interpretQuery = async () => {
    const trimmed = query.trim()
    if (!trimmed || !onInterpretQuery) return
    setQueryLoading(true)
    setQueryError('')
    try {
      const interpreted = normalizeDateRangeValue(await onInterpretQuery(trimmed), timeZone)
      if (!interpreted) throw new Error('The query did not return a valid date range')
      setDraft(interpreted)
      setHasDraftValue(true)
      setMode(modeForValue(interpreted))
      setSection(sectionForValue(interpreted, quickPresets))
      const selection = selectedForValue(interpreted, weekStartsOn)
      setFixedSelection(selection)
      if (selection?.from) setMonth(selection.from)
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'Unable to interpret date range')
    } finally {
      setQueryLoading(false)
    }
  }

  const visibleQuickPresets = quickPresets.filter(
    (preset): preset is DateRangeQuickPreset & { value: DateRangeValue } => Boolean(preset.value)
  )
  const directionalQuickPresets = visibleQuickPresets.filter(
    preset => preset.supportsDirection && preset.value.kind === 'relative'
  )
  const regularQuickPresets = visibleQuickPresets.filter(preset => !directionalQuickPresets.includes(preset))
  const quickPresetValue = (preset: DateRangeQuickPreset & { value: DateRangeValue }): DateRangeValue =>
    preset.supportsDirection && preset.value.kind === 'relative'
      ? ({ ...preset.value, direction: presetDirection, timeZone } as DateRangeValue)
      : ({ ...preset.value, timeZone } as DateRangeValue)
  const selectedQuickPresetId = hasDraftValue
    ? visibleQuickPresets.find(preset => JSON.stringify(quickPresetValue(preset)) === JSON.stringify(draft))?.id
    : undefined

  const applyQuickDraft = (presetId: string) => {
    const preset = visibleQuickPresets.find(item => item.id === presetId)
    if (!preset) return
    const next = quickPresetValue(preset)
    setDraft(next)
    setHasDraftValue(true)
    setMode(modeForValue(next))
    setSection('presets')
    if (next.kind === 'relative') setPresetDirection(next.direction)
    const selection = selectedForValue(next, weekStartsOn)
    setFixedSelection(selection)
    if (selection?.from) setMonth(selection.from)
  }

  const updatePresetDirection = (direction: string) => {
    const nextDirection: DateRangeDirection = direction === 'future' ? 'future' : 'past'
    setPresetDirection(nextDirection)
    const selected = directionalQuickPresets.find(preset => preset.id === selectedQuickPresetId)
    if (selected && selected.value.kind === 'relative') {
      const next = { ...selected.value, direction: nextDirection, timeZone } as DateRangeValue
      setDraft(next)
      const selection = selectedForValue(next, weekStartsOn)
      setFixedSelection(selection)
      if (selection?.from) setMonth(selection.from)
    }
  }

  const hasSelectedDuration = directionalQuickPresets.some(preset => preset.id === selectedQuickPresetId)
  const moveDurationFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    const group = event.currentTarget.closest('[role="radiogroup"]')
    if (!step || !group) return

    event.preventDefault()
    const radios = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
    const current = radios.indexOf(event.currentTarget)
    const next = radios[(current + step + radios.length) % radios.length]
    next?.focus()
    next?.click()
  }

  const apply = () => {
    if (!draftValid) return
    onApply(draft)
  }

  const cancel = () => {
    resetDraft()
    onCancel()
  }

  const selected = previewSelection
  const disabledMatchers = getDisabledMatchers(allowFuture, calendarProps?.disabled)
  const presetActions = visibleQuickPresets.length > 0 && (
    <div className="flex flex-wrap items-center gap-cn-sm">
      {regularQuickPresets.length > 0 && (
        <ToggleGroup.Root
          type="single"
          size="sm"
          value={
            regularQuickPresets.some(preset => preset.id === selectedQuickPresetId) ? selectedQuickPresetId : undefined
          }
          onChange={applyQuickDraft}
          unselectable
          aria-label="Quick date range presets"
        >
          {regularQuickPresets.map(preset => (
            <ToggleGroup.Item key={preset.id} value={preset.id} text={preset.label} />
          ))}
        </ToggleGroup.Root>
      )}

      {directionalQuickPresets.length > 0 && (
        <div className="border-cn-2 flex min-w-0 items-center overflow-hidden rounded-cn-3 border border-solid">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-none border-0"
                aria-label={`Duration direction: ${presetDirection === 'past' ? 'Last' : 'Next'}`}
                tooltipProps={{ content: 'Choose whether durations look back or ahead' }}
              >
                {presetDirection === 'past' ? 'Last' : 'Next'}
                <IconV2 name="nav-arrow-down" size="2xs" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start" className="min-w-56">
              <DropdownMenu.Item
                title="Last"
                description="Durations end at now"
                checkmark={presetDirection === 'past'}
                onSelect={() => updatePresetDirection('past')}
              />
              <DropdownMenu.Item
                title="Next"
                description="Durations start at now"
                checkmark={presetDirection === 'future'}
                onSelect={() => updatePresetDirection('future')}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Separator orientation="vertical" className="h-5" />
          <div
            role="radiogroup"
            aria-label={`${presetDirection === 'past' ? 'Last' : 'Next'} duration presets`}
            className="flex items-center"
          >
            {directionalQuickPresets.map((preset, index) => {
              const isSelected = preset.id === selectedQuickPresetId
              const previousSelected = directionalQuickPresets[index - 1]?.id === selectedQuickPresetId
              return (
                <Fragment key={preset.id}>
                  {index > 0 && (
                    <Separator
                      orientation="vertical"
                      className={cn('h-3.5', { invisible: isSelected || previousSelected })}
                    />
                  )}
                  <Button
                    size="sm"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected || (!hasSelectedDuration && index === 0) ? 0 : -1}
                    variant={isSelected ? 'primary' : 'ghost'}
                    className="rounded-none border-0"
                    onClick={() => applyQuickDraft(preset.id)}
                    onKeyDown={moveDurationFocus}
                  >
                    {preset.label}
                  </Button>
                </Fragment>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={cn('w-[720px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-cn-4 bg-cn-1', className)}>
      {onInterpretQuery && (
        <div className="border-cn-2 border-x-0 border-t-0 border-b border-solid p-cn-sm">
          <SearchInput
            size="md"
            debounce={false}
            aria-label="Describe a date range"
            placeholder='Describe a date and time range, e.g. "last 7 days"'
            searchValue={query}
            onChange={nextQuery => {
              setQuery(nextQuery)
              if (queryError) setQueryError('')
            }}
            onEnter={() => void interpretQuery()}
            theme={queryError ? 'danger' : 'default'}
            className="text-cn-size-5"
            inputContainerClassName="h-10 w-full"
            prefix={
              <span className="grid h-full w-10 shrink-0 place-items-center">
                <IconV2 name="sparks" size="md" className="text-cn-brand-primary" />
              </span>
            }
            suffix={
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                loading={queryLoading}
                disabled={!query.trim()}
                onClick={interpretQuery}
                aria-label="Interpret date range"
              >
                <IconV2 name="arrow-right" size="sm" />
              </Button>
            }
          />
          {queryError && (
            <Text variant="caption-normal" color="danger" className="mt-cn-2xs block px-cn-xs" role="alert">
              {queryError}
            </Text>
          )}
        </div>
      )}

      <div className="flex min-h-[400px]">
        <aside className="border-cn-2 w-52 shrink-0 border-y-0 border-l-0 border-r border-solid bg-cn-1 p-cn-sm">
          <Sidebar.Provider defaultOpen className="h-auto min-h-0 w-full bg-transparent [--cn-sidebar-min-height:auto]">
            <nav aria-label="Custom date range options" className="w-full">
              <div role="menu" className="space-y-cn-3xs">
                {NAV_ITEMS.filter(item => showFixedRange || item.id !== 'fixed').map(item => (
                  <Sidebar.Item
                    key={item.id}
                    title={item.label}
                    active={section === item.id}
                    aria-current={section === item.id ? 'page' : undefined}
                    onClick={() => handleSectionChange(item.id)}
                  />
                ))}
              </div>
            </nav>
          </Sidebar.Provider>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-[88px] items-start justify-between gap-cn-md p-cn-md">
            <div className="min-w-0 flex-1">
              {section === 'presets' && (
                <div className="space-y-cn-md">
                  {presetActions}
                  {customPresets.length > 0 && (
                    <div className="space-y-cn-xs">
                      <Text variant="caption-strong" color="foreground-3" className="block">
                        Saved presets
                      </Text>
                      <div className="flex flex-wrap gap-cn-xs">
                        {customPresets.map(preset => (
                          <Button
                            key={preset.id}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const next = { ...preset.value, timeZone } as DateRangeValue
                              setDraft(next)
                              setHasDraftValue(true)
                              setMode(modeForValue(next))
                              setSection('presets')
                              const selection = selectedForValue(next, weekStartsOn)
                              setFixedSelection(selection)
                              if (selection?.from) setMonth(selection.from)
                            }}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {section === 'fixed' && draft.kind === 'absolute' && (
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-cn-sm">
                  <div className="min-w-0 space-y-cn-xs">
                    <Text variant="body-strong">Starts</Text>
                    <DateTimeEndpointField
                      label="Start"
                      date={draft.from.date}
                      time={draft.from.time ?? '00:00'}
                      onDateChange={date => updateEndpointDate('from', date)}
                      onTimeChange={time => setDraft({ ...draft, from: { ...draft.from, time } })}
                    />
                  </div>
                  <IconV2 name="arrow-right" size="sm" className="mb-cn-xs text-cn-3" />
                  <div className="min-w-0 space-y-cn-xs">
                    <Text variant="body-strong">Ends</Text>
                    <DateTimeEndpointField
                      label="End"
                      date={draft.to.date}
                      time={draft.to.time ?? '23:59'}
                      onDateChange={date => updateEndpointDate('to', date)}
                      onTimeChange={time => setDraft({ ...draft, to: { ...draft.to, time } })}
                    />
                  </div>
                </div>
              )}

              {section === 'last' && draft.kind === 'relative' && (
                <div className="flex items-end gap-cn-xs">
                  <ToggleGroup.Root
                    type="single"
                    size="sm"
                    value={draft.direction}
                    onChange={(direction: string) => updateRolling({ direction: direction as 'past' | 'future' })}
                    unselectable
                    aria-label="Rolling direction"
                  >
                    <ToggleGroup.Item value="past" text="Last" />
                    <ToggleGroup.Item value="future" text="Next" />
                  </ToggleGroup.Root>
                  <PositiveAmountInput
                    aria-label="Rolling amount"
                    value={draft.amount}
                    onChange={amount => updateRolling({ amount })}
                  />
                  <Select
                    aria-label="Rolling unit"
                    options={ROLLING_UNITS}
                    value={draft.unit}
                    onChange={unit => updateRolling({ unit })}
                    size="sm"
                    wrapperClassName="w-32"
                  />
                </div>
              )}

              {(section === 'period-to-date' || section === 'previous-period') && draft.kind === 'calendar' && (
                <div className="flex items-end gap-cn-sm">
                  <Select
                    label={section === 'period-to-date' ? 'Period to date' : 'Previous period'}
                    aria-label="Calendar period"
                    options={section === 'period-to-date' ? PERIOD_TO_DATE_OPTIONS : PREVIOUS_PERIOD_OPTIONS}
                    value={draft.period}
                    onChange={updateCalendarPeriod}
                    size="sm"
                    wrapperClassName="w-56"
                  />
                  <Text variant="caption-normal" color="foreground-3" className="mb-cn-xs">
                    {formatResolvedDateRange(draft, { includeTimeZone: false, weekStartsOn })}
                  </Text>
                </div>
              )}
            </div>

            {section === 'last' &&
              draft.kind === 'relative' &&
              showAdjustmentControls &&
              (enableOffset || enableExclusions) && (
                <DateRangeAdjustments
                  value={draft}
                  onChange={next => {
                    setDraft(next)
                    setHasDraftValue(true)
                  }}
                  enableOffset={enableOffset}
                  enableExclusions={enableExclusions}
                  className="shrink-0"
                />
              )}
          </div>

          <div className="flex min-h-[320px] items-start justify-center px-cn-md pb-cn-lg pt-cn-sm">
            <Calendar
              {...calendarProps}
              className={cn('!p-0', calendarProps?.className)}
              weekStartsOn={weekStartsOn ?? calendarProps?.weekStartsOn}
              mode="range"
              numberOfMonths={2}
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              disabled={disabledMatchers}
              onDayClick={handleCalendarClick}
              classNames={{
                months: 'flex flex-row space-x-cn-2xl',
                cell: cn(
                  'relative p-0 text-center text-cn-size-2 focus-within:relative focus-within:z-20',
                  '[&:has(>.day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-start)]:rounded-l-cn-3 first:[&:has([aria-selected])]:rounded-l-cn-3 last:[&:has([aria-selected])]:rounded-r-cn-3',
                  '[&:has([aria-selected])]:bg-cn-brand-primary/10 [&:has([aria-selected].day-outside)]:bg-cn-brand-primary/5 [&:has([aria-selected].day-range-end)]:rounded-r-cn-3'
                ),
                day_range_middle: 'aria-selected:bg-transparent aria-selected:text-cn-1',
                ...calendarClassNames
              }}
              aria-label="Date range calendar"
            />
          </div>
        </div>
      </div>

      <div className="border-cn-2 flex min-h-16 flex-wrap items-center justify-between gap-cn-sm border-x-0 border-b-0 border-t border-solid px-cn-md py-cn-sm">
        <div className="flex min-w-0 flex-wrap items-center gap-cn-md">
          <Select
            aria-label="Time zone"
            options={timeZoneOptions}
            value={timeZone}
            onChange={updateTimeZone}
            allowSearch
            size="sm"
            // Zone names outrun the trigger, so the list gets its own width.
            contentClassName="max-w-none w-[340px]"
            triggerClassName="w-80"
          />
        </div>
        <ButtonLayout horizontalAlign="end" className="ml-auto">
          <Button
            iconOnly
            size="sm"
            variant="transparent"
            aria-label="Clear range"
            tooltipProps={{ content: 'Clear range' }}
            onClick={clearRange}
          >
            <IconV2 name="trash" size="sm" />
          </Button>
          <Button size="sm" variant="outline" onClick={cancel}>
            Cancel
          </Button>
          <Button size="sm" disabled={!draftValid} onClick={apply}>
            Apply
          </Button>
        </ButtonLayout>
      </div>
    </div>
  )
}

DateRangePickerContent.displayName = 'DateRangePickerContent'

export const DateRangePicker = ({
  value,
  onChange,
  quickPresets: configuredQuickPresets,
  showQuickPresetBar = true,
  trigger,
  renderTrigger,
  placeholder = 'Select date range',
  disabled,
  className,
  popoverClassName,
  defaultTimeZone = DEFAULT_TIME_ZONE,
  weekStartsOn,
  enableOffset = false,
  enableExclusions = false,
  ...contentProps
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const safeDefaultTimeZone = normalizeTimeZone(defaultTimeZone)
  const normalizedValue = normalizeDateRangeValue(value, safeDefaultTimeZone)
  const quickPresets = useMemo<DateRangeQuickPreset[]>(
    () =>
      (configuredQuickPresets ?? getDefaultDateRangeQuickPresets(safeDefaultTimeZone)).map(preset => ({
        ...preset,
        ...(preset.value ? { value: { ...preset.value, timeZone: safeDefaultTimeZone } as DateRangeValue } : {})
      })),
    [configuredQuickPresets, safeDefaultTimeZone]
  )
  const triggerTimeZone = normalizedValue?.timeZone ?? safeDefaultTimeZone
  const zoneBadge = formatTimeZoneBadge(triggerTimeZone)
  const rangeLabel = normalizedValue
    ? formatDateRangeTriggerLabel(normalizedValue, { weekStartsOn, includeTimeZone: false })
    : placeholder === 'Select date range'
      ? 'Custom'
      : placeholder
  const label = `${rangeLabel} · ${zoneBadge}`
  const fullLabel = normalizedValue
    ? formatDateRangeLabel(normalizedValue, { includeResolvedRange: true, includeTimeZone: true, weekStartsOn })
    : label
  const useQuickPresetBar = showQuickPresetBar && !trigger && !renderTrigger

  // The zone rides along in its own tinted chip so it reads apart from the dates.
  // On the filled primary trigger the chip sits on a plain surface instead.
  const triggerBody = (onPrimary: boolean) => (
    <>
      <IconV2 name="calendar" size="sm" />
      <span className="truncate">{rangeLabel}</span>
      <span
        className={cn(
          'shrink-0 rounded-cn-1 px-cn-3xs py-cn-4xs font-caption-normal',
          onPrimary ? 'bg-cn-1/25 text-inherit' : 'bg-cn-3 text-cn-2'
        )}
      >
        {zoneBadge}
      </span>
    </>
  )

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      aria-label={`Date range: ${fullLabel}`}
      className={cn('max-w-[560px] justify-start', className)}
      tooltipProps={{ content: fullLabel }}
    >
      {triggerBody(false)}
    </Button>
  )
  const triggerContent =
    renderTrigger?.({
      label,
      timeZone: normalizedValue?.timeZone ?? safeDefaultTimeZone,
      open,
      value: normalizedValue
    }) ??
    trigger ??
    defaultTrigger

  return (
    <TooltipProvider>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {useQuickPresetBar ? (
          <div className={className}>
            <Popover.Trigger asChild>
              <Button
                variant={normalizedValue ? 'primary' : 'outline'}
                size="sm"
                disabled={disabled}
                className="max-w-[560px] justify-start"
                aria-label={`Date range: ${fullLabel}`}
                tooltipProps={{ content: fullLabel }}
              >
                {triggerBody(Boolean(normalizedValue))}
              </Button>
            </Popover.Trigger>
          </div>
        ) : (
          <Popover.Trigger asChild>{triggerContent}</Popover.Trigger>
        )}
        <Popover.Content
          align="start"
          hideArrow
          custom
          noMaxWidth
          className={cn('p-0', popoverClassName)}
          onOpenAutoFocus={event => event.preventDefault()}
        >
          <DateRangePickerContent
            {...contentProps}
            value={value}
            enableOffset={enableOffset}
            enableExclusions={enableExclusions}
            showAdjustmentControls
            quickPresets={quickPresets}
            defaultTimeZone={safeDefaultTimeZone}
            weekStartsOn={weekStartsOn}
            onApply={nextValue => {
              onChange(nextValue)
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </Popover.Content>
      </Popover.Root>
    </TooltipProvider>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
