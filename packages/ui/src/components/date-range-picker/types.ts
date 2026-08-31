import type { ReactElement } from 'react'
import type { ClassNames, DayPickerRangeProps } from 'react-day-picker'

export const DEFAULT_TIME_ZONE = 'UTC'
export const DATE_RANGE_CODEC_VERSION = 1 as const

/** An IANA time-zone identifier. Runtime inputs are validated before use. */
export type TimeZoneId = string

export type DateRangeKind = 'relative' | 'calendar' | 'absolute'
export type DateRangeDirection = 'past' | 'future'
export type DateRangeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type ThisPeriodExtent = 'full' | 'to_now'

export type CalendarPeriod =
  | 'this_week'
  | 'last_week'
  | 'next_week'
  | 'this_month'
  | 'last_month'
  | 'next_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'next_quarter'
  | 'this_year'
  | 'last_year'
  | 'next_year'

/** A calendar date interpreted in the selected time zone. */
export type CivilDate = `${number}-${number}-${number}`
/** A wall-clock time at minute precision. */
export type CivilTime = `${number}:${number}`

export interface CivilDateTime {
  date: CivilDate
  /** Omitted means the all-day boundary for this endpoint. */
  time?: CivilTime
}

export interface RelativeOffset {
  amount: number
  unit: DateRangeUnit
}

export interface DateRangeExclude {
  incompleteInterval?: boolean
  /** JavaScript weekday numbers: Sunday is 0 and Saturday is 6. */
  weekdays?: Weekday[]
}

/** Offset and exclusions cannot be represented simultaneously. */
export type RelativeAdjustment =
  | { type: 'offset'; offset: RelativeOffset }
  | { type: 'exclude'; exclude: DateRangeExclude }

interface DateRangeValueBase {
  timeZone: TimeZoneId
}

export interface PastRelativeDateRangeValue extends DateRangeValueBase {
  kind: 'relative'
  direction: 'past'
  amount: number
  unit: DateRangeUnit
  adjustment?: RelativeAdjustment
}

export interface FutureRelativeDateRangeValue extends DateRangeValueBase {
  kind: 'relative'
  direction: 'future'
  amount: number
  unit: DateRangeUnit
  adjustment?: Extract<RelativeAdjustment, { type: 'exclude' }>
}

export type RelativeDateRangeValue = PastRelativeDateRangeValue | FutureRelativeDateRangeValue

export interface CalendarDateRangeValue extends DateRangeValueBase {
  kind: 'calendar'
  period: CalendarPeriod
  /** Applies to this_* periods. Omitted means the complete named period. */
  extent?: ThisPeriodExtent
}

export interface AbsoluteDateRangeValue extends DateRangeValueBase {
  kind: 'absolute'
  from: CivilDateTime
  to: CivilDateTime
}

export type DateRangeValue = RelativeDateRangeValue | CalendarDateRangeValue | AbsoluteDateRangeValue

/** @deprecated Use a semantic DateRangeValue so ranges retain their intent and time zone. */
export interface LegacyDateRangeValue {
  from: Date | string | number
  to: Date | string | number
  preset?: string
}

export type DateRangeInput = DateRangeValue | LegacyDateRangeValue

export interface ResolvedDateRange {
  /** Inclusive UTC instant. */
  from: Date
  /** Exclusive UTC instant. */
  to: Date
  timeZone: TimeZoneId
  kind: DateRangeKind
  /** Weekday exclusions do not alter the bounding interval. */
  excludeWeekdays: Weekday[]
  source: DateRangeValue
}

export interface ResolveDateRangeOptions {
  now?: Date
  weekStartsOn?: Weekday
}

export interface DateRangePreset {
  id: string
  label: string
  group: 'recommended' | 'relative' | 'calendar'
  /** A live semantic value, never a snapshot resolved against now. */
  value: DateRangeValue
}

export interface DateRangeQuickPreset {
  id: string
  /** Compact label rendered in the toolbar, for example `7D`. */
  label: string
  /** Omit to restore the consumer's default range. */
  value?: DateRangeValue
  /**
   * Marks a duration preset that can run backward or forward. Presets flagged
   * here share the toolbar's Last/Next switch; every other preset keeps the
   * direction baked into its own value.
   */
  supportsDirection?: boolean
}

export interface FormatDateRangeLabelOptions extends ResolveDateRangeOptions {
  locale?: Intl.LocalesArgument
  includeResolvedRange?: boolean
  includeTimeZone?: boolean
}

export type DateRangePickerMode = 'presets' | 'rolling' | 'fixed'

export interface DateRangePickerTriggerContext {
  /** Compact semantic summary including resolved dates and time zone. */
  label: string
  timeZone: TimeZoneId
  open: boolean
  value?: DateRangeValue
}

export type InterpretDateRangeQuery = (query: string) => Promise<DateRangeValue>

export type DateRangePickerCalendarProps = Omit<
  DayPickerRangeProps,
  'classNames' | 'mode' | 'numberOfMonths' | 'onDayClick' | 'onSelect' | 'selected'
>

export interface DateRangePickerProps {
  value?: DateRangeInput
  onChange: (value?: DateRangeValue) => void
  /** Additional presets shown with the built-in presets. */
  presets?: DateRangePreset[]
  /** Compact presets rendered beside Custom. Omit to use the Platform defaults. */
  quickPresets?: DateRangeQuickPreset[]
  /** Set false to render the legacy single-button trigger. */
  showQuickPresetBar?: boolean
  allowFuture?: boolean
  /** @deprecated Fixed ranges always expose editable full-day time fields. */
  enableTimeSelection?: boolean
  enableOffset?: boolean
  enableExclusions?: boolean
  /** Time zone used when value is absent or does not specify a valid zone. */
  defaultTimeZone?: TimeZoneId
  weekStartsOn?: Weekday
  onInterpretQuery?: InterpretDateRangeQuery
  calendarProps?: DateRangePickerCalendarProps
  calendarClassNames?: ClassNames
  trigger?: ReactElement
  renderTrigger?: (context: DateRangePickerTriggerContext) => ReactElement
  placeholder?: string
  disabled?: boolean
  className?: string
  popoverClassName?: string
}

export interface DateRangePickerContentProps {
  value?: DateRangeInput
  onApply: (value: DateRangeValue) => void
  onCancel: () => void
  presets?: DateRangePreset[]
  allowFuture?: boolean
  /** @deprecated Fixed ranges always expose editable full-day time fields. */
  enableTimeSelection?: boolean
  enableOffset?: boolean
  enableExclusions?: boolean
  /** Set false to hide offset and exclusion controls from this editor. */
  showAdjustmentControls?: boolean
  /** Compact presets shown below the optional search bar. */
  quickPresets?: DateRangeQuickPreset[]
  defaultTimeZone?: TimeZoneId
  weekStartsOn?: Weekday
  onInterpretQuery?: InterpretDateRangeQuery
  calendarProps?: DateRangePickerCalendarProps
  calendarClassNames?: ClassNames
  /** @deprecated Prefer leaving fixed ranges enabled for consistent picker behavior. */
  showFixedRange?: boolean
  className?: string
}
