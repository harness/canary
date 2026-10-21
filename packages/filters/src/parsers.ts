import {
  createDateRangeV2FilterParser,
  FilterFieldTypes,
  type CheckboxOptions,
  type ComboBoxOptions,
  type DateRangeV2Config,
  type DateRangeValue,
  type FilterOptionConfig,
  type MultiSelectCreationValueMode,
  type MultiSelectOption
} from '@harnessio/ui/components'

import { Parser } from './types'

export const defaultStringParser: Parser<unknown> = {
  parse: (value: string) => value,
  serialize: (value: unknown) => String(value)
}

export const booleanParser: Parser<boolean> = {
  parse: (value: string) => value === 'true',
  serialize: (value: boolean) => (value === true ? 'true' : value === false ? 'false' : '')
}

export const stringArrayParser: Parser<string[]> = {
  parse: (value: string) => {
    if (!value) {
      return []
    }
    return value.split(',').map(item => item.trim())
  },
  serialize: (value: string[]) => {
    if (!Array.isArray(value)) return ''
    return value.join(',')
  }
}

export const booleanArrayParser: Parser<boolean[]> = {
  parse: (value: string) => {
    if (!value) return [] // Return empty array if the string is empty
    return value.split(',').map(item => item.trim().toLowerCase() === 'true') // Convert each value to a boolean
  },
  serialize: (value: boolean[]) => {
    if (!Array.isArray(value)) return '' // Return empty string if the value is not an array
    return value.map(item => item.toString()).join(',') // Convert each boolean to a string and join with commas
  }
}

export const dateTimeParser: Parser<[Date, Date]> = {
  parse: (value: string) => {
    if (!value) {
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const end = new Date()
      end.setHours(23, 59, 59, 999)

      return [start, end]
    }

    const [startTime, endTime] = value.split(',').map(time => new Date(Number(time)))
    return [startTime, endTime]
  },

  serialize: (value: [Date, Date]) => {
    const [start, end] = value
    return `${start.getTime()},${end.getTime()}`
  }
}

const dateParser: Parser<Date> = {
  parse: value => new Date(Number(value)),
  serialize: value => {
    const time = new Date(value).getTime()
    return Number.isFinite(time) ? String(time) : ''
  }
}

const epoch = (date: Date): string | undefined => {
  const time = new Date(date).getTime()
  return Number.isFinite(time) ? String(time) : undefined
}

const dateRangeParser: Parser<DateRangeValue> = {
  parse: value => {
    const [fromToken, toToken, preset] = value.split(',')
    return {
      from: new Date(Number(fromToken)),
      to: new Date(Number(toToken)),
      ...(preset ? { preset } : {})
    }
  },
  serialize: value => {
    if (!value?.from || !value?.to) return ''
    const from = epoch(value.from)
    const to = epoch(value.to)
    if (!from || !to) return ''
    return value.preset ? `${from},${to},${value.preset}` : `${from},${to}`
  }
}

const customParser: Parser<unknown> = {
  parse: value => {
    if (!value) return value
    try {
      return JSON.parse(value) as unknown
    } catch {
      return value
    }
  },
  serialize: value => {
    if (typeof value === 'string') return value
    if (value == null) return ''
    try {
      return JSON.stringify(value) ?? ''
    } catch {
      return ''
    }
  }
}

const decodeToken = (token: string): string => {
  try {
    return decodeURIComponent(token)
  } catch {
    return token
  }
}

const parseList = (value: string): string[] => {
  if (!value) return []
  return value
    .split(',')
    .map(token => decodeToken(token.trim()))
    .filter(Boolean)
}

/** Keep commas inside one list entry. URLSearchParams decodes once, so the comma stays percent-encoded. */
const encodeListToken = (value: string): string =>
  value.includes(',') || value.includes('%') ? encodeURIComponent(value) : value

const joinList = (values: string[]): string => values.filter(Boolean).map(encodeListToken).join(',')

const comboBoxParser = (options: ComboBoxOptions[]): Parser<ComboBoxOptions | undefined> => ({
  parse: value => {
    if (!value) return undefined
    const selected = decodeToken(value)
    return options.find(option => option.value === selected) ?? { label: selected, value: selected }
  },
  serialize: value => value?.value ?? ''
})

const multiSelectParser = (options: CheckboxOptions[]): Parser<CheckboxOptions[]> => ({
  parse: value =>
    parseList(value).map(item => options.find(option => option.value === item) ?? { label: item, value: item }),
  serialize: value => (Array.isArray(value) ? joinList(value.map(item => item.value)) : '')
})

const tagId = (option: MultiSelectOption): string => {
  if (option.id !== undefined && option.id !== null && String(option.id) !== '') return String(option.id)
  return option.value ? `${option.key}:${option.value}` : option.key
}

const tagFromId = (id: string, mode: MultiSelectCreationValueMode): MultiSelectOption => {
  if (mode === 'literal') return { id, key: id }
  const separator = id.indexOf(':')
  if (separator === -1) return { id, key: id }
  return { id, key: id.slice(0, separator), value: id.slice(separator + 1) }
}

const multiTagParser = (
  options: MultiSelectOption[] = [],
  mode: MultiSelectCreationValueMode = 'keyValue'
): Parser<MultiSelectOption[]> => ({
  parse: value => parseList(value).map(id => options.find(option => String(option.id) === id) ?? tagFromId(id, mode)),
  serialize: value => (Array.isArray(value) ? joinList(value.map(tagId)) : '')
})

type AnyFilterOption = FilterOptionConfig<string, any>
type DefaultParserFactory = (option: AnyFilterOption) => Parser<any>

const dateRangeV2Presets = (config?: DateRangeV2Config) => {
  for (const mode of (config?.modes ?? []) as readonly unknown[]) {
    if (typeof mode !== 'object' || mode === null || !('mode' in mode) || mode.mode !== 'presets') continue
    return 'presets' in mode ? (mode.presets as Parameters<typeof createDateRangeV2FilterParser>[0]) : undefined
  }
  return undefined
}

const dateRangeV2Parser: DefaultParserFactory = option => {
  if (option.type !== FilterFieldTypes.DateRangeV2) return createDateRangeV2FilterParser()
  // Preset ids reload through getRange({ timezone }). weekStartsOn is used for calendar weeks.
  return createDateRangeV2FilterParser(
    dateRangeV2Presets(option.filterFieldConfig),
    option.filterFieldConfig?.calendarProps?.weekStartsOn
  )
}

/**
 * Default query parser for each field type.
 * FilterGroup uses this when a filter option omits `parser`.
 * A `parser` on the option replaces the default for every value that field can apply.
 */
export const defaultFilterParsers: Record<FilterFieldTypes, DefaultParserFactory> = {
  [FilterFieldTypes.Text]: () => defaultStringParser,
  [FilterFieldTypes.Checkbox]: () => booleanParser,
  [FilterFieldTypes.Calendar]: () => dateParser,
  [FilterFieldTypes.DateRange]: () => dateRangeParser,
  [FilterFieldTypes.ComboBox]: option =>
    comboBoxParser(option.type === FilterFieldTypes.ComboBox ? option.filterFieldConfig.options : []),
  [FilterFieldTypes.MultiSelect]: option =>
    multiSelectParser(option.type === FilterFieldTypes.MultiSelect ? (option.filterFieldConfig?.options ?? []) : []),
  [FilterFieldTypes.MultiTag]: option =>
    option.type === FilterFieldTypes.MultiTag
      ? multiTagParser(option.filterFieldConfig?.options, option.filterFieldConfig?.creationValueMode)
      : multiTagParser(),
  [FilterFieldTypes.Custom]: () => customParser,
  [FilterFieldTypes.DateRangeV2]: dateRangeV2Parser
}

export const getDefaultFilterParser = <Key extends string, Value>(
  option: FilterOptionConfig<Key, Value>
): Parser<any> => defaultFilterParsers[option.type]?.(option as AnyFilterOption) ?? defaultStringParser

/** Uses the option parser when one is set. Otherwise uses the field type default. */
export const resolveFilterParser = <Key extends string, Value>(option: FilterOptionConfig<Key, Value>): Parser<any> =>
  option.parser ?? getDefaultFilterParser(option)
