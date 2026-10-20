import type {
  CalendarExtent,
  CalendarModeConfig,
  CalendarRange,
  CalendarUnit,
  CustomModeConfig,
  DateRangeV2Config,
  DateRangeV2Direction,
  DateRangeV2LabelConfig,
  DateRangeV2Mode,
  DateRangeV2Preset,
  DateRangeV2TabDetail,
  FixedRange,
  RollingModeConfig,
  RollingRange,
  RollingUnit,
  TimeZoneId,
  TimeZoneOptionList,
  Weekday
} from './types'

const DEFAULT_MODES: DateRangeV2Mode[] = ['rolling', 'calendar', 'custom']
const DEFAULT_TAB_DETAILS: DateRangeV2TabDetail[] = ['description', 'example', 'note']
const DEFAULT_ROLLING_UNITS: RollingUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']
const DEFAULT_CALENDAR_UNITS: CalendarUnit[] = ['day', 'week', 'month', 'quarter', 'year']
const DEFAULT_EXTENTS: CalendarExtent[] = ['full', 'to_date', 'from_now']
const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'

export interface ResolvedRollingMode {
  allowAmount: boolean
  units: RollingUnit[]
  defaultValue: RollingRange
  maxAmount?: number
}

export interface ResolvedCustomMode {
  allowTime: boolean
  defaultValue?: FixedRange
}

export interface ResolvedCalendarMode {
  allowAmount: boolean
  units: CalendarUnit[]
  extents: CalendarExtent[]
  defaultValue: CalendarRange
  maxAmount?: number
}

export interface ResolvedDateRangeV2Config {
  modes: DateRangeV2Mode[]
  tabDetails: DateRangeV2TabDetail[]
  direction: DateRangeV2Direction
  weekStartsOn: Weekday
  clearable: boolean
  timezone: {
    enabled: boolean
    browserZone: 'dynamic' | 'explicit'
    defaultValue: TimeZoneId
    options: TimeZoneOptionList
  }
  rolling: ResolvedRollingMode
  calendar: ResolvedCalendarMode
  custom: ResolvedCustomMode
  label: Required<DateRangeV2LabelConfig>
  presets: DateRangeV2Preset[]
  calendarProps: DateRangeV2Config['calendarProps']
}

const listed = <T extends string>(values: readonly T[] | undefined, fallback: T[]): T[] =>
  values && values.length > 0 ? [...values] : fallback

const positiveAmount = (amount: number | undefined, fallback: number, maxAmount?: number): number => {
  const next = amount !== undefined && Number.isInteger(amount) && amount >= 1 ? amount : fallback
  return maxAmount !== undefined ? Math.min(next, maxAmount) : next
}

export const clampAmount = (amount: number, maxAmount?: number): number => {
  const next = Number.isInteger(amount) && amount >= 1 ? amount : 1
  return maxAmount !== undefined ? Math.min(next, maxAmount) : next
}

const PRESET_GROUPS = new Set<DateRangeV2Preset['group']>(['recommended', 'relative', 'calendar'])

const resolvePresets = (presets: readonly DateRangeV2Preset[] | undefined): DateRangeV2Preset[] =>
  (presets ?? []).filter(
    preset =>
      preset.label.trim() &&
      preset.value.trim() &&
      typeof preset.getRange === 'function' &&
      PRESET_GROUPS.has(preset.group)
  )

const resolveTabDetails = (details: readonly DateRangeV2TabDetail[] | undefined): DateRangeV2TabDetail[] => {
  if (!details) return DEFAULT_TAB_DETAILS
  return DEFAULT_TAB_DETAILS.filter(detail => details.includes(detail))
}

const resolveModes = (
  modes: readonly DateRangeV2Mode[] | undefined,
  presets: DateRangeV2Preset[]
): DateRangeV2Mode[] => {
  if (modes && modes.length > 0) return [...modes]
  return presets.length > 0 ? ['presets', ...DEFAULT_MODES] : [...DEFAULT_MODES]
}

const CIVIL_DATE = /^\d{4}-\d{2}-\d{2}$/
const CIVIL_TIME = /^([01]\d|2[0-3]):[0-5]\d$/

const resolveRollingDefault = (
  requested: RollingModeConfig['defaultValue'],
  units: RollingUnit[],
  maxAmount?: number
): RollingRange => {
  const fallbackUnit = units.includes('day') ? 'day' : units[0]
  return {
    kind: 'rolling',
    direction: requested?.direction === 'future' ? 'future' : 'past',
    unit: requested && units.includes(requested.unit) ? requested.unit : fallbackUnit,
    amount: positiveAmount(requested?.amount, requested ? 1 : 7, maxAmount)
  }
}

const resolveFixedDefault = (requested: CustomModeConfig['defaultValue']): FixedRange | undefined => {
  if (!requested) return undefined
  const { from, to } = requested
  if (
    !CIVIL_DATE.test(from.date) ||
    !CIVIL_DATE.test(to.date) ||
    !CIVIL_TIME.test(from.time) ||
    !CIVIL_TIME.test(to.time)
  ) {
    return undefined
  }
  return { kind: 'fixed', from, to }
}

const resolveCalendarDefault = (
  requested: CalendarModeConfig['defaultValue'],
  units: CalendarUnit[],
  extents: CalendarExtent[],
  maxAmount?: number
): CalendarRange => {
  const unit =
    requested && units.includes(requested.unit) ? requested.unit : units.includes('month') ? 'month' : units[0]
  if (!requested || requested.position === 'current') {
    const extent =
      requested?.position === 'current' && extents.includes(requested.extent)
        ? requested.extent
        : extents.includes('full')
          ? 'full'
          : extents[0]
    return { kind: 'calendar', position: 'current', unit, extent }
  }
  return {
    kind: 'calendar',
    position: requested.position,
    unit,
    amount: positiveAmount(requested.amount, 1, maxAmount)
  }
}

export const resolveDateRangeV2Config = (config?: DateRangeV2Config): ResolvedDateRangeV2Config => {
  const timezone = config?.timezone
  const presets = resolvePresets(config?.presets)
  const rollingUnits = listed(config?.modeConfig?.rolling?.units, DEFAULT_ROLLING_UNITS)
  const calendarUnits = listed(config?.modeConfig?.calendar?.units, DEFAULT_CALENDAR_UNITS)
  const rollingMax = config?.modeConfig?.rolling?.maxAmount
  const calendarMax = config?.modeConfig?.calendar?.maxAmount
  const calendarExtents = listed(config?.modeConfig?.calendar?.extents, DEFAULT_EXTENTS)
  const calendarDefaultValue = resolveCalendarDefault(
    config?.modeConfig?.calendar?.defaultValue,
    calendarUnits,
    calendarExtents,
    calendarMax
  )

  return {
    modes: resolveModes(config?.modes, presets),
    tabDetails: resolveTabDetails(config?.tabDetails),
    direction: config?.direction ?? 'any',
    weekStartsOn: config?.calendarProps?.weekStartsOn ?? 1,
    clearable: config?.clearable ?? false,
    timezone: timezone
      ? {
          enabled: true,
          browserZone: timezone.browserZone ?? 'dynamic',
          defaultValue: timezone.defaultValue ?? DEFAULT_TIME_ZONE,
          options: timezone.options === 'locale-utc' ? 'locale-utc' : 'all'
        }
      : { enabled: false, browserZone: 'dynamic', defaultValue: DEFAULT_TIME_ZONE, options: 'all' },
    rolling: {
      allowAmount: config?.modeConfig?.rolling?.allowAmount ?? true,
      units: rollingUnits,
      defaultValue: resolveRollingDefault(config?.modeConfig?.rolling?.defaultValue, rollingUnits, rollingMax),
      maxAmount: rollingMax
    },
    calendar: {
      allowAmount: config?.modeConfig?.calendar?.allowAmount ?? true,
      units: calendarUnits,
      extents: calendarExtents,
      defaultValue: calendarDefaultValue,
      maxAmount: calendarMax
    },
    custom: {
      allowTime: config?.modeConfig?.custom?.allowTime ?? true,
      defaultValue: resolveFixedDefault(config?.modeConfig?.custom?.defaultValue)
    },
    label: {
      showTime: config?.label?.showTime ?? true,
      showTimezone: config?.label?.showTimezone ?? true
    },
    presets,
    calendarProps: config?.calendarProps
  }
}
