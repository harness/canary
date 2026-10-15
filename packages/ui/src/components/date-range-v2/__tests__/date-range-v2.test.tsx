import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { DateRangeV2, DateRangeV2Content, timezoneOptions } from '../date-range-v2'
import { getBrowserTimeZone } from '../timezone-utils'
import type { DateRangeV2Value } from '../types'

const lastWeek: DateRangeV2Value = {
  from: new Date('2026-09-28T15:30:00.000Z'),
  to: new Date('2026-10-05T15:30:00.000Z'),
  preset: 'LAST_7_DAYS',
  timezone: 'UTC'
}

const renderContent = (props: Partial<Parameters<typeof DateRangeV2Content>[0]> = {}) => {
  const onApply = vi.fn()
  const onCancel = vi.fn()
  render(<DateRangeV2Content value={lastWeek} onApply={onApply} onCancel={onCancel} {...props} />)
  return { onApply, onCancel }
}

describe('DateRangeV2Content', () => {
  test('shows three vertical tabs with the active tab note', () => {
    renderContent()

    const tablist = screen.getByRole('tablist', { name: 'Date range type' })
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Rolling'),
      expect.stringContaining('Calendar periods'),
      expect.stringContaining('Fixed')
    ])
    expect(screen.queryByText('Presets')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Rolling/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Updates to the current time when you apply.')).toBeInTheDocument()
    expect(tablist.parentElement?.parentElement).toHaveClass('w-[760px]')
  })

  test('shows only the tab lines named in tabDetails', () => {
    renderContent({ config: { tabDetails: ['description'] } })

    expect(screen.getByText('A window counted back from now, or forward to a future date.')).toBeInTheDocument()
    expect(screen.queryByText('e.g. Last 7 days · Next 2 weeks')).not.toBeInTheDocument()
    expect(screen.queryByText('Moves with the clock on every refresh.')).not.toBeInTheDocument()
  })

  test('leaves tab titles when tabDetails is empty', () => {
    renderContent({ config: { tabDetails: [] } })

    expect(screen.getByRole('tab', { name: 'Rolling' })).toBeInTheDocument()
    expect(screen.queryByText('A window counted back from now, or forward to a future date.')).not.toBeInTheDocument()
    expect(screen.queryByText('e.g. Last 7 days · Next 2 weeks')).not.toBeInTheDocument()
    expect(screen.queryByText('Moves with the clock on every refresh.')).not.toBeInTheDocument()
  })

  test('previews the draft in the header', () => {
    renderContent()

    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.queryByText('ROLLING')).not.toBeInTheDocument()
  })

  test('keeps each tab draft when switching tabs', async () => {
    const { onApply } = renderContent()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    expect(screen.getByText('This month')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /Rolling/ }))
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ preset: 'LAST_7_DAYS', timezone: 'UTC' }))
  })

  test('applies the active tab draft', async () => {
    const { onApply } = renderContent()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Previous' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ preset: 'LAST_1_CALENDAR_MONTH', timezone: 'UTC' }))
  })

  test('disables the opposite direction for past-only pickers', async () => {
    renderContent({ config: { direction: 'past' } })

    expect(screen.getByRole('radio', { name: 'Last' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Next' })).toBeDisabled()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    expect(screen.getByRole('radio', { name: 'Previous' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'This' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Next' })).toBeDisabled()
    expect(screen.getByText('This month, so far')).toBeInTheDocument()
  })

  test('starts on the future side for future-only pickers', () => {
    renderContent({ value: undefined, config: { direction: 'future' } })

    expect(screen.getByText('Next 7 days')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Last' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Next' })).toBeEnabled()
  })

  test('hides the timezone row unless enabled', () => {
    renderContent()
    expect(screen.queryByText('Timezone')).not.toBeInTheDocument()
  })

  test('limits timezone choices to browser and UTC', () => {
    const browser = getBrowserTimeZone()

    expect(timezoneOptions('dynamic', 'locale-utc').map(option => option.value)).toEqual(['LOCALE', 'UTC'])
    expect(timezoneOptions('explicit', 'locale-utc').map(option => option.value)).toEqual(
      browser === 'UTC' ? ['UTC'] : [browser, 'UTC']
    )

    const full = timezoneOptions('dynamic', 'all').map(option => option.value)
    expect(full.filter(value => value === 'UTC')).toHaveLength(1)
    expect(full.slice(0, 2)).toEqual(['LOCALE', 'UTC'])
    expect(full).toContain('Africa/Abidjan')
  })

  test('hides timezone search when the list is browser and UTC', () => {
    renderContent({ config: { timezone: { options: 'locale-utc' } } })

    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument()
    expect(document.getElementById('date-range-v2-timezone')).toBeInTheDocument()
  })

  test('shows the timezone row when enabled', () => {
    renderContent({ config: { timezone: {} } })

    expect(screen.getByText('Timezone')).toBeInTheDocument()
    expect(screen.queryByText(/Query bounds:/)).not.toBeInTheDocument()
  })

  test('cancels without applying', async () => {
    const { onApply, onCancel } = renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onApply).not.toHaveBeenCalled()
  })

  test('adds a Presets tab for date range presets and keeps the preset id', async () => {
    const from = new Date('2026-10-01T00:00:00.000Z')
    const to = new Date('2026-10-07T23:59:00.000Z')
    const { onApply } = renderContent({
      value: { from, to, preset: 'LAST_7_DAYS', timezone: 'UTC' },
      config: {
        presets: [
          {
            label: 'Last 7 days',
            value: 'LAST_7_DAYS',
            group: 'recommended',
            getRange: () => ({ from, to })
          },
          {
            label: 'This month',
            value: 'THIS_MONTH',
            group: 'calendar',
            getRange: () => ({
              from: new Date('2026-10-01T00:00:00.000Z'),
              to: new Date('2026-10-31T23:59:00.000Z')
            })
          }
        ]
      }
    })

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Presets'),
      expect.stringContaining('Rolling'),
      expect.stringContaining('Calendar periods'),
      expect.stringContaining('Fixed')
    ])
    expect(screen.getByRole('tab', { name: /Presets/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Last 7 days', exact: true })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ preset: 'LAST_7_DAYS', timezone: 'UTC', from, to }))
  })

  test('labels a selected preset by its name', () => {
    const from = new Date('2026-10-11T20:34:00.000Z')
    const to = new Date('2026-10-14T20:34:00.000Z')
    renderContent({
      value: { from, to, preset: 'PREVIOUS_3_DAYS', timezone: 'UTC' },
      config: {
        presets: [
          {
            label: 'Previous 3 days',
            value: 'PREVIOUS_3_DAYS',
            group: 'recommended',
            getRange: () => ({ from, to })
          }
        ]
      }
    })

    expect(screen.getAllByText('Previous 3 days').length).toBeGreaterThan(0)
    expect(screen.queryByText('Fixed range')).not.toBeInTheDocument()
  })

  test('applies a past preset that ends during the current minute', async () => {
    const now = new Date()
    const from = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const { onApply } = renderContent({
      value: { from, to: now, preset: 'PREVIOUS_3_DAYS', timezone: 'UTC' },
      config: {
        direction: 'past',
        presets: [
          {
            label: 'Previous 3 days',
            value: 'PREVIOUS_3_DAYS',
            group: 'recommended',
            getRange: () => ({ from, to: now })
          }
        ]
      }
    })

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ preset: 'PREVIOUS_3_DAYS', from, to: now }))
  })

  test('passes the selected timezone into getRange', async () => {
    const from = new Date('2026-10-01T00:00:00.000Z')
    const to = new Date('2026-10-07T23:59:00.000Z')
    const seen: string[] = []
    const { onApply } = renderContent({
      value: { from, to, preset: 'BILLING_CYCLE', timezone: 'Asia/Kolkata' },
      config: {
        presets: [
          {
            label: 'Billing cycle',
            value: 'BILLING_CYCLE',
            group: 'recommended',
            getRange: ({ timezone }) => {
              seen.push(timezone)
              return { from, to }
            }
          }
        ]
      }
    })

    expect(seen.length).toBeGreaterThan(0)
    expect(seen.every(timezone => timezone === 'Asia/Kolkata')).toBe(true)
    const beforeApply = seen.length
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(seen.length).toBeGreaterThan(beforeApply)
    expect(seen.every(timezone => timezone === 'Asia/Kolkata')).toBe(true)
    expect(onApply).toHaveBeenCalledWith({ from, to, preset: 'BILLING_CYCLE', timezone: 'Asia/Kolkata' })
  })

  test('hides modes that are turned off', () => {
    renderContent({ config: { modes: ['rolling'] } })

    expect(screen.queryByRole('tablist', { name: 'Date range type' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: /Calendar periods/ })).not.toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days').closest('.w-\\[520px\\]')).toBeInTheDocument()
  })

  test('hides the calendar amount when that control is off', async () => {
    renderContent({ config: { modeConfig: { calendar: { allowAmount: false } } } })

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Previous' }))

    expect(screen.queryByRole('textbox', { name: 'Calendar amount' })).not.toBeInTheDocument()
  })

  test('deletes the value without applying a range', async () => {
    const onClear = vi.fn()
    renderContent({ config: { clearable: true }, onClear })

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})

describe('DateRangeV2', () => {
  test('migrates a legacy default preset when the picker is rendered', () => {
    const onValueChange = vi.fn()
    render(<DateRangeV2 value={{ ...lastWeek, preset: 'CURRENT_MONTH' }} onValueChange={onValueChange} />)

    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ preset: 'THIS_MONTH', timezone: 'UTC' }))
  })

  test('keeps the stored bounds until the user applies', async () => {
    const onValueChange = vi.fn()
    render(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} />)

    expect(screen.getByRole('button', { name: /^Date range:/ }).textContent).toContain('Sep 28, 2026, 15:30')
    expect(screen.getByRole('button', { name: /^Date range:/ }).textContent).toContain('Oct 5, 2026, 15:30')

    await userEvent.click(screen.getByRole('button', { name: /^Date range:/ }))
    expect(screen.getAllByText(/Sep 28, 2026, 15:30 – Oct 5, 2026, 15:30/)).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /^Date range:/ }).textContent).toContain('Sep 28, 2026, 15:30')
  })

  test('reports the applied range, including its timezone', async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} />)

    expect(screen.getByRole('button', { name: /^Date range: Last 7 days/ }).textContent).toMatch(/UTC[+-]\d{2}:\d{2}/)

    rerender(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} config={{ label: { showTimezone: false } }} />)
    expect(screen.getByRole('button', { name: /^Date range: Last 7 days/ }).textContent).not.toMatch(/UTC/)

    rerender(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: /^Date range:/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ preset: 'LAST_7_DAYS', timezone: 'UTC' }))
  })

  test('rewrites browser time when browserZone changes', () => {
    const onValueChange = vi.fn()
    const browser = getBrowserTimeZone()
    const localeValue: DateRangeV2Value = { ...lastWeek, timezone: 'LOCALE' }
    const { rerender } = render(
      <DateRangeV2
        value={localeValue}
        onValueChange={onValueChange}
        config={{ timezone: { browserZone: 'dynamic' } }}
      />
    )

    rerender(
      <DateRangeV2
        value={localeValue}
        onValueChange={onValueChange}
        config={{ timezone: { browserZone: 'explicit' } }}
      />
    )

    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ timezone: browser }))

    const explicitValue: DateRangeV2Value = { ...lastWeek, timezone: browser }
    rerender(
      <DateRangeV2
        value={explicitValue}
        onValueChange={onValueChange}
        config={{ timezone: { browserZone: 'dynamic' } }}
      />
    )

    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ timezone: 'LOCALE' }))
  })

  test('uses rolling defaultAmount for an empty value', () => {
    renderContent({
      value: undefined,
      config: { modeConfig: { rolling: { defaultAmount: 12 } } }
    })

    expect(screen.getByRole('textbox', { name: 'Rolling amount' })).toHaveValue('12')
    expect(screen.getByText('Last 12 days')).toBeInTheDocument()
  })

  test('uses calendar defaultAmount when leaving the current period', async () => {
    renderContent({
      value: undefined,
      config: { modeConfig: { calendar: { defaultAmount: 4 } } }
    })

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Previous' }))

    expect(screen.getByRole('textbox', { name: 'Calendar amount' })).toHaveValue('4')
    expect(screen.getByText('Previous 4 months')).toBeInTheDocument()
  })

  test('hides the rolling amount and fixed times when those controls are off', async () => {
    renderContent({
      config: { modeConfig: { rolling: { allowAmount: false }, custom: { allowTime: false } } }
    })

    expect(screen.queryByRole('textbox', { name: 'Rolling amount' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /Fixed/ }))

    expect(screen.queryByRole('textbox', { name: 'Start time' })).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Start date' })).toBeInTheDocument()
  })

  test('leaves a named timezone unchanged when browserZone changes', () => {
    const onValueChange = vi.fn()
    const named = getBrowserTimeZone() === 'Europe/London' ? 'America/New_York' : 'Europe/London'
    const value: DateRangeV2Value = { ...lastWeek, timezone: named }
    const { rerender } = render(
      <DateRangeV2 value={value} onValueChange={onValueChange} config={{ timezone: { browserZone: 'dynamic' } }} />
    )

    rerender(
      <DateRangeV2 value={value} onValueChange={onValueChange} config={{ timezone: { browserZone: 'explicit' } }} />
    )

    expect(onValueChange).not.toHaveBeenCalled()
  })

  test('applies rolling and calendar config changes to the current value', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{ modeConfig: { rolling: { defaultAmount: 7 } } }}
      />
    )

    rerender(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{ modeConfig: { rolling: { defaultAmount: 12 } } }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ preset: 'LAST_12_DAYS' }))

    rerender(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{ modeConfig: { rolling: { defaultUnit: 'week', maxAmount: 3 } } }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ preset: 'LAST_3_WEEKS' }))

    rerender(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} config={{ direction: 'future' }} />)
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ preset: 'NEXT_7_DAYS' }))

    const calendarValue: DateRangeV2Value = { ...lastWeek, preset: 'LAST_1_CALENDAR_MONTH' }
    rerender(
      <DateRangeV2
        value={calendarValue}
        onValueChange={onValueChange}
        config={{ modeConfig: { calendar: { defaultAmount: 4, defaultUnit: 'quarter' } } }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ preset: 'LAST_4_CALENDAR_QUARTERS' }))
  })

  test('applies timezone defaultValue when the value still uses the previous default', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <DateRangeV2 value={lastWeek} onValueChange={onValueChange} config={{ timezone: { defaultValue: 'UTC' } }} />
    )

    rerender(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{ timezone: { defaultValue: 'Europe/London' } }}
      />
    )

    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ timezone: 'Europe/London' }))
  })

  test('leaves a fixed range unchanged when rolling defaults change', () => {
    const onValueChange = vi.fn()
    const fixed: DateRangeV2Value = { ...lastWeek, preset: 'CUSTOM' }
    const { rerender } = render(<DateRangeV2 value={fixed} onValueChange={onValueChange} />)

    rerender(
      <DateRangeV2
        value={fixed}
        onValueChange={onValueChange}
        config={{ modeConfig: { rolling: { defaultAmount: 12 } } }}
      />
    )

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
