/**
 * DateRangeV2 panel and popover trigger.
 *
 * A value stores `range` and a timezone. `from` and `to` are the epochs for that range.
 * Relative and calendar windows are recomputed from now only when the user applies.
 * Until then the stored bounds stay put. Each mode keeps its own draft, so switching
 * tabs does not discard an in-progress edit.
 */

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'

import { cn } from '@utils/cn'

import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Calendar } from '../calendar'
import { Select } from '../form-primitives/select'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Popover } from '../popover'
import { Separator } from '../separator'
import { Text } from '../text'
import { ToggleGroup } from '../toggle-group'
import { TooltipProvider } from '../tooltip'
import { DateTimeEndpointField } from './date-time-endpoint-field'
import {
  formatDateRangeV2Label,
  formatDateRangeV2ValueLabel,
  formatFixedStartLabel
} from './format-date-range-v2-label'
import { clampAmount, normalizeDateRangeV2Config, type NormalizedDateRangeV2Config } from './normalize-picker-config'
import { PositiveAmountInput } from './positive-amount-input'
import { resolveDateRangeV2, resolveDateRangeV2At, resolvePresetBounds, resolveTimeZone } from './resolve-date-range-v2'
import { TimezoneOffsetBadge, TimezoneOptionLabel } from './timezone-offset-badge'
import {
  getBrowserTimeZone,
  getSupportedTimeZones,
  isCivilDateTime,
  shiftCivilDateTimeHours,
  utcToCivilDate,
  utcToCivilDateTime,
  zonedCivilDateTimeToUtc
} from './timezone-utils'
import type {
  CalendarExtent,
  CalendarRange,
  CalendarUnit,
  CivilDate,
  CivilDateTime,
  DateRangeAvailability,
  DateRangeV2Config,
  DateRangeV2Mode,
  DateRangeV2Preset,
  DateRangeV2Props,
  DateRangeV2Value,
  FixedRange,
  PresetRange,
  RelativeRange,
  RelativeUnit,
  ResolvableDateRangeV2,
  TimeZoneId
} from './types'

/** Copy under each tab title. Tab order and titles follow config.modes. */
const SECTIONS: Record<DateRangeV2Mode, { description: string; example: string; note?: string }> = {
  presets: {
    description: 'A named window, ready to apply.',
    example: 'e.g. Last 7 days · This month'
  },
  relative: {
    description: 'A window counted back from now, or forward to a future date.',
    example: 'e.g. Last 7 days · Next 2 weeks',
    note: 'Updates to the current time when you apply.'
  },
  calendar: {
    description: 'A whole day, week, month, quarter or year, aligned to calendar boundaries.',
    example: 'e.g. This month · Previous quarter',
    note: 'Updates to the current period when you apply.'
  },
  fixed: {
    description: 'Exact start and end dates, with optional times.',
    example: 'e.g. Aug 1 – Aug 15',
    note: 'Does not change on refresh.'
  }
}

const RELATIVE_UNITS: Array<{ value: RelativeUnit; label: string }> = [
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
  const start = from <= to ? from : to
  const end = from <= to ? to : from
  return { kind: 'fixed', from: utcToCivilDateTime(start, timezone), to: utcToCivilDateTime(end, timezone) }
}

const EXTENT_LABELS: Record<CalendarExtent, string> = {
  full: 'Full period',
  so_far: 'So far',
  from_now: 'From now'
}

const LOCALE: TimeZoneId = 'LOCALE'

const relativeDefaultKey = (range: RelativeRange): string => `${range.direction}:${range.amount}:${range.unit}`

const fixedDefaultKey = (range: FixedRange | undefined): string => (range ? `${range.from}/${range.to}` : '')

const calendarDefaultKey = (range: CalendarRange): string =>
  range.position === 'this' ? `this:${range.unit}:${range.extent}` : `${range.position}:${range.unit}:${range.amount}`

const calendarDefaultAmount = (range: CalendarRange): number => (range.position === 'this' ? 1 : range.amount)

/**
 * Snapshot of the config fields that can rewrite an already applied value.
 * Compared by value so a new config object with the same settings is a no-op.
 * A fixed range is left alone when only relative or calendar defaults change.
 */
const configDefaults = (config: NormalizedDateRangeV2Config) => ({
  direction: config.direction,
  relativeDefault: relativeDefaultKey(config.relative.defaultValue),
  relativeMax: config.relative.maxAmount,
  relativeUnits: config.relative.units.join(','),
  calendarDefault: calendarDefaultKey(config.calendar.defaultValue),
  calendarMax: config.calendar.maxAmount,
  calendarUnits: config.calendar.units.join(','),
  calendarExtents: config.calendar.extents.join(','),
  fixedDefault: fixedDefaultKey(config.fixed.defaultValue),
  timezone: config.timezone.defaultValue
})

type ConfigDefaults = ReturnType<typeof configDefaults>

const sameDefaults = (left: ConfigDefaults, right: ConfigDefaults) =>
  (Object.keys(left) as (keyof ConfigDefaults)[]).every(key => left[key] === right[key])

const applyConfigDefaults = (
  value: DateRangeV2Value,
  config: NormalizedDateRangeV2Config,
  previous: ConfigDefaults
): DateRangeV2Value | undefined => {
  if (!value.range || value.range.kind === 'preset') return undefined
  const current = configDefaults(config)
  let range: ResolvableDateRangeV2 = value.range

  if (range.kind === 'relative') {
    const defaultChanged = previous.relativeDefault !== current.relativeDefault
    const constraintsChanged =
      previous.direction !== current.direction ||
      previous.relativeMax !== current.relativeMax ||
      previous.relativeUnits !== current.relativeUnits
    if (defaultChanged) {
      range = coerceRelative(config.relative.defaultValue, config)
    } else if (constraintsChanged) {
      range = coerceRelative(range, config)
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

  if (range.kind === 'fixed' && previous.fixedDefault !== current.fixedDefault && config.fixed.defaultValue) {
    range = normalizeFixed(config.fixed.defaultValue, config)
  }

  let timezone = value.timezone ?? current.timezone
  if (previous.timezone !== current.timezone && (value.timezone == null || value.timezone === previous.timezone)) {
    timezone = current.timezone
  }

  if (JSON.stringify(range) === JSON.stringify(value.range) && timezone === (value.timezone ?? previous.timezone)) {
    return undefined
  }
  return resolveDateRangeV2({ range, timezone })
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
  availability === 'past' ? ['so_far'] : availability === 'future' ? ['from_now'] : ['full', 'so_far', 'from_now']

const CALENDAR_POSITIONS: CalendarRange['position'][] = ['previous', 'this', 'next']
const RELATIVE_DIRECTIONS: RelativeRange['direction'][] = ['last', 'next']

const legalPositions = (availability: DateRangeAvailability): CalendarRange['position'][] =>
  CALENDAR_POSITIONS.filter(position =>
    availability === 'past' ? position !== 'next' : availability === 'future' ? position !== 'previous' : true
  )

const legalDirections = (availability: DateRangeAvailability): RelativeRange['direction'][] =>
  RELATIVE_DIRECTIONS.filter(direction =>
    availability === 'past' ? direction === 'last' : availability === 'future' ? direction === 'next' : true
  )

/** Calendar day clicks are local dates. Drafts store civil dates in the selected timezone. */
const pad = (value: number) => String(value).padStart(2, '0')

const localToCivilDate = (value: Date): CivilDate =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` as CivilDate

const civilDateToLocal = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const DAY_START = '00:00:00'
const DAY_END = '23:59:59'

const withClock = (value: string, clock: string): CivilDateTime => `${value.slice(0, 10)}T${clock}` as CivilDateTime

const normalizeFixed = (range: FixedRange, config: NormalizedDateRangeV2Config): FixedRange => {
  let from = range.from
  let to = range.to
  const fromMs = zonedCivilDateTimeToUtc(from).getTime()
  const toMs = zonedCivilDateTimeToUtc(to).getTime()
  if (Number.isFinite(fromMs) && Number.isFinite(toMs) && fromMs > toMs) {
    const swap = from
    from = to
    to = swap
  }
  if (!config.fixed.allowTime) {
    from = withClock(from, DAY_START)
    to = withClock(to, DAY_END)
  }
  return { kind: 'fixed', from, to }
}

/** A fixed draft may have no dates yet. Apply stays off until both ends exist. */
interface FixedDraft {
  kind: 'fixed'
  from?: CivilDateTime
  to?: CivilDateTime
}

const defaultFixed = (config: NormalizedDateRangeV2Config): FixedDraft => {
  if (config.fixed.defaultValue) return normalizeFixed(config.fixed.defaultValue, config)
  return { kind: 'fixed' }
}

const completeFixed = (draft: FixedDraft, config: NormalizedDateRangeV2Config): FixedRange | undefined => {
  if (!isCivilDateTime(draft.from) || !isCivilDateTime(draft.to)) return undefined
  return normalizeFixed({ kind: 'fixed', from: draft.from, to: draft.to }, config)
}

/** One draft per mode. The inactive ones stay in state while another tab is open. */
interface Drafts {
  preset: PresetRange
  relative: RelativeRange
  calendar: CalendarRange
  fixed: FixedDraft
}

const sameRange = (left?: DateRangeV2Value['range'], right?: DateRangeV2Value['range']) =>
  JSON.stringify(left) === JSON.stringify(right)

const visibleExtents = (config: NormalizedDateRangeV2Config): CalendarExtent[] => {
  const allowed = legalExtents(config.direction).filter(extent => config.calendar.extents.includes(extent))
  return allowed.length > 0 ? allowed : legalExtents(config.direction)
}

const preferredPosition = (config: NormalizedDateRangeV2Config): CalendarRange['position'] => {
  const positions = legalPositions(config.direction)
  const preferred = config.calendar.defaultValue.position
  if (positions.includes(preferred)) return preferred
  return positions.includes('this') ? 'this' : positions[0]
}

const preferredExtent = (config: NormalizedDateRangeV2Config): CalendarExtent => {
  const extents = visibleExtents(config)
  const preferred = config.calendar.defaultValue.position === 'this' ? config.calendar.defaultValue.extent : extents[0]
  return extents.includes(preferred) ? preferred : extents[0]
}

const defaultRelative = (config: NormalizedDateRangeV2Config): RelativeRange =>
  coerceRelative(config.relative.defaultValue, config)

const defaultCalendar = (config: NormalizedDateRangeV2Config): CalendarRange => {
  const value = config.calendar.defaultValue
  const position = preferredPosition(config)
  const unit = config.calendar.units.includes(value.unit) ? value.unit : config.calendar.units[0]
  if (position === 'this') {
    return { kind: 'calendar', position, unit, extent: preferredExtent(config) }
  }
  return {
    kind: 'calendar',
    position,
    unit,
    amount: clampAmount(calendarDefaultAmount(value), config.calendar.maxAmount)
  }
}

/** Pull a stored range back inside the current direction, units, and max amount. */
const coerceRelative = (range: RelativeRange, config: NormalizedDateRangeV2Config): RelativeRange => {
  const directions = legalDirections(config.direction)
  return {
    ...range,
    direction: directions.includes(range.direction) ? range.direction : directions[0],
    unit: config.relative.units.includes(range.unit) ? range.unit : config.relative.defaultValue.unit,
    amount: clampAmount(range.amount, config.relative.maxAmount)
  }
}

const coerceCalendar = (range: CalendarRange, config: NormalizedDateRangeV2Config): CalendarRange => {
  const unit = config.calendar.units.includes(range.unit) ? range.unit : config.calendar.defaultValue.unit
  const positions = legalPositions(config.direction)
  const position = positions.includes(range.position) ? range.position : positions[0]
  if (position === 'this') {
    const extents = visibleExtents(config)
    const extent = range.position === 'this' && extents.includes(range.extent) ? range.extent : extents[0]
    return { kind: 'calendar', position, unit, extent }
  }
  const amount = range.position === 'this' ? calendarDefaultAmount(config.calendar.defaultValue) : range.amount
  return {
    kind: 'calendar',
    position,
    unit,
    amount: clampAmount(amount, config.calendar.maxAmount)
  }
}

const draftsFor = (value: DateRangeV2Value | undefined, config: NormalizedDateRangeV2Config): Drafts => {
  const range = value?.range
  return {
    preset: { kind: 'preset', preset: range?.kind === 'preset' ? range.preset : (config.presets[0]?.value ?? '') },
    relative: range?.kind === 'relative' ? coerceRelative(range, config) : defaultRelative(config),
    calendar: range?.kind === 'calendar' ? coerceCalendar(range, config) : defaultCalendar(config),
    fixed: range?.kind === 'fixed' ? range : defaultFixed(config)
  }
}

/** Named presets open the Presets tab. Anything else follows the stored range, falling back to the first allowed mode. */
const sectionFor = (value: DateRangeV2Value | undefined, config: NormalizedDateRangeV2Config): DateRangeV2Mode => {
  const range = value?.range
  if (range?.kind === 'preset' && config.presets.some(preset => preset.value === range.preset)) {
    return 'presets'
  }
  const preferred: DateRangeV2Mode =
    range?.kind === 'calendar' ? 'calendar' : range?.kind === 'fixed' ? 'fixed' : 'relative'
  const enabled = config.modes.map(tab => tab.mode)
  return enabled.includes(preferred) ? preferred : enabled[0]
}

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
  range: ResolvableDateRangeV2,
  availability: DateRangeAvailability,
  timezone?: TimeZoneId,
  now: Date = new Date()
): boolean => {
  if (availability === 'any') return true
  try {
    const resolved = resolveDateRangeV2At({ range, timezone }, now)
    const nowMs = now.getTime()
    return availability === 'past' ? resolved.to.getTime() <= nowMs : resolved.from.getTime() >= nowMs
  } catch {
    return false
  }
}

/** A stored range with resolved from and to. Presets use `resolvePresetBounds`. */
const resolveDateRangeV2Value = (
  range: DateRangeV2Value['range'] | undefined,
  timezone: TimeZoneId,
  presets: readonly DateRangeV2Preset[],
  now: Date = new Date()
): DateRangeV2Value | undefined => {
  if (!range) return undefined
  if (range.kind === 'preset') {
    const preset = presets.find(item => item.value === range.preset)
    if (!preset) return undefined
    const bounds = resolvePresetBounds(preset, timezone)
    return { from: bounds.from, to: bounds.to, range, timezone }
  }
  return resolveDateRangeV2({ range, timezone }, now)
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
  const normalizedConfig = normalizeDateRangeV2Config(config)
  const timezoneEnabled = normalizedConfig.timezone.enabled
  const browserZone = normalizedConfig.timezone.browserZone
  const timezoneOptionList = normalizedConfig.timezone.options
  const timezoneSelectOptions = useMemo(
    () => timezoneOptions(browserZone, timezoneOptionList),
    [browserZone, timezoneOptionList]
  )
  const initialTimezone = value?.timezone ?? normalizedConfig.timezone.defaultValue
  const locked = Boolean(disabled || readOnly)
  const fixedAllowed = normalizedConfig.modes.some(tab => tab.mode === 'fixed')

  const [draftTimezone, setDraftTimezone] = useState<TimeZoneId>(initialTimezone)
  const zone = resolveTimeZone(draftTimezone)
  const [section, setSection] = useState<DateRangeV2Mode>(() => sectionFor(value, normalizedConfig))
  const [drafts, setDrafts] = useState<Drafts>(() => draftsFor(value, normalizedConfig))
  const [month, setMonth] = useState<Date>(() => new Date())
  const tabRefs = useRef<Record<DateRangeV2Mode, HTMLButtonElement | null>>({
    presets: null,
    relative: null,
    calendar: null,
    fixed: null
  })
  const draftSync = useRef<{ range: string; timezone?: TimeZoneId; config?: DateRangeV2Config } | null>(null)
  const didFillBounds = useRef(false)
  // Replace drafts when the stored range, timezone, or config changes. Epochs alone do not.
  // The filter memoizes config so a parent re-render does not wipe an open edit.
  useEffect(() => {
    const rangeKey = JSON.stringify(value?.range ?? null)
    const timezone = value?.timezone
    const previous = draftSync.current
    if (previous && previous.range === rangeKey && previous.timezone === timezone && previous.config === config) {
      return
    }
    draftSync.current = { range: rangeKey, timezone, config }
    const nextTimezone = timezone ?? normalizedConfig.timezone.defaultValue
    setDraftTimezone(nextTimezone)
    setSection(sectionFor(value, normalizedConfig))
    setDrafts(draftsFor(value, normalizedConfig))
  }, [value, config, normalizedConfig])

  // Fill epochs once when the parent stored a range without them.
  useEffect(() => {
    if (didFillBounds.current || !value || (value.from && value.to)) return
    const timezone = value.timezone ?? normalizedConfig.timezone.defaultValue
    const next = resolveDateRangeV2Value(value.range, timezone, normalizedConfig.presets)
    if (!next) return
    didFillBounds.current = true
    onApply(next)
  }, [value, onApply, normalizedConfig])

  // Presets preview through the consumer's getRange. Other tabs preview their own draft.
  const selectedPreset =
    section === 'presets' ? normalizedConfig.presets.find(preset => preset.value === drafts.preset.preset) : undefined
  const selectedPresetBounds = selectedPreset?.getRange({ timezone: draftTimezone })
  const presetRange = selectedPresetBounds
    ? fixedRangeFromDates(selectedPresetBounds.from, selectedPresetBounds.to, draftTimezone)
    : undefined
  const fixedRange = completeFixed(drafts.fixed, normalizedConfig)
  const activeRange: ResolvableDateRangeV2 | undefined =
    presetRange ?? (section === 'calendar' ? drafts.calendar : section === 'fixed' ? fixedRange : drafts.relative)
  const appliedTimezone = value?.timezone ?? normalizedConfig.timezone.defaultValue
  const draftRange = section === 'presets' ? drafts.preset : section === 'fixed' ? fixedRange : drafts[section]
  // Opening the picker must not move an applied window. Recompute from now only after the draft changes.
  const showingApplied = Boolean(value && appliedTimezone === draftTimezone && sameRange(draftRange, value.range))
  const storedBounds: readonly [number, number] | undefined =
    showingApplied && value?.from && value.to ? [value.from.getTime(), value.to.getTime()] : undefined
  const activeRangeKey = !activeRange
    ? 'none'
    : activeRange.kind === 'relative'
      ? `${activeRange.direction}:${activeRange.amount}:${activeRange.unit}`
      : activeRange.kind === 'calendar'
        ? activeRange.position === 'this'
          ? `${activeRange.position}:${activeRange.unit}:${activeRange.extent}`
          : `${activeRange.position}:${activeRange.unit}:${activeRange.amount}`
        : `${activeRange.from}/${activeRange.to}`

  const resolved = useMemo(() => {
    if (storedBounds) return storedBounds
    if (!activeRange) return undefined
    try {
      const next = resolveDateRangeV2At({ range: activeRange, timezone: draftTimezone }, new Date())
      return [next.from.getTime(), next.to.getTime()] as const
    } catch {
      return undefined
    }
  }, [storedBounds, activeRange, draftTimezone])

  const partialStart =
    section === 'fixed' && drafts.fixed.from && isCivilDateTime(drafts.fixed.from)
      ? formatFixedStartLabel(drafts.fixed.from, draftTimezone, normalizedConfig.triggerLabel)
      : ''
  const label =
    section === 'presets' && selectedPreset && resolved
      ? formatDateRangeV2ValueLabel(
          { range: { kind: 'preset', preset: selectedPreset.value }, timezone: draftTimezone },
          { presets: normalizedConfig.presets, label: normalizedConfig.triggerLabel, bounds: resolved }
        )
      : activeRange
        ? formatDateRangeV2Label(activeRange, draftTimezone, new Date(), normalizedConfig.triggerLabel, storedBounds)
        : { title: 'Fixed range', rangeText: partialStart, triggerText: '' }
  const allowed =
    section === 'presets' && selectedPresetBounds
      ? allowsPresetBounds(selectedPresetBounds, normalizedConfig.direction)
      : activeRange
        ? isAllowedDateRangeV2(activeRange, normalizedConfig.direction, draftTimezone)
        : false
  const canApply = Boolean(resolved) && allowed && (section !== 'presets' || Boolean(selectedPreset))

  const selected: DateRange | undefined =
    section === 'fixed' && drafts.fixed.from && !drafts.fixed.to
      ? { from: civilDateToLocal(drafts.fixed.from.slice(0, 10)), to: undefined }
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
  const disabledDays: Matcher | undefined = !allowsFuture(normalizedConfig.direction)
    ? { after: today }
    : !allowsPast(normalizedConfig.direction)
      ? { before: today }
      : undefined

  const setRelative = (patch: Partial<RelativeRange>) =>
    setDrafts(prev => ({ ...prev, relative: coerceRelative({ ...prev.relative, ...patch }, normalizedConfig) }))

  const setCalendar = (
    position: CalendarRange['position'],
    unit: CalendarUnit,
    extent?: CalendarExtent,
    amount?: number
  ) => {
    setDrafts(prev => {
      const currentAmount =
        prev.calendar.position === 'this'
          ? calendarDefaultAmount(normalizedConfig.calendar.defaultValue)
          : prev.calendar.amount
      const next: CalendarRange =
        position === 'this'
          ? {
              kind: 'calendar',
              position,
              unit,
              extent:
                extent ?? (prev.calendar.position === 'this' ? prev.calendar.extent : preferredExtent(normalizedConfig))
            }
          : {
              kind: 'calendar',
              position,
              unit,
              amount: clampAmount(amount ?? currentAmount, normalizedConfig.calendar.maxAmount)
            }
      return { ...prev, calendar: coerceCalendar(next, normalizedConfig) }
    })
  }

  const setFixed = (fixed: FixedDraft) => setDrafts(prev => ({ ...prev, fixed }))

  const updateFixedEndpoint = (endpoint: 'from' | 'to', value: CivilDateTime) => {
    const next: FixedDraft = { ...drafts.fixed, [endpoint]: value }
    if (next.from && next.to && next.from > next.to) {
      const swap = next.from
      next.from = next.to
      next.to = swap
    }
    setFixed(next)
  }

  /** An arrow that would reverse the range moves both ends, so a typed edit is the only swap. */
  const stepFixedEndpoint = (endpoint: 'from' | 'to', hours: number) => {
    const current = drafts.fixed[endpoint]
    if (!current) return
    const stepped = shiftCivilDateTimeHours(current, hours)
    const { from, to } = drafts.fixed
    if (from && to && ((endpoint === 'from' && stepped > to) || (endpoint === 'to' && stepped < from))) {
      setFixed({
        kind: 'fixed',
        from: shiftCivilDateTimeHours(from, hours),
        to: shiftCivilDateTimeHours(to, hours)
      })
      return
    }
    setFixed({ ...drafts.fixed, [endpoint]: stepped })
  }

  const handleDayClick = (day: Date) => {
    if (locked || !fixedAllowed) return
    if (section !== 'fixed') setSection('fixed')
    const clicked = localToCivilDate(day)
    const start = drafts.fixed.from
    const startDate = start?.slice(0, 10)
    if (!start || drafts.fixed.to) {
      setFixed({ kind: 'fixed', from: withClock(clicked, DAY_START) })
      return
    }
    if (startDate && clicked < startDate) {
      setFixed({ kind: 'fixed', from: withClock(clicked, DAY_START), to: withClock(startDate, DAY_END) })
      return
    }
    setFixed({ kind: 'fixed', from: start, to: withClock(clicked, DAY_END) })
  }

  const moveTabFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const index = normalizedConfig.modes.findIndex(tab => tab.mode === section)
    const next =
      normalizedConfig.modes[
        (index + (event.key === 'ArrowDown' ? 1 : -1) + normalizedConfig.modes.length) % normalizedConfig.modes.length
      ]
    setSection(next.mode)
    tabRefs.current[next.mode]?.focus()
  }

  const calendarDraft = drafts.calendar
  const extents = visibleExtents(normalizedConfig)
  const positions = legalPositions(normalizedConfig.direction)
  const directions = legalDirections(normalizedConfig.direction)
  const currentExtent = calendarDraft.position === 'this' ? calendarDraft.extent : undefined
  const relativeUnits = RELATIVE_UNITS.filter(option => normalizedConfig.relative.units.includes(option.value))
  const calendarUnits = CALENDAR_UNITS.filter(option => normalizedConfig.calendar.units.includes(option.value))
  const applyRange: ResolvableDateRangeV2 | undefined = section === 'fixed' ? fixedRange : activeRange
  const singleMode = normalizedConfig.modes.length === 1
  const controlsJustify = singleMode ? 'center' : 'start'

  return (
    <div
      className={cn(
        'max-w-[calc(100vw-2rem)] overflow-hidden rounded-cn-4 bg-cn-1',
        // One mode hides the tab column, so the panel loses that 240px.
        singleMode && 'w-[520px]',
        className
      )}
    >
      <Layout.Vertical gap="3xs" className="border-b border-cn-2 px-cn-md py-cn-sm">
        <Text variant="body-strong">{label.title}</Text>
        <Text variant="caption-normal">{label.rangeText || 'Select a range'}</Text>
      </Layout.Vertical>

      <Layout.Horizontal gap="none" align="stretch">
        {/* Tabs are hidden when only one mode is enabled. */}
        {!singleMode && (
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Date range type"
            className="min-h-0 w-60 shrink-0 overflow-y-auto border-r border-cn-2"
          >
            {normalizedConfig.modes.map(tab => {
              const copy = SECTIONS[tab.mode]
              const active = tab.mode === section
              return (
                <button
                  key={tab.mode}
                  ref={node => {
                    tabRefs.current[tab.mode] = node
                  }}
                  type="button"
                  role="tab"
                  id={`date-range-v2-tab-${tab.mode}`}
                  aria-selected={active}
                  aria-controls={`date-range-v2-panel-${tab.mode}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSection(tab.mode)}
                  onKeyDown={moveTabFocus}
                  className={cn(
                    'block w-full border-r-2 px-cn-md py-cn-sm text-left',
                    active ? 'border-cn-brand bg-cn-brand-secondary-selected' : 'border-transparent hover:bg-cn-hover'
                  )}
                >
                  <Text
                    variant={active ? 'body-strong' : 'body-normal'}
                    color={active ? 'brand' : 'foreground-1'}
                    className="block"
                  >
                    {tab.label}
                  </Text>
                  {normalizedConfig.tabDetails.includes('description') && (
                    <Text variant="caption-normal" color="foreground-2" className="block">
                      {copy.description}
                    </Text>
                  )}
                  {normalizedConfig.tabDetails.includes('example') && (
                    <Text variant="caption-normal" color="foreground-3" className="mt-cn-3xs block">
                      {copy.example}
                    </Text>
                  )}
                  {active && normalizedConfig.tabDetails.includes('note') && copy.note && (
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
          <div className="p-cn-md">
            {section === 'presets' && (
              <Layout.Horizontal align="end" gap="xs" wrap="wrap" justify={controlsJustify}>
                <Select
                  aria-label="Preset"
                  options={presetSelectOptions(normalizedConfig.presets)}
                  value={drafts.preset.preset}
                  disabled={locked}
                  onChange={preset => setDrafts(current => ({ ...current, preset: { kind: 'preset', preset } }))}
                  size="sm"
                  wrapperClassName="w-64"
                  contentWidth="triggerWidth"
                />
              </Layout.Horizontal>
            )}
            {section === 'relative' && (
              <Layout.Horizontal align="end" gap="xs" wrap="wrap" justify={controlsJustify}>
                <ToggleGroup.Root
                  type="single"
                  aria-label="Relative direction"
                  size="sm"
                  variant="ghost"
                  selectedVariant="primary"
                  disabled={locked}
                  unselectable
                  value={drafts.relative.direction}
                  onChange={(direction: string) => {
                    if (direction === 'last' || direction === 'next') setRelative({ direction })
                  }}
                >
                  {RELATIVE_DIRECTIONS.map(direction => (
                    <ToggleGroup.Item
                      key={direction}
                      value={direction}
                      text={direction === 'last' ? 'Last' : 'Next'}
                      disabled={!directions.includes(direction)}
                    />
                  ))}
                </ToggleGroup.Root>
                {normalizedConfig.relative.allowAmount && (
                  <PositiveAmountInput
                    aria-label="Relative amount"
                    value={drafts.relative.amount}
                    disabled={locked}
                    onChange={amount => setRelative({ amount })}
                  />
                )}
                <Select
                  aria-label="Relative unit"
                  options={relativeUnits}
                  value={drafts.relative.unit}
                  disabled={locked}
                  onChange={unit => setRelative({ unit })}
                  size="sm"
                  wrapperClassName="w-32"
                  contentWidth="triggerWidth"
                />
              </Layout.Horizontal>
            )}

            {section === 'calendar' && (
              <Layout.Horizontal align="end" gap="xs" wrap="wrap" justify={controlsJustify}>
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
                    if (position === 'previous' || position === 'this' || position === 'next') {
                      setCalendar(position, calendarDraft.unit, currentExtent)
                    }
                  }}
                >
                  {CALENDAR_POSITIONS.map(position => (
                    <ToggleGroup.Item
                      key={position}
                      value={position}
                      text={position === 'previous' ? 'Previous' : position === 'this' ? 'This' : 'Next'}
                      disabled={!positions.includes(position)}
                    />
                  ))}
                </ToggleGroup.Root>
                {calendarDraft.position !== 'this' && normalizedConfig.calendar.allowAmount && (
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
                  wrapperClassName="w-28"
                  contentWidth="triggerWidth"
                />
                {calendarDraft.position === 'this' && extents.length > 1 && (
                  <Select
                    aria-label="Current period extent"
                    options={extents.map(extent => ({ value: extent, label: EXTENT_LABELS[extent] }))}
                    value={calendarDraft.extent}
                    disabled={locked}
                    onChange={extent => setCalendar('this', calendarDraft.unit, extent)}
                    size="sm"
                    wrapperClassName="w-32"
                    contentWidth="triggerWidth"
                  />
                )}
              </Layout.Horizontal>
            )}

            {section === 'fixed' && (
              <Layout.Grid columns="minmax(0, 1fr) auto minmax(0, 1fr)" align="end" gap="xs">
                <DateTimeEndpointField
                  label="Start"
                  value={drafts.fixed.from}
                  showTime={normalizedConfig.fixed.allowTime}
                  showSeconds={normalizedConfig.fixed.allowSeconds}
                  dateOnlyClock="00:00:00"
                  disabled={locked}
                  onChange={value => updateFixedEndpoint('from', value)}
                  onStep={hours => stepFixedEndpoint('from', hours)}
                />
                <span className="flex h-8 items-center" aria-hidden>
                  <IconV2 name="arrow-long-right" size="sm" />
                </span>
                <DateTimeEndpointField
                  label="End"
                  value={drafts.fixed.to}
                  showTime={normalizedConfig.fixed.allowTime}
                  showSeconds={normalizedConfig.fixed.allowSeconds}
                  dateOnlyClock="23:59:59"
                  disabled={locked}
                  onChange={value => updateFixedEndpoint('to', value)}
                  onStep={hours => stepFixedEndpoint('to', hours)}
                />
              </Layout.Grid>
            )}
          </div>

          <div className="px-cn-md">
            <Separator />
          </div>

          <div className="p-cn-md">
            <Layout.Horizontal justify={controlsJustify}>
              <Calendar
                aria-label="Date range calendar"
                {...normalizedConfig.calendarProps}
                numberOfMonths={normalizedConfig.calendarProps?.numberOfMonths ?? 2}
                className={cn('!p-0', normalizedConfig.calendarProps?.className)}
                weekStartsOn={1}
                mode="range"
                month={month}
                onMonthChange={setMonth}
                selected={selected}
                disabled={disabledDays}
                onDayClick={handleDayClick}
                showOutsideDays={normalizedConfig.calendarProps?.showOutsideDays ?? false}
              />
            </Layout.Horizontal>
          </div>
        </div>
      </Layout.Horizontal>

      <div className="flex items-center gap-cn-xs border-t border-cn-3 px-cn-md py-cn-sm">
        <div className="min-w-0 flex-1">
          {timezoneEnabled && (
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
          )}
        </div>
        <ButtonLayout horizontalAlign="end">
          {normalizedConfig.clearable && value && (
            <Button size="sm" variant="ghost" onClick={onClear} disabled={locked || !onClear}>
              Clear
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={locked || !canApply}
            onClick={() => {
              if (!applyRange) return
              const next =
                section === 'presets' && selectedPreset
                  ? resolveDateRangeV2Value(
                      { kind: 'preset', preset: selectedPreset.value },
                      draftTimezone,
                      normalizedConfig.presets
                    )
                  : resolveDateRangeV2({ range: applyRange, timezone: draftTimezone })
              if (next) onApply(next)
            }}
          >
            Apply
          </Button>
        </ButtonLayout>
      </div>
    </div>
  )
}

DateRangeV2Content.displayName = 'DateRangeV2Content'

/** Popover trigger. Reports a new value when config defaults or browserZone change. */
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
  const normalizedConfig = normalizeDateRangeV2Config(config)
  const timezone = value?.timezone ?? normalizedConfig.timezone.defaultValue
  const browserZoneRef = useRef(normalizedConfig.timezone.browserZone)
  const defaultsRef = useRef(configDefaults(normalizedConfig))
  const reportedBounds = useRef<string | undefined>(undefined)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  // A range without epochs is incomplete. Report the resolved value once, even while the popover is closed.
  useEffect(() => {
    if (!value?.range || (value.from && value.to)) return
    const timezone = value.timezone ?? normalizedConfig.timezone.defaultValue
    const key = `${JSON.stringify(value.range)}|${timezone}`
    if (reportedBounds.current === key) return
    const next = resolveDateRangeV2Value(value.range, timezone, normalizedConfig.presets)
    if (!next) return
    reportedBounds.current = key
    onValueChange(next)
  }, [value, normalizedConfig, onValueChange])

  // Push a new value when config defaults change, such as default amount or timezone.
  useEffect(() => {
    const previous = defaultsRef.current
    const next = configDefaults(normalizedConfig)
    defaultsRef.current = next
    if (!value || sameDefaults(previous, next)) return
    const aligned = applyConfigDefaults(value, normalizedConfig, previous)
    if (!aligned) return
    onValueChange(aligned)
  }, [config, normalizedConfig, value, onValueChange])

  // Rewrite LOCALE ↔ the browser IANA id only after browserZone changes, not on mount.
  useEffect(() => {
    const previous = browserZoneRef.current
    const browserZone = normalizedConfig.timezone.browserZone
    browserZoneRef.current = browserZone
    if (previous === browserZone || !normalizedConfig.timezone.enabled || !value?.timezone) return
    const nextTimezone = timezoneForBrowserZone(value.timezone, browserZone)
    if (nextTimezone === value.timezone) return
    const next = resolveDateRangeV2Value(value.range, nextTimezone, normalizedConfig.presets)
    if (next) onValueChange(next)
  }, [normalizedConfig, value, onValueChange])
  const open = openProp ?? uncontrolledOpen
  const setOpen = (next: boolean) => {
    onOpenChange?.(next)
    if (openProp === undefined) setUncontrolledOpen(next)
  }
  const triggerText = value?.range
    ? formatDateRangeV2ValueLabel(value, {
        presets: normalizedConfig.presets,
        label: normalizedConfig.triggerLabel
      }).triggerText || placeholder
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
            {normalizedConfig.triggerLabel.showTimezone && <TimezoneOffsetBadge displayTimezone={timezone} />}
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
              // A mount fill reports epochs for a range that did not have them. Leave the picker open.
              if (value?.from && value.to) setOpen(false)
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
