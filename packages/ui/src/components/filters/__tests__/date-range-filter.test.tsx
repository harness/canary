import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { DateRangePreset as SemanticDateRangePreset } from '../../date-range-picker'
import { TooltipProvider } from '../../tooltip'
import { adaptDateRangePresets } from '../filters-bar/actions/variants/date-range-field'
import FiltersField from '../filters-field'
import { FilterFieldTypes, type DateRangePreset } from '../types'
import { getDateRangeFilterLabels } from '../utils'

const rollingValue = {
  kind: 'relative',
  direction: 'past',
  amount: 7,
  unit: 'day',
  timeZone: 'UTC'
} as const

describe('date range filter integration', () => {
  it('keeps draft changes open and only emits a semantic value on Apply', async () => {
    const onChange = vi.fn()
    render(
      <TooltipProvider>
        <FiltersField
          filterOption={{
            label: 'Created',
            value: 'created',
            type: FilterFieldTypes.DateRange,
            filterFieldConfig: { enableOffset: true }
          }}
          removeFilter={vi.fn()}
          shouldOpenFilter
          onChange={onChange}
          value={rollingValue}
        />
      </TooltipProvider>
    )

    expect(screen.getByRole('button', { name: 'Delete filter' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rolling' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Next' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'relative', direction: 'future', timeZone: 'UTC' })
    )
    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
  })

  it('empties the draft in place when the range is cleared', async () => {
    const onChange = vi.fn()
    render(
      <TooltipProvider>
        <FiltersField
          filterOption={{
            label: 'Created',
            value: 'created',
            type: FilterFieldTypes.DateRange
          }}
          removeFilter={vi.fn()}
          shouldOpenFilter
          onChange={onChange}
          value={rollingValue}
        />
      </TooltipProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Clear range' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0)
  })

  it('adapts legacy presets to absolute semantic presets and preserves semantic presets', () => {
    const legacyPreset: DateRangePreset = {
      label: 'Release window',
      value: 'RELEASE_WINDOW',
      group: 'recommended',
      getRange: () => ({
        from: new Date('2026-08-01T00:00:00.000Z'),
        to: new Date('2026-08-15T00:00:00.000Z')
      })
    }
    const semanticPreset: SemanticDateRangePreset = {
      id: 'next-week',
      label: 'Next week',
      group: 'calendar',
      value: { kind: 'calendar', period: 'next_week', timeZone: 'UTC' }
    }

    const adapted = adaptDateRangePresets([legacyPreset, semanticPreset])

    expect(adapted?.[0]).toMatchObject({
      id: 'RELEASE_WINDOW',
      value: { kind: 'absolute', timeZone: 'UTC' }
    })
    expect(adapted?.[1]).toBe(semanticPreset)
  })

  it('formats a compact chip and one full resolved tooltip for legacy values', () => {
    const labels = getDateRangeFilterLabels({
      from: new Date('2026-08-01T00:00:00.000Z'),
      to: new Date('2026-08-15T00:00:00.000Z'),
      preset: 'CUSTOM'
    })

    expect(labels.compact).toBe('Aug 1–15, 2026 · UTC+00:00')
    expect(labels.full).toBe('Aug 1, 2026 – Aug 15, 2026, UTC')
  })
})
