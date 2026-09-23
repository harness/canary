import { normalizeTimeZone } from './timezone-utils'
import { DateRangePreset, DateRangeQuickPreset, DEFAULT_TIME_ZONE, TimeZoneId } from './types'

export const getDefaultDateRangeQuickPresets = (timeZone: TimeZoneId = DEFAULT_TIME_ZONE): DateRangeQuickPreset[] => {
  const zone = normalizeTimeZone(timeZone)

  return [
    {
      id: 'today',
      label: 'Today',
      value: { kind: 'relative', direction: 'past', amount: 1, unit: 'day', timeZone: zone }
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      value: {
        kind: 'relative',
        direction: 'past',
        amount: 1,
        unit: 'day',
        timeZone: zone,
        adjustment: { type: 'exclude', exclude: { incompleteInterval: true } }
      }
    },
    ...[
      { id: '7-days', label: '7D', amount: 7, unit: 'day' },
      { id: '30-days', label: '30D', amount: 30, unit: 'day' },
      { id: '3-months', label: '3M', amount: 3, unit: 'month' },
      { id: '6-months', label: '6M', amount: 6, unit: 'month' },
      { id: '12-months', label: '12M', amount: 12, unit: 'month' }
    ].map(({ id, label, amount, unit }) => ({
      id,
      label,
      supportsDirection: true,
      value: {
        kind: 'relative' as const,
        direction: 'past' as const,
        amount,
        unit: unit as 'day' | 'month',
        timeZone: zone
      }
    }))
  ]
}

export const getDefaultDateRangePresets = (timeZone: TimeZoneId = DEFAULT_TIME_ZONE): DateRangePreset[] => {
  const zone = normalizeTimeZone(timeZone)

  return [
    {
      id: 'recommended-last-7-days',
      label: 'Last 7 days',
      group: 'recommended',
      value: { kind: 'relative', direction: 'past', amount: 7, unit: 'day', timeZone: zone }
    },
    {
      id: 'recommended-this-month',
      label: 'This month',
      group: 'recommended',
      value: { kind: 'calendar', period: 'this_month', extent: 'full', timeZone: zone }
    },
    {
      id: 'last-30-days',
      label: 'Last 30 days',
      group: 'relative',
      value: { kind: 'relative', direction: 'past', amount: 30, unit: 'day', timeZone: zone }
    },
    {
      id: 'next-7-days',
      label: 'Next 7 days',
      group: 'relative',
      value: { kind: 'relative', direction: 'future', amount: 7, unit: 'day', timeZone: zone }
    },
    {
      id: 'next-30-days',
      label: 'Next 30 days',
      group: 'relative',
      value: { kind: 'relative', direction: 'future', amount: 30, unit: 'day', timeZone: zone }
    },
    ...(['week', 'month', 'quarter', 'year'] as const).flatMap(unit =>
      (['this', 'last', 'next'] as const).map(position => ({
        id: `${position}-${unit}`,
        label: `${position[0].toUpperCase()}${position.slice(1)} ${unit}`,
        group: 'calendar' as const,
        value: {
          kind: 'calendar' as const,
          period: `${position}_${unit}` as const,
          ...(position === 'this' ? { extent: 'full' as const } : {}),
          timeZone: zone
        }
      }))
    )
  ]
}

export const DEFAULT_DATE_RANGE_PRESETS = getDefaultDateRangePresets()
export const DEFAULT_DATE_RANGE_QUICK_PRESETS = getDefaultDateRangeQuickPresets()
