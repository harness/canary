import type { CalendarProps } from '../calendar'

/** `LOCALE` is the only non-IANA value. The consumer resolves it from the browser. */
export type TimeZoneId = 'LOCALE' | (string & NonNullable<unknown>)

/** `locale-utc` lists Browser Time and UTC only. `all` lists every supported zone. */
export type TimeZoneOptionList = 'all' | 'locale-utc'

export type DateRangeV2Direction = 'past' | 'future' | 'any'

export type DateRangeAvailability = DateRangeV2Direction

export type DateRangeV2Mode = 'presets' | 'relative' | 'calendar' | 'fixed'

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

/** ISO 8601 local datetime at second precision: `yyyy-MM-ddTHH:mm:ss`. No offset. */
export type CivilDateTime = `${number}-${number}-${number}T${number}:${number}:${number}`

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

/** A configured preset. Bounds come from that preset's `getRange`, not from `resolveDateRangeV2`. */
export interface PresetRange {
  kind: 'preset'
  preset: string
}

/** Every range a value can store. A preset is an id. The other kinds carry enough data to resolve epochs. */
export type DateRangeV2Range = RelativeRange | CalendarRange | FixedRange | PresetRange

/** Relative, calendar, and fixed. `resolveDateRangeV2` computes these without a preset list. */
export type ResolvableDateRangeV2 = Exclude<DateRangeV2Range, PresetRange>

/** `kind` stays on the stored range. A mode config already says which range it is. */
type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never

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
   * Omit this for Previous 1 month.
   */
  defaultValue?: WithoutKind<CalendarRange>
  maxAmount?: number
}

export interface FixedModeConfig {
  /** Shows the clock in each field. Full days are stored when this is false. */
  allowTime?: boolean
  /** Shows seconds in each field. Seconds are still stored when this is false. */
  allowSeconds?: boolean
  /**
   * Draft used before a fixed value is applied.
   * Each end is `yyyy-MM-ddTHH:mm:ss`. Omit this to leave the start and end empty.
   */
  defaultValue?: WithoutKind<FixedRange>
}

/** Calendar props the picker does not own. Range selection and the Monday week start stay under the picker's control. */
export type DateRangeV2CalendarProps = Omit<
  CalendarProps,
  'mode' | 'selected' | 'onSelect' | 'onDayClick' | 'disabled' | 'month' | 'onMonthChange' | 'weekStartsOn'
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
   * Lines under each tab title. Omit this, or pass an empty list, to leave the title only.
   * Include `description`, `example`, or `note` to show those lines.
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
  /** Calendar options the picker does not own. Weeks start on Monday. */
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

/**
 * Applied value. `range` is the source of truth.
 * `from` and `to` are the epochs for that range and timezone. Apply fills them, and a later Apply refreshes them.
 */
export interface DateRangeV2Value {
  from?: Date
  to?: Date
  range: DateRangeV2Range
  timezone?: TimeZoneId
}

export type DateRangeV2FilterValue = DateRangeV2Value
