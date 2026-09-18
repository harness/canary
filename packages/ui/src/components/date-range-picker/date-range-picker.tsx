import { Fragment, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'

import { cn } from '@utils/cn'

import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Calendar } from '../calendar'
import { DropdownMenu } from '../dropdown-menu'
import { Select } from '../form-primitives/select'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
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
  getBrowserTimeZone,
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
  // The browser's own zone is the friendliest starting point for a fresh picker;
  // UTC remains the ultimate fallback inside normalizeTimeZone if detection fails.
  defaultTimeZone = getBrowserTimeZone(),
  weekStartsOn,
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
  // A complete draft can still fail to resolve (e.g. a fixed range whose end time is
  // earlier than its start time on the same day). Guard here so Apply can't commit a
  // range that would later crash resolveDateRange/formatDateRangeLabel downstream.
  const draftResolves = useMemo(() => {
    if (!hasDraftValue || !fixedComplete) return false
    try {
      resolveDateRange(draft, { weekStartsOn })
      return true
    } catch {
      return false
    }
  }, [draft, fixedComplete, hasDraftValue, weekStartsOn])
  const draftValid = hasDraftValue && fixedComplete && draftResolves
  // The trash button empties the draft so the user can commit "no range" for an already
  // applied value. Apply must stay enabled for that intentional clear even though the
  // (empty) draft itself is not "valid".
  const canClearApplied = !hasDraftValue && Boolean(normalizedValue)
  const canApply = draftValid || canClearApplied

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

  const updateEndpointDate = (endpoint: 'from' | 'to', typed: CivilDate) => {
    if (draft.kind !== 'absolute') return

    // The calendar disables future days via getDisabledMatchers when allowFuture is false,
    // but the text field parses any valid date. Clamp here too so a typed date can't bypass
    // the same constraint the calendar enforces.
    const today = localToCivilDate(new Date())
    const date = !allowFuture && typed > today ? today : typed

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
    if (canClearApplied) {
      onApply(undefined)
      return
    }
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
    // Match the ToggleGroup's own internal item gap (cn-3xs) so the space between
    // Today/Yesterday and the space before the Last/duration group reads as one rhythm.
    <Layout.Horizontal wrap="wrap" align="center" gap="3xs">
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
        // h-8 matches the sm Button's own height (var(--cn-btn-size-sm)) so this pill's
        // own border doesn't add extra height on top of the buttons it wraps.
        <Layout.Horizontal
          align="center"
          gap="none"
          className="border-cn-2 h-8 min-w-0 overflow-hidden rounded-cn-3 border border-solid"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-cn-none border-0"
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
          <Layout.Horizontal
            role="radiogroup"
            aria-label={`${presetDirection === 'past' ? 'Last' : 'Next'} duration presets`}
            align="center"
            gap="none"
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
                    className="rounded-cn-none border-0"
                    onClick={() => applyQuickDraft(preset.id)}
                    onKeyDown={moveDurationFocus}
                  >
                    {preset.label}
                  </Button>
                </Fragment>
              )
            })}
          </Layout.Horizontal>
        </Layout.Horizontal>
      )}
    </Layout.Horizontal>
  )

  return (
    <div className={cn('w-[720px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-cn-4 bg-cn-1', className)}>
      <Layout.Horizontal gap="none" className="min-h-[400px]">
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
          <Layout.Horizontal align="start" justify="between" gap="md" className="p-cn-md min-h-[88px]">
            {/* min-h-[88px] applies to every section (including Fixed) so switching sections in
                the sidebar never jumps the calendar up/down. Fixed's own content (the Start/End
                row) is much shorter than 88px, so it centers its own leftover slack via
                mt-cn-sm/mb-cn-sm on the fields grid below instead of sizing this box to fit—that
                keeps the gap above the fields, the gap below them (before the separator), and
                the gap below the separator (calendar's matching top padding) all equal, rather
                than a tight fit that changes this row's height per section. */}
            <div className="min-w-0 flex-1">
              {section === 'presets' && (
                <div className="space-y-cn-md">
                  {presetActions}
                  {customPresets.length > 0 && (
                    <div className="space-y-cn-xs">
                      <Text variant="caption-strong" color="foreground-3" className="block">
                        Saved presets
                      </Text>
                      <Layout.Horizontal wrap="wrap" gap="xs">
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
                      </Layout.Horizontal>
                    </div>
                  )}
                </div>
              )}

              {section === 'fixed' && draft.kind === 'absolute' && (
                // No arrow between the two fields: it read as "Start comes from the left
                // month, End from the right month," which isn't true—either endpoint can
                // land in either visible month. The border above the calendar does the
                // job of separating this row instead.
                <Layout.Grid columns={2} align="end" gap="sm" className="mt-cn-sm mb-cn-sm">
                  <div className="min-w-0">
                    <DateTimeEndpointField
                      label="Start"
                      date={draft.from.date}
                      time={draft.from.time ?? '00:00'}
                      onDateChange={date => updateEndpointDate('from', date)}
                      onTimeChange={time => setDraft({ ...draft, from: { ...draft.from, time } })}
                    />
                  </div>
                  <div className="min-w-0">
                    <DateTimeEndpointField
                      label="End"
                      date={draft.to.date}
                      time={draft.to.time ?? '23:59'}
                      onDateChange={date => updateEndpointDate('to', date)}
                      onTimeChange={time => setDraft({ ...draft, to: { ...draft.to, time } })}
                    />
                  </div>
                </Layout.Grid>
              )}

              {section === 'last' && draft.kind === 'relative' && (
                // `wrap="wrap"` so this reflows onto a second line instead of the flex row
                // shrinking the joined Last/Next control below its content width—that control's
                // own `overflow-hidden` (needed for the shared border) would silently clip its
                // label text (e.g. "Next" rendering as "Nex") rather than visibly wrapping.
                <Layout.Horizontal align="end" gap="xs" wrap="wrap">
                  {/* Joined segmented control (shared border, no gap between options) instead of
                      the spaced ToggleGroup, so Last/Next reads as one either/or control.
                      `shrink-0` keeps it from ever being squeezed below its label width. */}
                  <Layout.Horizontal
                    role="radiogroup"
                    aria-label="Rolling direction"
                    align="center"
                    gap="none"
                    className="border-cn-2 h-8 shrink-0 overflow-hidden rounded-cn-3 border border-solid"
                  >
                    <Button
                      size="sm"
                      role="radio"
                      aria-checked={draft.direction === 'past'}
                      variant={draft.direction === 'past' ? 'primary' : 'ghost'}
                      className="rounded-cn-none border-0"
                      onClick={() => updateRolling({ direction: 'past' })}
                    >
                      Last
                    </Button>
                    <Separator orientation="vertical" className="h-5" />
                    <Button
                      size="sm"
                      role="radio"
                      aria-checked={draft.direction === 'future'}
                      variant={draft.direction === 'future' ? 'primary' : 'ghost'}
                      className="rounded-cn-none border-0"
                      onClick={() => updateRolling({ direction: 'future' })}
                    >
                      Next
                    </Button>
                  </Layout.Horizontal>
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
                </Layout.Horizontal>
              )}

              {(section === 'period-to-date' || section === 'previous-period') && draft.kind === 'calendar' && (
                <Layout.Horizontal align="end" gap="sm">
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
                </Layout.Horizontal>
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
          </Layout.Horizontal>

          {section === 'fixed' && (
            // Only Fixed pairs a Start/End row with the calendar right below it, so only
            // Fixed needs the separator that keeps the two from reading as one control.
            // The fields' mb-cn-sm plus the header's own p-cn-md give a 28px gap above this
            // line; the calendar row's matching pt-[28px] below gives the same gap on the
            // other side, keeping the line centered between the two.
            <div className="px-cn-md">
              <Separator />
            </div>
          )}

          <Layout.Horizontal
            align="start"
            justify="center"
            gap="none"
            className={cn('min-h-[320px] px-cn-md pb-cn-lg', section === 'fixed' ? 'pt-[28px]' : 'pt-cn-sm')}
          >
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
          </Layout.Horizontal>
        </div>
      </Layout.Horizontal>

      <Layout.Horizontal
        wrap="wrap"
        align="center"
        justify="between"
        gap="sm"
        className="border-cn-2 min-h-16 border-x-0 border-b-0 border-t border-solid px-cn-md py-cn-sm"
      >
        <Layout.Horizontal wrap="wrap" align="center" gap="md" className="min-w-0">
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
        </Layout.Horizontal>
        <ButtonLayout horizontalAlign="end" className="ml-auto">
          {/* Labeled "Clear" instead of a trash icon: the panel header already has a trash
              icon button for deleting the whole filter, so a second trash icon here would
              read as ambiguous/contradictory. */}
          <Button size="sm" variant="ghost" onClick={clearRange}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={cancel}>
            Cancel
          </Button>
          <Button size="sm" disabled={!canApply} onClick={apply}>
            Apply
          </Button>
        </ButtonLayout>
      </Layout.Horizontal>
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
  // Same rationale as DateRangePickerContent: default to the browser's zone, not UTC.
  defaultTimeZone = getBrowserTimeZone(),
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
  // formatDateRangeLabel resolves the range and throws for values that can't (e.g. a fixed
  // range whose end time is earlier than its start). The editor's Apply gate now prevents
  // that from happening via this component, but `value` can also be supplied directly by
  // the consumer, so fall back to the compact label instead of crashing the trigger.
  const fullLabel = normalizedValue
    ? (() => {
        try {
          return formatDateRangeLabel(normalizedValue, {
            includeResolvedRange: true,
            includeTimeZone: true,
            weekStartsOn
          })
        } catch {
          return label
        }
      })()
    : label
  const useQuickPresetBar = showQuickPresetBar && !trigger && !renderTrigger

  // The zone rides along in its own tinted chip so it reads apart from the dates.
  const triggerBody = (
    <>
      <IconV2 name="calendar" size="sm" />
      <span className="truncate">{rangeLabel}</span>
      <span className="bg-cn-3 text-cn-2 shrink-0 rounded-cn-1 px-cn-3xs py-cn-4xs font-caption-normal">
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
      {triggerBody}
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
                variant={normalizedValue ? 'secondary' : 'outline'}
                size="sm"
                disabled={disabled}
                className="max-w-[560px] justify-start"
                aria-label={`Date range: ${fullLabel}`}
                tooltipProps={{ content: fullLabel }}
              >
                {triggerBody}
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
