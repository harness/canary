import { isCivilDateTime } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarModeConfig,
  CalendarRange,
  CalendarUnit,
  DateRangeV2Config,
  DateRangeV2Direction,
  DateRangeV2LabelConfig,
  DateRangeV2Mode,
  DateRangeV2ModeEntry,
  DateRangeV2Preset,
  DateRangeV2TabDetail,
  FixedModeConfig,
  FixedRange,
  RelativeModeConfig,
  RelativeRange,
  RelativeUnit,
  TimeZoneId,
  TimeZoneOptionList
} from './types'

const DEFAULT_MODES: readonly DateRangeV2ModeEntry[] = [{ mode: 'relative' }, { mode: 'calendar' }, { mode: 'fixed' }]
const DEFAULT_TAB_DETAILS: DateRangeV2TabDetail[] = ['description', 'example', 'note']
const DEFAULT_RELATIVE_UNITS: RelativeUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']
const DEFAULT_CALENDAR_UNITS: CalendarUnit[] = ['day', 'week', 'month', 'quarter', 'year']
const DEFAULT_EXTENTS: CalendarExtent[] = ['full', 'so_far', 'from_now']
const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'

export interface NormalizedRelativeMode {
  allowAmount: boolean
  units: RelativeUnit[]
  defaultValue: RelativeRange
  maxAmount?: number
}

export interface NormalizedFixedMode {
  allowTime: boolean
  allowSeconds: boolean
  defaultValue?: FixedRange
}

export interface NormalizedCalendarMode {
  allowAmount: boolean
  units: CalendarUnit[]
  extents: CalendarExtent[]
  defaultValue: CalendarRange
  maxAmount?: number
}

export interface NormalizedDateRangeV2Mode {
  mode: DateRangeV2Mode
  /** Tab title. A blank `label` keeps the default title. */
  label: string
}

const DEFAULT_MODE_LABEL: Record<DateRangeV2Mode, string> = {
  presets: 'Presets',
  relative: 'Relative',
  calendar: 'Calendar periods',
  fixed: 'Fixed'
}

const isMode = (value: string): value is DateRangeV2Mode =>
  value === 'presets' || value === 'relative' || value === 'calendar' || value === 'fixed'

export interface NormalizedDateRangeV2Config {
  modes: NormalizedDateRangeV2Mode[]
  tabDetails: DateRangeV2TabDetail[]
  direction: DateRangeV2Direction
  clearable: boolean
  timezone: {
    enabled: boolean
    browserZone: 'dynamic' | 'explicit'
    defaultValue: TimeZoneId
    options: TimeZoneOptionList
  }
  relative: NormalizedRelativeMode
  calendar: NormalizedCalendarMode
  fixed: NormalizedFixedMode
  triggerLabel: Required<DateRangeV2LabelConfig>
  presets: DateRangeV2Preset[]
  calendarProps: DateRangeV2Config['calendarProps']
}

const listed = <T extends string>(values: readonly T[] | undefined, fallback: readonly T[]): T[] =>
  values && values.length > 0 ? [...values] : [...fallback]

/** A requested choice when it is allowed. Otherwise the built-in choice, or the first allowed one. */
const choice = <T extends string>(requested: T | undefined, allowed: readonly T[], preferred: T): T => {
  if (requested !== undefined && allowed.includes(requested)) return requested
  return allowed.includes(preferred) ? preferred : allowed[0]
}

const positiveAmount = (amount: number | undefined, maxAmount?: number): number => {
  const next = amount !== undefined && Number.isInteger(amount) && amount >= 1 ? amount : 1
  return maxAmount !== undefined ? Math.min(next, maxAmount) : next
}

export const clampAmount = (amount: number, maxAmount?: number): number => {
  const next = Number.isInteger(amount) && amount >= 1 ? amount : 1
  return maxAmount !== undefined ? Math.min(next, maxAmount) : next
}

const PRESET_GROUPS = new Set<DateRangeV2Preset['group']>(['recommended', 'relative', 'calendar'])

/** A preset needs a label, a value, a known group, and `getRange`. A blank value is omitted. The stored value is unchanged. */
export const normalizePresets = (presets: readonly DateRangeV2Preset[] | undefined): DateRangeV2Preset[] =>
  (presets ?? []).filter(
    preset =>
      preset.label.trim() &&
      preset.value.trim() &&
      typeof preset.getRange === 'function' &&
      PRESET_GROUPS.has(preset.group)
  )

const normalizeTabDetails = (details: readonly DateRangeV2TabDetail[] | undefined): DateRangeV2TabDetail[] =>
  DEFAULT_TAB_DETAILS.filter(detail => details?.includes(detail))

const modeOf = (entry: DateRangeV2ModeEntry): DateRangeV2Mode | undefined =>
  entry && isMode(entry.mode) ? entry.mode : undefined

const displayLabel = (entry: DateRangeV2ModeEntry, mode: DateRangeV2Mode): string => {
  const label = entry.label?.trim()
  return label || DEFAULT_MODE_LABEL[mode]
}

const normalizeModes = (
  modes: readonly DateRangeV2ModeEntry[] | undefined
): {
  tabs: NormalizedDateRangeV2Mode[]
  relative?: RelativeModeConfig
  calendar?: CalendarModeConfig
  fixed?: FixedModeConfig
  presets: DateRangeV2Preset[]
} => {
  const source: readonly DateRangeV2ModeEntry[] = modes && modes.length > 0 ? modes : DEFAULT_MODES
  const seen = new Set<DateRangeV2Mode>()
  const tabs: NormalizedDateRangeV2Mode[] = []
  let relative: RelativeModeConfig | undefined
  let calendar: CalendarModeConfig | undefined
  let fixed: FixedModeConfig | undefined
  let presets: readonly DateRangeV2Preset[] | undefined

  for (const entry of source) {
    const mode = modeOf(entry)
    if (!mode || seen.has(mode)) continue
    seen.add(mode)
    tabs.push({ mode, label: displayLabel(entry, mode) })
    if (entry.mode === 'relative') relative = entry
    else if (entry.mode === 'calendar') calendar = entry
    else if (entry.mode === 'fixed') fixed = entry
    else presets = entry.presets
  }

  if (tabs.length > 0) return { tabs, relative, calendar, fixed, presets: normalizePresets(presets) }
  return {
    tabs: DEFAULT_MODES.map(entry => ({ mode: entry.mode, label: DEFAULT_MODE_LABEL[entry.mode] })),
    presets: []
  }
}

/** Last 1 month. A requested direction, unit, or amount replaces that piece when it is allowed. */
const normalizeRelativeDefault = (
  requested: RelativeModeConfig['defaultValue'],
  units: RelativeUnit[],
  maxAmount?: number
): RelativeRange => ({
  kind: 'relative',
  direction: requested?.direction === 'next' ? 'next' : 'last',
  unit: choice(requested?.unit, units, 'month'),
  amount: positiveAmount(requested?.amount, maxAmount)
})

/** Previous 1 month. This uses the requested extent. Previous and next use the requested amount. */
const normalizeCalendarDefault = (
  requested: CalendarModeConfig['defaultValue'],
  units: CalendarUnit[],
  extents: CalendarExtent[],
  maxAmount?: number
): CalendarRange => {
  const unit = choice(requested?.unit, units, 'month')
  if (requested?.position === 'this') {
    return { kind: 'calendar', position: 'this', unit, extent: choice(requested.extent, extents, 'full') }
  }
  return {
    kind: 'calendar',
    position: requested?.position === 'next' ? 'next' : 'previous',
    unit,
    amount: positiveAmount(requested?.amount, maxAmount)
  }
}

const normalizeFixedDefault = (requested: FixedModeConfig['defaultValue']): FixedRange | undefined => {
  if (!requested) return undefined
  const { from, to } = requested
  if (!isCivilDateTime(from) || !isCivilDateTime(to)) return undefined
  return { kind: 'fixed', from, to }
}

export const normalizeDateRangeV2Config = (config?: DateRangeV2Config): NormalizedDateRangeV2Config => {
  const timezone = config?.timezone
  const selected = normalizeModes(config?.modes)
  const relativeUnits = listed(selected.relative?.units, DEFAULT_RELATIVE_UNITS)
  const calendarUnits = listed(selected.calendar?.units, DEFAULT_CALENDAR_UNITS)
  const relativeMax = selected.relative?.maxAmount
  const calendarMax = selected.calendar?.maxAmount
  const calendarExtents = listed(selected.calendar?.extents, DEFAULT_EXTENTS)
  const calendarDefaultValue = normalizeCalendarDefault(
    selected.calendar?.defaultValue,
    calendarUnits,
    calendarExtents,
    calendarMax
  )

  return {
    modes: selected.tabs,
    tabDetails: normalizeTabDetails(config?.tabDetails),
    direction: config?.direction ?? 'any',
    clearable: config?.clearable ?? false,
    timezone: timezone
      ? {
          enabled: true,
          browserZone: timezone.browserZone ?? 'dynamic',
          defaultValue: timezone.defaultValue ?? DEFAULT_TIME_ZONE,
          options: timezone.options === 'locale-utc' ? 'locale-utc' : 'all'
        }
      : { enabled: false, browserZone: 'dynamic', defaultValue: DEFAULT_TIME_ZONE, options: 'all' },
    relative: {
      allowAmount: selected.relative?.allowAmount ?? true,
      units: relativeUnits,
      defaultValue: normalizeRelativeDefault(selected.relative?.defaultValue, relativeUnits, relativeMax),
      maxAmount: relativeMax
    },
    calendar: {
      allowAmount: selected.calendar?.allowAmount ?? true,
      units: calendarUnits,
      extents: calendarExtents,
      defaultValue: calendarDefaultValue,
      maxAmount: calendarMax
    },
    fixed: {
      allowTime: selected.fixed?.allowTime ?? true,
      allowSeconds: selected.fixed?.allowSeconds ?? false,
      defaultValue: normalizeFixedDefault(selected.fixed?.defaultValue)
    },
    triggerLabel: {
      showTime: config?.triggerLabel?.showTime ?? true,
      showTimezone: config?.triggerLabel?.showTimezone ?? true
    },
    presets: selected.presets,
    calendarProps: config?.calendarProps
  }
}
