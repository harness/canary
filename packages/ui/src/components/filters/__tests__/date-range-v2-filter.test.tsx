import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { DateRangeV2FilterValue } from '../../date-range-v2/types'
import { TooltipProvider } from '../../tooltip'
import DateRangeV2Filter from '../filters-bar/actions/variants/date-range-v2-filter'
import FilterField from '../filters-field'
import { FilterFieldTypes } from '../types'
import { getDateRangeV2FilterLabel } from '../utils'

describe('DateRangeV2Filter', () => {
  test('leaves delete to the filter header', () => {
    render(
      <DateRangeV2Filter
        filter={{
          type: 'daterangev2',
          value: {
            from: new Date('2026-10-06T00:00:00.000Z'),
            to: new Date('2026-10-13T00:00:00.000Z'),
            range: { kind: 'relative' as const, direction: 'last' as const, amount: 7, unit: 'day' as const },
            timezone: 'UTC'
          }
        }}
        config={{ clearable: true }}
        onUpdateFilter={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  test('keeps in-progress edits when the filter re-renders', async () => {
    const filter = {
      type: 'daterangev2' as const,
      value: {
        from: new Date('2026-10-06T00:00:00.000Z'),
        to: new Date('2026-10-13T00:00:00.000Z'),
        range: { kind: 'relative' as const, direction: 'last' as const, amount: 7, unit: 'day' as const },
        timezone: 'UTC'
      }
    }
    const config = { clearable: true }
    const { rerender } = render(
      <DateRangeV2Filter filter={filter} config={config} onUpdateFilter={() => {}} onCancel={() => {}} />
    )

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))

    rerender(<DateRangeV2Filter filter={filter} config={config} onUpdateFilter={() => {}} onCancel={() => {}} />)

    expect(screen.getByRole('tab', { name: /Calendar periods/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('This month')).toBeInTheDocument()
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
        { triggerLabel: { showTimezone: false } }
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
        <FilterField<'timeframe', DateRangeV2FilterValue>
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
