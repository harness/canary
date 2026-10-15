import type {
  CalendarExtent,
  CalendarUnit,
  DateRangeV2Config,
  DateRangeV2Direction,
  DateRangeV2LabelConfig,
  DateRangeV2Mode,
  DateRangeV2Preset,
  DateRangeV2Section,
  DateRangeV2TabDetail,
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
  defaultAmount: number
  defaultUnit: RollingUnit
  maxAmount?: number
}

export interface ResolvedCalendarMode {
  allowAmount: boolean
  units: CalendarUnit[]
  extents: CalendarExtent[]
  defaultAmount: number
  defaultUnit: CalendarUnit
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
  custom: {
    allowTime: boolean
  }
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

export const sectionForMode = (mode: DateRangeV2Mode): DateRangeV2Section => (mode === 'custom' ? 'fixed' : mode)

export const modeForSection = (section: DateRangeV2Section): DateRangeV2Mode =>
  section === 'fixed' ? 'custom' : section

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
  const withoutPresets = listed(modes, DEFAULT_MODES).filter(mode => mode !== 'presets')
  if (presets.length === 0) return withoutPresets.length > 0 ? withoutPresets : DEFAULT_MODES
  return ['presets', ...withoutPresets]
}

export const resolveDateRangeV2Config = (config?: DateRangeV2Config): ResolvedDateRangeV2Config => {
  const timezone = config?.timezone
  const presets = resolvePresets(config?.presets)
  const rollingUnits = listed(config?.modeConfig?.rolling?.units, DEFAULT_ROLLING_UNITS)
  const calendarUnits = listed(config?.modeConfig?.calendar?.units, DEFAULT_CALENDAR_UNITS)
  const rollingMax = config?.modeConfig?.rolling?.maxAmount
  const calendarMax = config?.modeConfig?.calendar?.maxAmount
  const rollingDefaultUnit = config?.modeConfig?.rolling?.defaultUnit ?? 'day'
  const calendarDefaultUnit = config?.modeConfig?.calendar?.defaultUnit ?? 'month'

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
      defaultAmount: positiveAmount(config?.modeConfig?.rolling?.defaultAmount, 7, rollingMax),
      defaultUnit:
        rollingDefaultUnit && rollingUnits.includes(rollingDefaultUnit) ? rollingDefaultUnit : rollingUnits[0],
      maxAmount: rollingMax
    },
    calendar: {
      allowAmount: config?.modeConfig?.calendar?.allowAmount ?? true,
      units: calendarUnits,
      extents: listed(config?.modeConfig?.calendar?.extents, DEFAULT_EXTENTS),
      defaultAmount: positiveAmount(config?.modeConfig?.calendar?.defaultAmount, 1, calendarMax),
      defaultUnit:
        calendarDefaultUnit && calendarUnits.includes(calendarDefaultUnit) ? calendarDefaultUnit : calendarUnits[0],
      maxAmount: calendarMax
    },
    custom: {
      allowTime: config?.modeConfig?.custom?.allowTime ?? true
    },
    label: {
      showTime: config?.label?.showTime ?? true,
      showTimezone: config?.label?.showTimezone ?? true
    },
    presets,
    calendarProps: config?.calendarProps
  }
}
