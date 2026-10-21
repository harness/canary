import type { CalendarProps } from '../calendar'

export const DATE_RANGE_V2_CODEC_VERSION = 2 as const

/** `LOCALE` is the only non-IANA value. The consumer resolves it from the browser. */
export type TimeZoneId = 'LOCALE' | (string & NonNullable<unknown>)

/** `locale-utc` lists Browser Time and UTC only. `all` lists every supported zone. */
export type TimeZoneOptionList = 'all' | 'locale-utc'

export type DateRangeV2Direction = 'past' | 'future' | 'any'

export type DateRangeAvailability = DateRangeV2Direction

export type DateRangeV2Mode = 'presets' | 'relative' | 'calendar' | 'fixed'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type RelativeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type CalendarUnit = 'day' | 'week' | 'month' | 'quarter' | 'year'

export type CalendarExtent = 'full' | 'so_far' | 'from_now'

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

export interface RelativeRange {
  kind: 'relative'
  direction: 'last' | 'next'
  amount: number
  unit: RelativeUnit
}

export type CalendarRange =
  | {
      kind: 'calendar'
      position: 'previous' | 'next'
      /** Number of complete periods. `PREVIOUS_2_CALENDAR_MONTHS` is 2. */
      amount: number
      unit: CalendarUnit
    }
  | {
      kind: 'calendar'
      position: 'this'
      unit: CalendarUnit
      extent: CalendarExtent
    }

export interface FixedRange {
  kind: 'fixed'
  from: CivilDateTime
  to: CivilDateTime
}

export type DateRangeV2Range = RelativeRange | CalendarRange | FixedRange

/** `kind` stays on the stored range. A mode config already says which range it is. */
type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never

export interface DateRangeV2State {
  version: 1
  range: DateRangeV2Range
}

export interface RelativeModeConfig {
  /** Shows the amount field. Stored amounts are kept when this is false. */
  allowAmount?: boolean
  units?: readonly RelativeUnit[]
  /**
   * Draft used before a relative value is applied.
   * Omit this for Last 7 days.
   */
  defaultValue?: WithoutKind<RelativeRange>
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

export interface FixedModeConfig {
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

/** A tab and its settings. Omit the extra fields to keep that mode's defaults. */
export type DateRangeV2ModeEntry =
  | { mode: 'presets'; label?: string; presets: readonly DateRangeV2Preset[] }
  | ({ mode: 'relative'; label?: string } & RelativeModeConfig)
  | ({ mode: 'calendar'; label?: string } & CalendarModeConfig)
  | ({ mode: 'fixed'; label?: string } & FixedModeConfig)

export interface DateRangeV2Config {
  /**
   * Tab visibility, order, and settings. Omit this for Relative, Calendar, and Fixed.
   * Each entry is `{ mode }` plus that mode's settings.
   * `label` replaces the tab title. `{ mode: 'presets', presets }` supplies that tab's options.
   * `{ mode: 'presets', presets: [] }` shows an empty preset select.
   */
  modes?: readonly DateRangeV2ModeEntry[]
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
  /** Trigger label options. Each flag defaults to true. */
  triggerLabel?: DateRangeV2LabelConfig
  /** Calendar options the picker does not own. `weekStartsOn` defaults to Monday. */
  calendarProps?: DateRangeV2CalendarProps
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
   * `LAST_7_DAYS` and `NEXT_2_WEEKS` are relative.
   * `PREVIOUS_2_CALENDAR_MONTHS`, `THIS_MONTH`, `THIS_MONTH_SO_FAR`, and `THIS_MONTH_FROM_NOW` are calendar periods.
   * `FIXED` keeps the stored bounds.
   */
  preset?: string
  timezone?: TimeZoneId
}

export type DateRangeV2FilterValue = DateRangeV2Value
