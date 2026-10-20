import type { CalendarProps } from '../calendar'

export const DATE_RANGE_V2_CODEC_VERSION = 2 as const

/** `LOCALE` is the only non-IANA value. The consumer resolves it from the browser. */
export type TimeZoneId = 'LOCALE' | (string & NonNullable<unknown>)

/** `locale-utc` lists Browser Time and UTC only. `all` lists every supported zone. */
export type TimeZoneOptionList = 'all' | 'locale-utc'

export type DateRangeV2Direction = 'past' | 'future' | 'any'

export type DateRangeAvailability = DateRangeV2Direction

export type DateRangeV2Mode = 'presets' | 'rolling' | 'calendar' | 'custom'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type RollingUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type CalendarUnit = 'day' | 'week' | 'month' | 'quarter' | 'year'

export type CalendarExtent = 'full' | 'to_date' | 'from_now'

/** Lines shown under a tab title. The title itself is always shown. */
export type DateRangeV2TabDetail = 'description' | 'example' | 'note'

/**
 * Same fields as the date range picker's presets, so an existing list can be reused.
 * `getRange` also receives the selected timezone. A preset that ignores the argument keeps its own dates.
 */
export interface DateRangeV2Preset {
  label: string
  value: string
  getRange: (context: { timezone: TimeZoneId }) => { from: Date; to: Date }
  group: 'recommended' | 'relative' | 'calendar'
}

/** A calendar date interpreted in the selected time zone. */
export type CivilDate = `${number}-${number}-${number}`

/** A wall-clock time at minute precision. */
export type CivilTime = `${number}:${number}`

export interface CivilDateTime {
  date: CivilDate
  time: CivilTime
}

export interface RollingRange {
  kind: 'rolling'
  direction: 'past' | 'future'
  amount: number
  unit: RollingUnit
}

export type CalendarRange =
  | {
      kind: 'calendar'
      position: 'previous' | 'next'
      /** Number of complete periods. `LAST_2_CALENDAR_MONTHS` is 2. */
      amount: number
      unit: CalendarUnit
    }
  | {
      kind: 'calendar'
      position: 'current'
      unit: CalendarUnit
      extent: CalendarExtent
    }

export interface FixedRange {
  kind: 'fixed'
  from: CivilDateTime
  to: CivilDateTime
}

export type DateRangeV2Range = RollingRange | CalendarRange | FixedRange

/** `kind` stays on the stored range. A mode config already says which range it is. */
type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never

export interface DateRangeV2State {
  version: 1
  range: DateRangeV2Range
}

export interface RollingModeConfig {
  /** Shows the amount field. Stored amounts are kept when this is false. */
  allowAmount?: boolean
  units?: readonly RollingUnit[]
  /**
   * Draft used before a rolling value is applied.
   * Omit this for Last 7 days.
   */
  defaultValue?: WithoutKind<RollingRange>
  maxAmount?: number
}

export interface CalendarModeConfig {
  /** Shows the amount field for previous and next periods. */
  allowAmount?: boolean
  units?: readonly CalendarUnit[]
  extents?: readonly CalendarExtent[]
  /**
   * Draft used before a calendar value is applied.
   * Previous and Next carry `amount`. This carries `extent`.
   * Omit this for This month, full period.
   */
  defaultValue?: WithoutKind<CalendarRange>
  maxAmount?: number
}

export interface CustomModeConfig {
  /** Shows the time inputs. Full days are stored when this is false. */
  allowTime?: boolean
  /**
   * Draft used before a fixed value is applied.
   * Omit this for today, from 00:00 to 23:59, in the selected time zone.
   */
  defaultValue?: WithoutKind<FixedRange>
}

/** Calendar props the picker does not own. Range selection stays under the picker's control. */
export type DateRangeV2CalendarProps = Omit<
  CalendarProps,
  'mode' | 'selected' | 'onSelect' | 'onDayClick' | 'disabled' | 'month' | 'onMonthChange'
>

export interface DateRangeV2LabelConfig {
  /** Adds a clock time when either end is not the start or end of a day. Defaults to true. */
  showTime?: boolean
  /** Adds the timezone offset. Defaults to true. */
  showTimezone?: boolean
}

export interface DateRangeV2Config {
  /**
   * Tab visibility and order. Omit this for Rolling, Calendar, and Fixed.
   * A non-empty `presets` list also adds Presets in that default.
   */
  modes?: readonly DateRangeV2Mode[]
  /**
   * Lines inside each mode's info tooltip. Omit this to show description, example, and note.
   * An empty list leaves the title only.
   */
  tabDetails?: readonly DateRangeV2TabDetail[]
  /** Which side of now the user can select. Defaults to `any`. */
  direction?: DateRangeV2Direction
  /**
   * `false` hides the timezone row. An object shows it and can pin the browser option and the initial zone.
   * The initial zone defaults to UTC.
   */
  timezone?:
    | false
    | {
        browserZone?: 'dynamic' | 'explicit'
        defaultValue?: TimeZoneId
        /**
         * `locale-utc` lists Browser Time and UTC only, and hides search.
         * Omit or `all` lists every supported zone.
         */
        options?: TimeZoneOptionList
      }
  /** Shows the delete icon on the standalone picker. */
  clearable?: boolean
  /** Label options. Each flag defaults to true. */
  label?: DateRangeV2LabelConfig
  modeConfig?: {
    rolling?: RollingModeConfig
    calendar?: CalendarModeConfig
    custom?: CustomModeConfig
  }
  /** Calendar options the picker does not own. `weekStartsOn` defaults to Monday. */
  calendarProps?: DateRangeV2CalendarProps
  /**
   * Preset options. With `modes` omitted, a non-empty list adds a Presets tab.
   * `modes` that includes `presets` without this list shows an empty preset select.
   * `modes` that leaves out `presets` hides the tab.
   * Each preset matches the date range picker: `label`, `value`, `getRange`, and `group`.
   * `getRange` receives `{ timezone }`.
   */
  presets?: readonly DateRangeV2Preset[]
}

export interface DateRangeV2Props {
  value?: DateRangeV2Value
  onValueChange: (value: DateRangeV2Value | undefined) => void
  config?: DateRangeV2Config
  disabled?: boolean
  readOnly?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
  contentClassName?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/** Persisted filter value. A recognized preset rebuilds `from` and `to` on refresh. */
export interface DateRangeV2Value {
  from: Date
  to: Date
  /**
   * `LAST_7_DAYS` and `NEXT_2_WEEKS` are rolling.
   * `LAST_2_CALENDAR_MONTHS` and `THIS_MONTH_TO_DATE` are calendar periods.
   * `CUSTOM` keeps the stored bounds.
   */
  preset?: string
  timezone?: TimeZoneId
}

export type DateRangeV2FilterValue = DateRangeV2Value
