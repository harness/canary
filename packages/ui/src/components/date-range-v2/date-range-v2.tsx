/**
 * DateRangeV2 panel and popover trigger.
 *
 * A value is a resolved interval (`from`/`to`) plus a preset id and timezone.
 * Rolling and calendar windows are recomputed from now only when the user applies.
 * Until then the stored bounds stay put. Each mode keeps its own draft, so switching
 * tabs does not discard an in-progress edit.
 */

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'

import { cn } from '@utils/cn'

import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Calendar } from '../calendar'
import { Label } from '../form-primitives/label'
import { Select } from '../form-primitives/select'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Popover } from '../popover'
import { Separator } from '../separator'
import { Text } from '../text'
import { ToggleGroup } from '../toggle-group'
import { TooltipProvider } from '../tooltip'
import {
  dateRangeV2StateFromValue,
  migrateDefaultPreset,
  refreshDateRangeV2Value,
  toDateRangeV2Value
} from './date-range-v2-preset'
import { DateTimeEndpointField } from './date-time-endpoint-field'
import { configuredPresetLabel, formatDateRangeV2Label } from './format-date-range-v2-label'
import { PositiveAmountInput } from './positive-amount-input'
import { resolveDateRangeV2At, resolveTimeZone } from './resolve-date-range-v2'
import { clampAmount, resolveDateRangeV2Config, type ResolvedDateRangeV2Config } from './resolve-picker-config'
import { TimezoneOffsetBadge, TimezoneOptionLabel } from './timezone-offset-badge'
import { getBrowserTimeZone, getSupportedTimeZones, utcToCivilDate, utcToCivilTime } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarRange,
  CalendarUnit,
  CivilDate,
  CivilTime,
  DateRangeAvailability,
  DateRangeV2Mode,
  DateRangeV2Preset,
  DateRangeV2Props,
  DateRangeV2State,
  DateRangeV2Value,
  FixedRange,
  RollingRange,
  RollingUnit,
  TimeZoneId,
  Weekday
} from './types'

/** Copy for each mode. Tab order follows config.modes. */
const SECTIONS: Record<DateRangeV2Mode, { title: string; description: string; example: string; note?: string }> = {
  presets: {
    title: 'Presets',
    description: 'A named window, ready to apply.',
    example: 'e.g. Last 7 days · This month'
  },
  rolling: {
    title: 'Rolling',
    description: 'A window counted back from now, or forward to a future date.',
    example: 'e.g. Last 7 days · Next 2 weeks',
    note: 'Updates to the current time when you apply.'
  },
  calendar: {
    title: 'Calendar periods',
    description: 'A whole day, week, month, quarter or year, aligned to calendar boundaries.',
    example: 'e.g. This month · Previous quarter',
    note: 'Updates to the current period when you apply.'
  },
  custom: {
    title: 'Fixed',
    description: 'Exact start and end dates, with optional times.',
    example: 'e.g. Aug 1 – Aug 15',
    note: 'Does not change on refresh.'
  }
}

const ROLLING_UNITS: Array<{ value: RollingUnit; label: string }> = [
  { value: 'minute', label: 'Minutes' },
  { value: 'hour', label: 'Hours' },
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
  { value: 'month', label: 'Months' },
  { value: 'year', label: 'Years' }
]

const CALENDAR_UNITS: Array<{ value: CalendarUnit; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' }
]

const PRESET_GROUP_LABELS: Record<DateRangeV2Preset['group'], string> = {
  recommended: 'Recommended',
  relative: 'Relative dates',
  calendar: 'Calendar months'
}

/** Grouped select options. Empty groups are omitted. */
const presetSelectOptions = (presets: readonly DateRangeV2Preset[]) =>
  (['recommended', 'relative', 'calendar'] as const)
    .map(group => ({
      label: PRESET_GROUP_LABELS[group],
      options: presets
        .filter(preset => preset.group === group)
        .map(preset => ({ value: preset.value, label: preset.label }))
    }))
    .filter(group => group.options.length > 0)

const fixedRangeFromDates = (from: Date, to: Date, timezone: TimeZoneId): FixedRange => {
  const [start, end] = from <= to ? [from, to] : [to, from]
  return {
    kind: 'fixed',
    from: { date: utcToCivilDate(start, timezone), time: utcToCivilTime(start, timezone) },
    to: { date: utcToCivilDate(end, timezone), time: utcToCivilTime(end, timezone) }
  }
}

const EXTENT_LABELS: Record<CalendarExtent, string> = {
  full: 'Full period',
  to_date: 'So far',
  from_now: 'From now'
}

const LOCALE: TimeZoneId = 'LOCALE'

const rollingDefaultKey = (range: RollingRange): string => `${range.direction}:${range.amount}:${range.unit}`

const fixedDefaultKey = (range: FixedRange | undefined): string =>
  range ? `${range.from.date}T${range.from.time}/${range.to.date}T${range.to.time}` : ''

const calendarDefaultKey = (range: CalendarRange): string =>
  range.position === 'current'
    ? `current:${range.unit}:${range.extent}`
    : `${range.position}:${range.unit}:${range.amount}`

const calendarDefaultAmount = (range: CalendarRange): number => (range.position === 'current' ? 1 : range.amount)

/**
 * Snapshot of the config fields that can rewrite an already applied value.
 * Compared by value so a new config object with the same settings is a no-op.
 * A fixed range is left alone when only rolling or calendar defaults change.
 */
const configDefaults = (config: ResolvedDateRangeV2Config) => ({
  direction: config.direction,
  rollingDefault: rollingDefaultKey(config.rolling.defaultValue),
  rollingMax: config.rolling.maxAmount,
  rollingUnits: config.rolling.units.join(','),
  calendarDefault: calendarDefaultKey(config.calendar.defaultValue),
  calendarMax: config.calendar.maxAmount,
  calendarUnits: config.calendar.units.join(','),
  calendarExtents: config.calendar.extents.join(','),
  customDefault: fixedDefaultKey(config.custom.defaultValue),
  timezone: config.timezone.defaultValue
})

type ConfigDefaults = ReturnType<typeof configDefaults>

const sameDefaults = (left: ConfigDefaults, right: ConfigDefaults) =>
  (Object.keys(left) as (keyof ConfigDefaults)[]).every(key => left[key] === right[key])

const applyConfigDefaults = (
  value: DateRangeV2Value,
  config: ResolvedDateRangeV2Config,
  previous: ConfigDefaults
): DateRangeV2Value | undefined => {
  const current = configDefaults(config)
  const state = dateRangeV2StateFromValue({ ...value, timezone: value.timezone ?? current.timezone })
  let range = state.range

  if (range.kind === 'rolling') {
    const defaultChanged = previous.rollingDefault !== current.rollingDefault
    const constraintsChanged =
      previous.direction !== current.direction ||
      previous.rollingMax !== current.rollingMax ||
      previous.rollingUnits !== current.rollingUnits
    if (defaultChanged) {
      range = coerceRolling(config.rolling.defaultValue, config)
    } else if (constraintsChanged) {
      range = coerceRolling(range, config)
    }
  }

  if (range.kind === 'calendar') {
    const defaultChanged = previous.calendarDefault !== current.calendarDefault
    const constraintsChanged =
      previous.direction !== current.direction ||
      previous.calendarMax !== current.calendarMax ||
      previous.calendarUnits !== current.calendarUnits ||
      previous.calendarExtents !== current.calendarExtents
    if (defaultChanged) {
      range = coerceCalendar(config.calendar.defaultValue, config)
    } else if (constraintsChanged) {
      range = coerceCalendar(range, config)
    }
  }

  if (range.kind === 'fixed' && previous.customDefault !== current.customDefault && config.custom.defaultValue) {
    range = normalizeFixed(config.custom.defaultValue, config)
  }

  let timezone = value.timezone ?? current.timezone
  if (previous.timezone !== current.timezone && (value.timezone == null || value.timezone === previous.timezone)) {
    timezone = current.timezone
  }

  if (JSON.stringify(range) === JSON.stringify(state.range) && timezone === (value.timezone ?? previous.timezone)) {
    return undefined
  }
  return toDateRangeV2Value({ version: 1, range }, timezone, new Date(), config.weekStartsOn)
}

/**
 * `dynamic` stores browser time as `LOCALE`. `explicit` stores the browser's IANA id.
 * Switching the mode rewrites only that pair, so a chosen zone such as `Asia/Kolkata` stays put.
 */
const timezoneForBrowserZone = (timezone: TimeZoneId, browserZone: 'dynamic' | 'explicit'): TimeZoneId => {
  const browser = getBrowserTimeZone()
  if (browserZone === 'explicit' && timezone === LOCALE) return browser
  if (browserZone === 'dynamic' && timezone === browser) return LOCALE
  return timezone
}

/** The illegal side of `past` or `future` stays visible and is disabled, then coerced if a value still uses it. */
const allowsPast = (availability: DateRangeAvailability) => availability !== 'future'
const allowsFuture = (availability: DateRangeAvailability) => availability !== 'past'

export const legalExtents = (availability: DateRangeAvailability): CalendarExtent[] =>
  availability === 'past' ? ['to_date'] : availability === 'future' ? ['from_now'] : ['full', 'to_date', 'from_now']

const CALENDAR_POSITIONS: CalendarRange['position'][] = ['previous', 'current', 'next']
const ROLLING_DIRECTIONS: RollingRange['direction'][] = ['past', 'future']

const legalPositions = (availability: DateRangeAvailability): CalendarRange['position'][] =>
  CALENDAR_POSITIONS.filter(position =>
    availability === 'past' ? position !== 'next' : availability === 'future' ? position !== 'previous' : true
  )

const legalDirections = (availability: DateRangeAvailability): RollingRange['direction'][] =>
  ROLLING_DIRECTIONS.filter(direction =>
    availability === 'past' ? direction === 'past' : availability === 'future' ? direction === 'future' : true
  )

/** Calendar day clicks are local dates. Drafts store civil dates in the selected timezone. */
const pad = (value: number) => String(value).padStart(2, '0')

const localToCivilDate = (value: Date): CivilDate =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` as CivilDate

const civilDateToLocal = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const normalizeFixed = (range: FixedRange, config: ResolvedDateRangeV2Config): FixedRange => {
  let from = range.from
  let to = range.to
  if (from.date > to.date) {
    const swap = from
    from = to
    to = swap
  }
  if (!config.custom.allowTime) {
    from = { ...from, time: '00:00' }
    to = { ...to, time: '23:59' }
  }
  return { kind: 'fixed', from, to }
}

const defaultFixed = (zone: string, config: ResolvedDateRangeV2Config): FixedRange => {
  if (config.custom.defaultValue) return normalizeFixed(config.custom.defaultValue, config)
  const today = utcToCivilDate(new Date(), zone)
  return {
    kind: 'fixed',
    from: { date: today, time: '00:00' },
    to: { date: today, time: '23:59' }
  }
}

/** One draft per mode. The inactive ones stay in state while another tab is open. */
interface Drafts {
  preset: string
  rolling: RollingRange
  calendar: CalendarRange
  custom: FixedRange
}

const visibleExtents = (config: ResolvedDateRangeV2Config): CalendarExtent[] => {
  const allowed = legalExtents(config.direction).filter(extent => config.calendar.extents.includes(extent))
  return allowed.length > 0 ? allowed : legalExtents(config.direction)
}

const preferredPosition = (config: ResolvedDateRangeV2Config): CalendarRange['position'] => {
  const positions = legalPositions(config.direction)
  const preferred = config.calendar.defaultValue.position
  if (positions.includes(preferred)) return preferred
  return positions.includes('current') ? 'current' : positions[0]
}

const preferredExtent = (config: ResolvedDateRangeV2Config): CalendarExtent => {
  const extents = visibleExtents(config)
  const preferred =
    config.calendar.defaultValue.position === 'current' ? config.calendar.defaultValue.extent : extents[0]
  return extents.includes(preferred) ? preferred : extents[0]
}

const defaultRolling = (config: ResolvedDateRangeV2Config): RollingRange =>
  coerceRolling(config.rolling.defaultValue, config)

const defaultCalendar = (config: ResolvedDateRangeV2Config): CalendarRange => {
  const value = config.calendar.defaultValue
  const position = preferredPosition(config)
  const unit = config.calendar.units.includes(value.unit) ? value.unit : config.calendar.units[0]
  if (position === 'current') {
    return { kind: 'calendar', position, unit, extent: preferredExtent(config) }
  }
  return {
    kind: 'calendar',
    position,
    unit,
    amount: clampAmount(calendarDefaultAmount(value), config.calendar.maxAmount)
  }
}

const stateFromValue = (value: DateRangeV2Value | undefined, timezone: TimeZoneId): DateRangeV2State | undefined =>
  value ? dateRangeV2StateFromValue({ ...value, timezone: value.timezone ?? timezone }) : undefined

/** Pull a stored range back inside the current direction, units, and max amount. */
const coerceRolling = (range: RollingRange, config: ResolvedDateRangeV2Config): RollingRange => {
  const directions = legalDirections(config.direction)
  return {
    ...range,
    direction: directions.includes(range.direction) ? range.direction : directions[0],
    unit: config.rolling.units.includes(range.unit) ? range.unit : config.rolling.defaultValue.unit,
    amount: clampAmount(range.amount, config.rolling.maxAmount)
  }
}

const coerceCalendar = (range: CalendarRange, config: ResolvedDateRangeV2Config): CalendarRange => {
  const unit = config.calendar.units.includes(range.unit) ? range.unit : config.calendar.defaultValue.unit
  const positions = legalPositions(config.direction)
  const position = positions.includes(range.position) ? range.position : positions[0]
  if (position === 'current') {
    const extents = visibleExtents(config)
    const extent = range.position === 'current' && extents.includes(range.extent) ? range.extent : extents[0]
    return { kind: 'calendar', position, unit, extent }
  }
  const amount = range.position === 'current' ? calendarDefaultAmount(config.calendar.defaultValue) : range.amount
  return {
    kind: 'calendar',
    position,
    unit,
    amount: clampAmount(amount, config.calendar.maxAmount)
  }
}

const draftsFor = (
  value: DateRangeV2Value | undefined,
  state: DateRangeV2State | undefined,
  config: ResolvedDateRangeV2Config,
  zone: string
): Drafts => {
  const range = state?.range
  return {
    preset: config.presets.find(preset => preset.value === value?.preset)?.value ?? config.presets[0]?.value ?? '',
    rolling: range?.kind === 'rolling' ? coerceRolling(range, config) : defaultRolling(config),
    calendar: range?.kind === 'calendar' ? coerceCalendar(range, config) : defaultCalendar(config),
    custom: range?.kind === 'fixed' ? range : defaultFixed(zone, config)
  }
}

/** Named presets open the Presets tab. Anything else follows the parsed range, falling back to the first allowed mode. */
const sectionFor = (
  value: DateRangeV2Value | undefined,
  state: DateRangeV2State | undefined,
  config: ResolvedDateRangeV2Config
): DateRangeV2Mode => {
  if (value?.preset && config.presets.some(preset => preset.value === value.preset)) return 'presets'
  const preferred: DateRangeV2Mode =
    state?.range.kind === 'calendar' ? 'calendar' : state?.range.kind === 'fixed' ? 'custom' : 'rolling'
  return config.modes.includes(preferred) ? preferred : config.modes[0]
}

const asState = (range: RollingRange | CalendarRange | FixedRange): DateRangeV2State => ({ version: 1, range })

/**
 * Preset bounds stay on the instants from getRange.
 * Turning them into a fixed range would extend the end through the current minute and block Apply.
 */
const allowsPresetBounds = (bounds: { from: Date; to: Date }, availability: DateRangeAvailability): boolean => {
  if (availability === 'any') return true
  const start = Math.min(bounds.from.getTime(), bounds.to.getTime())
  const end = Math.max(bounds.from.getTime(), bounds.to.getTime())
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false
  const now = Date.now()
  return availability === 'past' ? end <= now : start >= now
}

/** True when the resolved interval stays on the allowed side of `now`. */
export const isAllowedDateRangeV2 = (
  value: DateRangeV2State,
  availability: DateRangeAvailability,
  timezone?: TimeZoneId,
  weekStartsOn?: Weekday,
  now: Date = new Date()
): boolean => {
  if (availability === 'any') return true
  try {
    const [start, end] = resolveDateRangeV2At(value, now, timezone, weekStartsOn)
    const nowMs = now.getTime()
    return availability === 'past' ? end <= nowMs : start >= nowMs
  } catch {
    return false
  }
}

const TIMEZONE_SELECT_ID = 'date-range-v2-timezone'

const UTC_ZONE: TimeZoneId = 'UTC'

/** Browser Time and UTC stay pinned. `locale-utc` returns only that pair and the select hides search. */
export const timezoneOptions = (browserZone: 'dynamic' | 'explicit', optionList: 'all' | 'locale-utc') => {
  const browser = getBrowserTimeZone()
  const browserValue = browserZone === 'dynamic' ? LOCALE : browser
  const browserOption = {
    value: browserValue,
    label: (
      <TimezoneOptionLabel displayTimezone={browser}>
        Browser Time <span className="text-cn-3">({browser})</span>
      </TimezoneOptionLabel>
    )
  }
  const utcOption = {
    value: UTC_ZONE,
    label: (
      <TimezoneOptionLabel displayTimezone={UTC_ZONE}>
        Universal Coordinated Time <span className="text-cn-3">(UTC)</span>
      </TimezoneOptionLabel>
    )
  }
  const pinned = browserValue === UTC_ZONE ? [utcOption] : [browserOption, utcOption]
  if (optionList === 'locale-utc') return pinned
  const rest = getSupportedTimeZones()
    .filter(zone => zone !== UTC_ZONE && (browserZone === 'dynamic' || zone !== browser))
    .map(zone => ({
      value: zone,
      label: <TimezoneOptionLabel displayTimezone={zone}>{zone}</TimezoneOptionLabel>
    }))
  return [...pinned, ...rest]
}

interface DateRangeV2ContentProps {
  value?: DateRangeV2Value
  config?: DateRangeV2Props['config']
  disabled?: boolean
  readOnly?: boolean
  onApply: (value: DateRangeV2Value) => void
  onClear?: () => void
  onCancel: () => void
  className?: string
}

/** The picker body. `DateRangeV2` wraps this in a popover; the filter renders it directly. */
export const DateRangeV2Content = ({
  value,
  config,
  disabled,
  readOnly,
  onApply,
  onClear,
  onCancel,
  className
}: DateRangeV2ContentProps) => {
  const pickerConfig = resolveDateRangeV2Config(config)
  const weekStartsOn = pickerConfig.weekStartsOn
  const timezoneEnabled = pickerConfig.timezone.enabled
  const browserZone = pickerConfig.timezone.browserZone
  const timezoneOptionList = pickerConfig.timezone.options
  const timezoneSelectOptions = useMemo(
    () => timezoneOptions(browserZone, timezoneOptionList),
    [browserZone, timezoneOptionList]
  )
  const initialTimezone = value?.timezone ?? pickerConfig.timezone.defaultValue
  const locked = Boolean(disabled || readOnly)
  const customAllowed = pickerConfig.modes.includes('custom')

  const [draftTimezone, setDraftTimezone] = useState<TimeZoneId>(initialTimezone)
  const zone = resolveTimeZone(draftTimezone)
  const [section, setSection] = useState<DateRangeV2Mode>(() =>
    sectionFor(value, stateFromValue(value, initialTimezone), pickerConfig)
  )
  const [drafts, setDrafts] = useState<Drafts>(() =>
    draftsFor(value, stateFromValue(value, initialTimezone), pickerConfig, zone)
  )
  /** First calendar click in Fixed mode. The second click completes the range. */
  const [pendingStart, setPendingStart] = useState<Date>()
  const [month, setMonth] = useState<Date>(() => new Date())
  const tabRefs = useRef<Record<DateRangeV2Mode, HTMLButtonElement | null>>({
    presets: null,
    rolling: null,
    calendar: null,
    custom: null
  })
  // Replace drafts when the applied value or the config object changes. The filter memoizes config so a parent re-render does not wipe an open edit.
  useEffect(() => {
    const timezone = value?.timezone ?? pickerConfig.timezone.defaultValue
    const state = stateFromValue(value, timezone)
    setDraftTimezone(timezone)
    setSection(sectionFor(value, state, pickerConfig))
    setDrafts(draftsFor(value, state, pickerConfig, resolveTimeZone(timezone)))
    setPendingStart(undefined)
  }, [value, config])

  // Presets preview through the consumer's getRange. Other tabs preview their own draft.
  const selectedPreset =
    section === 'presets' ? pickerConfig.presets.find(preset => preset.value === drafts.preset) : undefined
  const presetBounds = selectedPreset?.getRange({ timezone: draftTimezone })
  const presetRange = presetBounds ? fixedRangeFromDates(presetBounds.from, presetBounds.to, draftTimezone) : undefined
  const activeRange = presetRange ?? (section === 'presets' ? drafts.rolling : drafts[section])
  const appliedTimezone = value?.timezone ?? pickerConfig.timezone.defaultValue
  const appliedRange = value ? stateFromValue(value, appliedTimezone)?.range : undefined
  const draftRange = section === 'presets' ? undefined : drafts[section]
  // Opening the picker must not move an applied window. Recompute from now only after the draft changes.
  const showingApplied = Boolean(
    value &&
      appliedTimezone === draftTimezone &&
      (section === 'presets'
        ? selectedPreset != null &&
          migrateDefaultPreset(selectedPreset.value) === migrateDefaultPreset(value.preset ?? '')
        : appliedRange && JSON.stringify(draftRange) === JSON.stringify(appliedRange))
  )
  const storedBounds: readonly [number, number] | undefined =
    showingApplied && value ? [value.from.getTime(), value.to.getTime()] : undefined
  const activeRangeKey =
    activeRange.kind === 'rolling'
      ? `${activeRange.direction}:${activeRange.amount}:${activeRange.unit}`
      : activeRange.kind === 'calendar'
        ? activeRange.position === 'current'
          ? `${activeRange.position}:${activeRange.unit}:${activeRange.extent}`
          : `${activeRange.position}:${activeRange.unit}:${activeRange.amount}`
        : `${activeRange.from.date}T${activeRange.from.time}/${activeRange.to.date}T${activeRange.to.time}`
  const activeState = asState(activeRange)

  const resolved = useMemo(() => {
    if (storedBounds) return storedBounds
    try {
      return resolveDateRangeV2At(activeState, new Date(), draftTimezone, weekStartsOn)
    } catch {
      return undefined
    }
  }, [storedBounds, activeState, draftTimezone, weekStartsOn])

  const labelState = (showingApplied && value ? stateFromValue(value, appliedTimezone) : undefined) ?? activeState
  const label = formatDateRangeV2Label(
    labelState,
    draftTimezone,
    weekStartsOn,
    new Date(),
    pickerConfig.label,
    storedBounds,
    section === 'presets' ? selectedPreset?.label : undefined
  )
  const allowed =
    section === 'presets' && presetBounds
      ? allowsPresetBounds(presetBounds, pickerConfig.direction)
      : isAllowedDateRangeV2(activeState, pickerConfig.direction, draftTimezone, weekStartsOn)
  const canApply = Boolean(resolved) && allowed && !pendingStart && (section !== 'presets' || Boolean(selectedPreset))

  const selected: DateRange | undefined = pendingStart
    ? { from: pendingStart, to: undefined }
    : resolved
      ? {
          from: civilDateToLocal(utcToCivilDate(new Date(resolved[0]), zone)),
          to: civilDateToLocal(utcToCivilDate(new Date(resolved[1]), zone))
        }
      : undefined

  useEffect(() => {
    if (selected?.from) setMonth(selected.from)
    // Only follow the range when the active tab or range changes, not on every month navigation.
  }, [section, activeRangeKey])

  const today = civilDateToLocal(utcToCivilDate(new Date(), zone))
  const disabledDays: Matcher | undefined = !allowsFuture(pickerConfig.direction)
    ? { after: today }
    : !allowsPast(pickerConfig.direction)
      ? { before: today }
      : undefined

  const setRolling = (patch: Partial<RollingRange>) =>
    setDrafts(prev => ({ ...prev, rolling: coerceRolling({ ...prev.rolling, ...patch }, pickerConfig) }))

  const setCalendar = (
    position: CalendarRange['position'],
    unit: CalendarUnit,
    extent?: CalendarExtent,
    amount?: number
  ) => {
    setDrafts(prev => {
      const currentAmount =
        prev.calendar.position === 'current'
          ? calendarDefaultAmount(pickerConfig.calendar.defaultValue)
          : prev.calendar.amount
      const next: CalendarRange =
        position === 'current'
          ? {
              kind: 'calendar',
              position,
              unit,
              extent:
                extent ?? (prev.calendar.position === 'current' ? prev.calendar.extent : preferredExtent(pickerConfig))
            }
          : {
              kind: 'calendar',
              position,
              unit,
              amount: clampAmount(amount ?? currentAmount, pickerConfig.calendar.maxAmount)
            }
      return { ...prev, calendar: coerceCalendar(next, pickerConfig) }
    })
  }

  const setFixed = (custom: FixedRange) => setDrafts(prev => ({ ...prev, custom }))

  const updateFixedDate = (endpoint: 'from' | 'to', date: CivilDate) => {
    const next: FixedRange = { ...drafts.custom, [endpoint]: { ...drafts.custom[endpoint], date } }
    if (next.from.date > next.to.date) {
      const opposite = endpoint === 'from' ? 'to' : 'from'
      next[opposite] = { ...next[opposite], date }
    }
    setFixed(next)
  }

  const handleDayClick = (day: Date) => {
    if (locked || !customAllowed) return
    if (section !== 'custom') setSection('custom')
    if (!pendingStart) {
      setPendingStart(day)
      return
    }
    const [from, to] = day < pendingStart ? [day, pendingStart] : [pendingStart, day]
    setFixed({
      kind: 'fixed',
      from: { date: localToCivilDate(from), time: drafts.custom.from.time },
      to: { date: localToCivilDate(to), time: drafts.custom.to.time }
    })
    setPendingStart(undefined)
  }

  const moveTabFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const index = pickerConfig.modes.indexOf(section)
    const next =
      pickerConfig.modes[
        (index + (event.key === 'ArrowDown' ? 1 : -1) + pickerConfig.modes.length) % pickerConfig.modes.length
      ]
    setSection(next)
    setPendingStart(undefined)
    tabRefs.current[next]?.focus()
  }

  const calendarDraft = drafts.calendar
  const extents = visibleExtents(pickerConfig)
  const positions = legalPositions(pickerConfig.direction)
  const directions = legalDirections(pickerConfig.direction)
  const currentExtent = calendarDraft.position === 'current' ? calendarDraft.extent : undefined
  const rollingUnits = ROLLING_UNITS.filter(option => pickerConfig.rolling.units.includes(option.value))
  const calendarUnits = CALENDAR_UNITS.filter(option => pickerConfig.calendar.units.includes(option.value))
  const fixedForApply: FixedRange = pickerConfig.custom.allowTime
    ? drafts.custom
    : {
        ...drafts.custom,
        from: { ...drafts.custom.from, time: '00:00' },
        to: { ...drafts.custom.to, time: '23:59' }
      }
  const applyState = section === 'custom' ? asState(fixedForApply) : activeState

  return (
    <div
      className={cn(
        'max-w-[calc(100vw-2rem)] overflow-hidden rounded-cn-4 bg-cn-1',
        // One mode hides the tab column, so the panel loses that 240px.
        pickerConfig.modes.length > 1 ? 'w-[760px]' : 'w-[520px]',
        className
      )}
    >
      <Layout.Horizontal align="center" justify="between" gap="md" className="border-b border-cn-2 px-cn-md py-cn-sm">
        <div className="min-w-0">
          <Text variant="body-strong">{label.title}</Text>
          <Text variant="caption-normal" color="foreground-3">
            {label.rangeText}
          </Text>
        </div>
        <ButtonLayout horizontalAlign="end">
          {pickerConfig.clearable && (
            <Button
              size="sm"
              variant="outline"
              iconOnly
              aria-label="Delete"
              disabled={locked || !value || !onClear}
              onClick={onClear}
            >
              <IconV2 name="trash" size="sm" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={locked || !canApply}
            onClick={() => {
              // Preset bounds come from the consumer's getRange, in the selected timezone.
              if (section === 'presets' && selectedPreset) {
                const { from, to } = selectedPreset.getRange({ timezone: draftTimezone })
                const [start, end] = from <= to ? [from, to] : [to, from]
                onApply({ from: start, to: end, preset: selectedPreset.value, timezone: draftTimezone })
                return
              }
              onApply(toDateRangeV2Value(applyState, draftTimezone, new Date(), weekStartsOn))
            }}
          >
            Apply
          </Button>
        </ButtonLayout>
      </Layout.Horizontal>

      <Layout.Horizontal gap="none" align="stretch" className="h-[400px]">
        {/* Tabs are hidden when only one mode is enabled. */}
        {pickerConfig.modes.length > 1 && (
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Date range type"
            className="min-h-0 w-60 shrink-0 overflow-y-auto border-r border-cn-2"
          >
            {pickerConfig.modes.map(mode => {
              const copy = SECTIONS[mode]
              const active = mode === section
              return (
                <button
                  key={mode}
                  ref={node => {
                    tabRefs.current[mode] = node
                  }}
                  type="button"
                  role="tab"
                  id={`date-range-v2-tab-${mode}`}
                  aria-selected={active}
                  aria-controls={`date-range-v2-panel-${mode}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    setSection(mode)
                    setPendingStart(undefined)
                  }}
                  onKeyDown={moveTabFocus}
                  className={cn(
                    'block w-full border-r-2 px-cn-md py-cn-sm text-left',
                    active ? 'border-cn-brand bg-cn-brand-secondary-selected' : 'border-transparent hover:bg-cn-hover'
                  )}
                >
                  <Text variant="body-strong" color={active ? 'brand' : 'foreground-1'} className="block">
                    {copy.title}
                  </Text>
                  {pickerConfig.tabDetails.includes('description') && (
                    <Text variant="caption-normal" color="foreground-2" className="block">
                      {copy.description}
                    </Text>
                  )}
                  {pickerConfig.tabDetails.includes('example') && (
                    <Text variant="caption-normal" color="foreground-3" className="mt-cn-3xs block">
                      {copy.example}
                    </Text>
                  )}
                  {active && pickerConfig.tabDetails.includes('note') && copy.note && (
                    <Text variant="caption-normal" color="brand" className="mt-cn-3xs block">
                      {copy.note}
                    </Text>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div
          role="tabpanel"
          id={`date-range-v2-panel-${section}`}
          aria-labelledby={`date-range-v2-tab-${section}`}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto"
        >
          {/* Controls for the active mode. The calendar below stays visible for every mode. */}
          <div className="min-h-[72px] p-cn-md">
            {section === 'presets' && (
              <Select
                aria-label="Preset"
                options={presetSelectOptions(pickerConfig.presets)}
                value={drafts.preset}
                disabled={locked}
                onChange={preset => setDrafts(current => ({ ...current, preset }))}
                size="sm"
                wrapperClassName="w-64"
                contentWidth="triggerWidth"
              />
            )}
            {section === 'rolling' && (
              <Layout.Horizontal align="end" gap="xs" wrap="wrap">
                <ToggleGroup.Root
                  type="single"
                  aria-label="Rolling direction"
                  size="sm"
                  variant="ghost"
                  selectedVariant="primary"
                  disabled={locked}
                  unselectable
                  value={drafts.rolling.direction}
                  onChange={(direction: string) => {
                    if (direction === 'past' || direction === 'future') setRolling({ direction })
                  }}
                >
                  {ROLLING_DIRECTIONS.map(direction => (
                    <ToggleGroup.Item
                      key={direction}
                      value={direction}
                      text={direction === 'past' ? 'Last' : 'Next'}
                      disabled={!directions.includes(direction)}
                    />
                  ))}
                </ToggleGroup.Root>
                {pickerConfig.rolling.allowAmount && (
                  <PositiveAmountInput
                    aria-label="Rolling amount"
                    value={drafts.rolling.amount}
                    disabled={locked}
                    onChange={amount => setRolling({ amount })}
                  />
                )}
                <Select
                  aria-label="Rolling unit"
                  options={rollingUnits}
                  value={drafts.rolling.unit}
                  disabled={locked}
                  onChange={unit => setRolling({ unit })}
                  size="sm"
                  wrapperClassName="w-32"
                  contentWidth="triggerWidth"
                />
              </Layout.Horizontal>
            )}

            {section === 'calendar' && (
              <Layout.Horizontal align="end" gap="xs" wrap="wrap">
                <ToggleGroup.Root
                  type="single"
                  aria-label="Calendar position"
                  size="sm"
                  variant="ghost"
                  selectedVariant="primary"
                  disabled={locked}
                  unselectable
                  value={calendarDraft.position}
                  onChange={(position: string) => {
                    if (position === 'previous' || position === 'current' || position === 'next') {
                      setCalendar(position, calendarDraft.unit, currentExtent)
                    }
                  }}
                >
                  {CALENDAR_POSITIONS.map(position => (
                    <ToggleGroup.Item
                      key={position}
                      value={position}
                      text={position === 'previous' ? 'Previous' : position === 'current' ? 'This' : 'Next'}
                      disabled={!positions.includes(position)}
                    />
                  ))}
                </ToggleGroup.Root>
                {calendarDraft.position !== 'current' && pickerConfig.calendar.allowAmount && (
                  <PositiveAmountInput
                    aria-label="Calendar amount"
                    value={calendarDraft.amount}
                    disabled={locked}
                    onChange={amount => setCalendar(calendarDraft.position, calendarDraft.unit, undefined, amount)}
                  />
                )}
                <Select
                  aria-label="Calendar unit"
                  options={calendarUnits}
                  value={calendarDraft.unit}
                  disabled={locked}
                  onChange={unit => setCalendar(calendarDraft.position, unit, currentExtent)}
                  size="sm"
                  wrapperClassName="w-32"
                  contentWidth="triggerWidth"
                />
                {calendarDraft.position === 'current' && extents.length > 1 && (
                  <Select
                    aria-label="Current period extent"
                    options={extents.map(extent => ({ value: extent, label: EXTENT_LABELS[extent] }))}
                    value={calendarDraft.extent}
                    disabled={locked}
                    onChange={extent => setCalendar('current', calendarDraft.unit, extent)}
                    size="sm"
                    wrapperClassName="w-36"
                    contentWidth="triggerWidth"
                  />
                )}
              </Layout.Horizontal>
            )}

            {section === 'custom' && (
              <Layout.Grid
                columns={
                  pickerConfig.custom.allowTime
                    ? 'minmax(0, 1fr) auto minmax(0, 1fr) auto'
                    : 'minmax(0, 1fr) auto minmax(0, 1fr)'
                }
                align="end"
                gap="sm"
              >
                <DateTimeEndpointField
                  label="Start"
                  date={drafts.custom.from.date}
                  time={drafts.custom.from.time}
                  showTime={pickerConfig.custom.allowTime}
                  disabled={locked}
                  onDateChange={date => updateFixedDate('from', date)}
                  onTimeChange={(time: CivilTime) =>
                    setFixed({ ...drafts.custom, from: { ...drafts.custom.from, time } })
                  }
                />
                <span className="flex h-8 items-center" aria-hidden>
                  <IconV2 name="arrow-long-right" size="sm" />
                </span>
                <DateTimeEndpointField
                  label="End"
                  date={drafts.custom.to.date}
                  time={drafts.custom.to.time}
                  showTime={pickerConfig.custom.allowTime}
                  disabled={locked}
                  onDateChange={date => updateFixedDate('to', date)}
                  onTimeChange={(time: CivilTime) => setFixed({ ...drafts.custom, to: { ...drafts.custom.to, time } })}
                />
                {pickerConfig.custom.allowTime && (
                  <Button
                    size="sm"
                    variant="outline"
                    iconOnly
                    aria-label="Full days"
                    disabled={locked}
                    tooltipProps={{
                      content: 'Times default to 00:00 on the start day and 23:59 on the end day.'
                    }}
                    onClick={() =>
                      setFixed({
                        ...drafts.custom,
                        from: { ...drafts.custom.from, time: '00:00' },
                        to: { ...drafts.custom.to, time: '23:59' }
                      })
                    }
                  >
                    <IconV2 name="refresh" size="sm" />
                  </Button>
                )}
              </Layout.Grid>
            )}
          </div>

          <div className="px-cn-md">
            <Separator />
          </div>

          <div className="p-cn-md">
            <Calendar
              aria-label="Date range calendar"
              {...pickerConfig.calendarProps}
              numberOfMonths={pickerConfig.calendarProps?.numberOfMonths ?? 2}
              className={cn('!p-0', pickerConfig.calendarProps?.className)}
              weekStartsOn={weekStartsOn}
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              disabled={disabledDays}
              onDayClick={handleDayClick}
              showOutsideDays={pickerConfig.calendarProps?.showOutsideDays ?? false}
            />
          </div>
        </div>
      </Layout.Horizontal>

      {timezoneEnabled && (
        <div className="flex items-center gap-cn-xs border-t border-cn-3 px-cn-md py-cn-sm">
          <Label htmlFor={TIMEZONE_SELECT_ID}>Timezone</Label>
          <div className="min-w-0 flex-1">
            <Select
              id={TIMEZONE_SELECT_ID}
              options={timezoneSelectOptions}
              value={draftTimezone}
              disabled={locked}
              onChange={next => setDraftTimezone(next as TimeZoneId)}
              allowSearch={timezoneOptionList === 'all'}
              size="sm"
              contentWidth="triggerWidth"
              triggerClassName="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

DateRangeV2Content.displayName = 'DateRangeV2Content'

/** Popover trigger. Reports a new value when config defaults, a legacy preset, or browserZone change. */
export const DateRangeV2 = ({
  value,
  onValueChange,
  config,
  disabled,
  readOnly,
  open: openProp,
  onOpenChange,
  placeholder = 'Select date range',
  className,
  contentClassName,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy
}: DateRangeV2Props) => {
  const pickerConfig = resolveDateRangeV2Config(config)
  const timezone = value?.timezone ?? pickerConfig.timezone.defaultValue
  const browserZoneRef = useRef(pickerConfig.timezone.browserZone)
  const defaultsRef = useRef(configDefaults(pickerConfig))
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  // Push a new value when config defaults change, such as default amount or timezone.
  useEffect(() => {
    const previous = defaultsRef.current
    const next = configDefaults(pickerConfig)
    defaultsRef.current = next
    if (!value || sameDefaults(previous, next)) return
    const aligned = applyConfigDefaults(value, pickerConfig, previous)
    if (!aligned) return
    onValueChange(aligned)
  }, [config, pickerConfig, value, onValueChange])

  // Old default preset ids, such as CURRENT_MONTH, are rewritten to the DateRangeV2 id.
  useEffect(() => {
    if (!value?.preset) return
    const nextPreset = migrateDefaultPreset(value.preset)
    if (nextPreset === value.preset.trim().toUpperCase()) return
    onValueChange(refreshDateRangeV2Value({ ...value, preset: nextPreset }, new Date(), pickerConfig.weekStartsOn))
  }, [pickerConfig.weekStartsOn, value, onValueChange])

  // Rewrite LOCALE ↔ the browser IANA id only after browserZone changes, not on mount.
  useEffect(() => {
    const previous = browserZoneRef.current
    const browserZone = pickerConfig.timezone.browserZone
    browserZoneRef.current = browserZone
    if (previous === browserZone || !pickerConfig.timezone.enabled || !value?.timezone) return
    const nextTimezone = timezoneForBrowserZone(value.timezone, browserZone)
    if (nextTimezone === value.timezone) return
    onValueChange(refreshDateRangeV2Value({ ...value, timezone: nextTimezone }, new Date(), pickerConfig.weekStartsOn))
  }, [
    pickerConfig.timezone.browserZone,
    pickerConfig.timezone.enabled,
    pickerConfig.weekStartsOn,
    value,
    onValueChange
  ])
  const open = openProp ?? uncontrolledOpen
  const setOpen = (next: boolean) => {
    onOpenChange?.(next)
    if (openProp === undefined) setUncontrolledOpen(next)
  }
  const incoming = stateFromValue(value, timezone)
  const triggerText = incoming
    ? formatDateRangeV2Label(
        incoming,
        timezone,
        pickerConfig.weekStartsOn,
        new Date(),
        pickerConfig.label,
        value ? [value.from.getTime(), value.to.getTime()] : undefined,
        configuredPresetLabel(value?.preset, pickerConfig.presets)
      ).triggerText
    : placeholder
  return (
    <TooltipProvider>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            id={id}
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={ariaLabel ?? `Date range: ${triggerText}`}
            aria-labelledby={ariaLabelledBy}
            className={cn('max-w-[560px] justify-start', className)}
          >
            <IconV2 name="clock" size="sm" />
            <span className="truncate">{triggerText}</span>
            {pickerConfig.label.showTimezone && <TimezoneOffsetBadge displayTimezone={timezone} />}
          </Button>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          hideArrow
          custom
          noMaxWidth
          className="p-0"
          onOpenAutoFocus={event => event.preventDefault()}
        >
          <DateRangeV2Content
            value={value}
            config={config}
            disabled={disabled}
            readOnly={readOnly}
            className={contentClassName}
            onApply={nextValue => {
              onValueChange(nextValue)
              setOpen(false)
            }}
            onClear={() => {
              onValueChange(undefined)
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </Popover.Content>
      </Popover.Root>
    </TooltipProvider>
  )
}

DateRangeV2.displayName = 'DateRangeV2'
