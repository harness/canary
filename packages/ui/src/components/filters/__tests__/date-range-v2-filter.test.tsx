import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { DateRangeV2Value } from '../../date-range-v2/types'
import { TooltipProvider } from '../../tooltip'
import FilterField from '../filters-field'
import { FilterFieldTypes, type DateRangeV2FilterOptionConfig } from '../types'
import { getDateRangeV2FilterLabel } from '../utils'

const storedRange: DateRangeV2Value = {
  from: new Date('2026-10-06T00:00:00.000Z'),
  to: new Date('2026-10-13T00:00:00.000Z'),
  range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
  timezone: 'UTC'
}

const timeframe: DateRangeV2FilterOptionConfig<'timeframe'> = {
  label: 'Timeframe',
  value: 'timeframe',
  type: FilterFieldTypes.DateRangeV2,
  filterFieldConfig: { clearable: true }
}

describe('DateRangeV2 filter field', () => {
  test('unsets the filter value from Clear and closes the panel', async () => {
    const onChange = vi.fn()
    render(
      <TooltipProvider>
        <FilterField<'timeframe', DateRangeV2Value>
          filterOption={timeframe}
          value={storedRange}
          removeFilter={() => {}}
          shouldOpenFilter
          onChange={onChange}
        />
      </TooltipProvider>
    )

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(undefined)
    expect(document.querySelector('.cn-dropdown-menu')).not.toBeInTheDocument()
  })

  test('keeps in-progress edits when the filter re-renders', async () => {
    const field = (
      <FilterField<'timeframe', DateRangeV2Value>
        filterOption={timeframe}
        value={storedRange}
        removeFilter={() => {}}
        shouldOpenFilter
        onChange={() => {}}
      />
    )
    const { rerender } = render(<TooltipProvider>{field}</TooltipProvider>)

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))

    rerender(<TooltipProvider>{field}</TooltipProvider>)

    expect(screen.getByRole('tab', { name: /Calendar periods/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Previous month')).toBeInTheDocument()
  })

  test('includes the timezone offset in the filter label', () => {
    const label = getDateRangeV2FilterLabel({
      from: new Date('2026-10-07T12:18:00.000Z'),
      to: new Date('2026-10-14T12:18:00.000Z'),
      range: { kind: 'relative' as const, direction: 'last' as const, amount: 7, unit: 'day' as const },
      timezone: 'UTC'
    })

    expect(label).toMatch(/Last 7 days \(.+\) · UTC\+00:00$/)
    expect(
      getDateRangeV2FilterLabel(
        {
          from: new Date('2026-10-07T12:18:00.000Z'),
          to: new Date('2026-10-14T12:18:00.000Z'),
          range: { kind: 'relative' as const, direction: 'last' as const, amount: 7, unit: 'day' as const },
          timezone: 'UTC'
        },
        { triggerLabelConfig: { showTimezone: false } }
      )
    ).not.toMatch(/UTC/)
  })

  test('uses the preset name on the filter chip', () => {
    const label = getDateRangeV2FilterLabel(
      {
        from: new Date('2026-10-11T20:34:00.000Z'),
        to: new Date('2026-10-14T20:34:00.000Z'),
        range: { kind: 'preset', preset: 'PREVIOUS_3_DAYS' },
        timezone: 'UTC'
      },
      {
        modes: [
          {
            mode: 'presets',
            presets: [
              {
                label: 'Previous 3 days',
                value: 'PREVIOUS_3_DAYS',
                group: 'recommended',
                getRange: () => ({
                  from: new Date('2026-10-11T20:34:00.000Z'),
                  to: new Date('2026-10-14T20:34:00.000Z')
                })
              }
            ]
          }
        ]
      }
    )

    expect(label).toBe('Previous 3 days (Oct 11, 2026, 20:34 – Oct 14, 2026, 20:34) · UTC+00:00')
  })

  test('lets the filter menu grow to the available height', () => {
    render(
      <TooltipProvider>
        <FilterField<'timeframe', DateRangeV2Value>
          filterOption={{
            label: 'Timeframe',
            value: 'timeframe',
            type: FilterFieldTypes.DateRangeV2
          }}
          removeFilter={() => {}}
          shouldOpenFilter
          onChange={() => {}}
        />
      </TooltipProvider>
    )

    expect(document.querySelector('.cn-dropdown-menu')).toHaveClass('cn-dropdown-menu-available-height')
  })
})
