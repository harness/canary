// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'

import {
  createDateRangeV2FilterParser,
  FilterFieldTypes,
  type DateRangeV2Preset,
  type FilterOptionConfig,
  type MultiSelectOption,
  type Parser
} from '@harnessio/ui/components'

import { defaultFilterParsers, getDefaultFilterParser, resolveFilterParser } from './parsers'

const option = <Key extends string, Value>(config: FilterOptionConfig<Key, Value>) => config

const throughQuery = (
  parser: { parse: (value: string) => unknown; serialize: (value: any) => string },
  value: unknown
) => {
  const params = new URLSearchParams()
  params.set('value', parser.serialize(value))
  return parser.parse(params.get('value') ?? '')
}

describe('default filter parsers', () => {
  it('registers a parser for every field type', () => {
    expect(Object.keys(defaultFilterParsers).sort()).toEqual(Object.values(FilterFieldTypes).sort())
  })

  it('round-trips text, checkbox, calendar, and date range', () => {
    const text = getDefaultFilterParser(option({ type: FilterFieldTypes.Text, label: 'Name', value: 'name' }))
    expect(text.serialize('alpha')).toBe('alpha')
    expect(text.parse('alpha')).toBe('alpha')

    const checkbox = getDefaultFilterParser(
      option({ type: FilterFieldTypes.Checkbox, label: 'Pinned', value: 'pinned' })
    )
    expect(checkbox.serialize(true)).toBe('true')
    expect(checkbox.serialize(false)).toBe('false')
    expect(checkbox.parse('true')).toBe(true)
    expect(checkbox.parse('false')).toBe(false)

    const calendar = getDefaultFilterParser(
      option({ type: FilterFieldTypes.Calendar, label: 'Created', value: 'created' })
    )
    const day = new Date('2026-10-05T00:00:00.000Z')
    expect(calendar.serialize(day)).toBe(String(day.getTime()))
    expect(calendar.parse(String(day.getTime()))).toEqual(day)

    const dateRange = getDefaultFilterParser(
      option({ type: FilterFieldTypes.DateRange, label: 'Range', value: 'range' })
    )
    const range = { from: new Date(1_000), to: new Date(2_000), preset: 'LAST_7_DAYS' }
    expect(dateRange.serialize(range)).toBe('1000,2000,LAST_7_DAYS')
    expect(throughQuery(dateRange, range)).toEqual(range)
    expect(dateRange.parse('1000,2000')).toEqual({ from: new Date(1_000), to: new Date(2_000) })
  })

  it('round-trips combobox and multiselect from option values', () => {
    const combo = getDefaultFilterParser(
      option({
        type: FilterFieldTypes.ComboBox,
        label: 'Scope',
        value: 'scope',
        filterFieldConfig: {
          placeholder: 'Select',
          options: [
            { label: 'Account', value: 'account' },
            { label: 'Organization', value: 'org' }
          ]
        }
      })
    )
    expect(combo.serialize({ label: 'Account', value: 'account' })).toBe('account')
    expect(combo.parse('account')).toEqual({ label: 'Account', value: 'account' })
    expect(combo.parse('missing')).toEqual({ label: 'missing', value: 'missing' })

    const multi = getDefaultFilterParser(
      option({
        type: FilterFieldTypes.MultiSelect,
        label: 'Status',
        value: 'status',
        filterFieldConfig: {
          options: [
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' }
          ]
        }
      })
    )
    const selected = [
      { label: 'Open', value: 'open' },
      { label: 'Later', value: 'later' }
    ]
    expect(multi.serialize(selected)).toBe('open,later')
    expect(multi.parse('open,later')).toEqual([
      { label: 'Open', value: 'open' },
      { label: 'later', value: 'later' }
    ])
  })

  it('round-trips multitag key-value and literal tags', () => {
    const keyValue = getDefaultFilterParser(option({ type: FilterFieldTypes.MultiTag, label: 'Tags', value: 'tags' }))
    const tags: MultiSelectOption[] = [{ key: 'Tag', value: 'Test', id: 'Tag:Test' }]
    expect(keyValue.serialize(tags)).toBe('Tag:Test')
    expect(throughQuery(keyValue, tags)).toEqual(tags)
    expect(throughQuery(keyValue, [{ key: 'note', value: 'a,b', id: 'note:a,b' }])).toEqual([
      { key: 'note', value: 'a,b', id: 'note:a,b' }
    ])

    const literal = getDefaultFilterParser(
      option({
        type: FilterFieldTypes.MultiTag,
        label: 'Tags',
        value: 'tags',
        filterFieldConfig: { creationValueMode: 'literal' }
      })
    )
    const url = [{ key: 'https://example.com', id: 'https://example.com' }]
    expect(throughQuery(literal, url)).toEqual(url)
  })

  it('round-trips a custom object instead of [object Object]', () => {
    const custom = getDefaultFilterParser(
      option({
        type: FilterFieldTypes.Custom,
        label: 'Label',
        value: 'label',
        filterFieldConfig: { renderCustomComponent: () => null }
      })
    )
    const value = { id: 'bug', values: ['sev-1'] }
    expect(custom.serialize(value)).toBe(JSON.stringify(value))
    expect(custom.serialize(value)).not.toBe('[object Object]')
    expect(throughQuery(custom, value)).toEqual(value)
  })

  it('reloads DateRangeV2 presets, rolling, calendar, and fixed ranges from field config', () => {
    const now = new Date('2026-10-05T15:30:00.000Z')
    const billingFrom = new Date('2026-01-01T00:00:00.000Z')
    const billingTo = new Date('2026-01-31T00:00:00.000Z')
    const presets: DateRangeV2Preset[] = [
      {
        label: 'Billing cycle',
        value: 'Billing_Cycle',
        group: 'recommended',
        getRange: () => ({ from: billingFrom, to: billingTo })
      }
    ]
    const filter = option({
      type: FilterFieldTypes.DateRangeV2,
      label: 'Timeframe',
      value: 'timeframe',
      filterFieldConfig: { modes: [{ mode: 'presets', presets }], calendarProps: { weekStartsOn: 0 } }
    })
    const parser = getDefaultFilterParser(filter) as ReturnType<typeof createDateRangeV2FilterParser>
    const builtIn = createDateRangeV2FilterParser(presets, 0)

    expect(parser.serialize({ from: now, to: now, preset: 'billing_cycle', timezone: 'Asia/Kolkata' })).toBe(
      'Billing_Cycle|Asia/Kolkata'
    )
    expect(parser.parse('Billing_Cycle|Asia/Kolkata', now)).toEqual({
      from: billingFrom,
      to: billingTo,
      preset: 'Billing_Cycle',
      timezone: 'Asia/Kolkata'
    })
    expect(parser.parse('LAST_7_DAYS|UTC', now)).toEqual(builtIn.parse('LAST_7_DAYS|UTC', now))
    expect(parser.parse('PREVIOUS_1_CALENDAR_WEEK|UTC', now)?.from.toISOString()).toBe('2026-09-27T00:00:00.000Z')
    expect(parser.parse('FIXED|1788201000000|1788978600000|UTC', now)).toEqual(
      builtIn.parse('FIXED|1788201000000|1788978600000|UTC', now)
    )
  })

  it('lets a caller parser replace the default for every field type', () => {
    const custom: Parser<any> = { parse: (value: string) => value, serialize: () => 'custom' }
    const fields: FilterOptionConfig<string, any>[] = [
      { type: FilterFieldTypes.Text, label: 'Name', value: 'name', parser: custom },
      { type: FilterFieldTypes.Checkbox, label: 'Pinned', value: 'pinned', parser: custom },
      { type: FilterFieldTypes.Calendar, label: 'Created', value: 'created', parser: custom },
      { type: FilterFieldTypes.DateRange, label: 'Range', value: 'range', parser: custom },
      {
        type: FilterFieldTypes.ComboBox,
        label: 'Scope',
        value: 'scope',
        parser: custom,
        filterFieldConfig: { placeholder: 'Select', options: [] }
      },
      { type: FilterFieldTypes.MultiSelect, label: 'Status', value: 'status', parser: custom },
      { type: FilterFieldTypes.MultiTag, label: 'Tags', value: 'tags', parser: custom },
      {
        type: FilterFieldTypes.Custom,
        label: 'Label',
        value: 'label',
        parser: custom,
        filterFieldConfig: { renderCustomComponent: () => null }
      },
      {
        type: FilterFieldTypes.DateRangeV2,
        label: 'Timeframe',
        value: 'timeframe',
        parser: custom,
        filterFieldConfig: {
          modes: [
            {
              mode: 'presets',
              presets: [
                {
                  label: 'Billing cycle',
                  value: 'Billing_Cycle',
                  group: 'recommended',
                  getRange: () => ({ from: new Date(0), to: new Date(1) })
                }
              ]
            }
          ]
        }
      }
    ]

    for (const field of fields) {
      expect(resolveFilterParser(field)).toBe(custom)
      expect(resolveFilterParser(field).serialize({})).toBe('custom')
    }
  })
})
