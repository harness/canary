import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { TooltipProvider } from '../../tooltip'
import { DateRangeV2, DateRangeV2Content, timezoneOptions } from '../date-range-v2'
import { getBrowserTimeZone } from '../timezone-utils'
import type { DateRangeV2Value } from '../types'

const lastWeek: DateRangeV2Value = {
  from: new Date('2026-09-28T15:30:00.000Z'),
  to: new Date('2026-10-05T15:30:00.000Z'),
  range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
  timezone: 'UTC'
}

const renderContent = (props: Partial<Parameters<typeof DateRangeV2Content>[0]> = {}) => {
  const onApply = vi.fn()
  const onCancel = vi.fn()
  render(<DateRangeV2Content value={lastWeek} onApply={onApply} onCancel={onCancel} {...props} />)
  return { onApply, onCancel }
}

describe('DateRangeV2Content', () => {
  test('shows three vertical tabs and hides tab lines by default', () => {
    renderContent()

    const tablist = screen.getByRole('tablist', { name: 'Date range type' })
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Relative'),
      expect.stringContaining('Calendar periods'),
      expect.stringContaining('Fixed')
    ])
    expect(screen.queryByText('Presets')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Relative/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('Updates to the current time when you apply.')).not.toBeInTheDocument()
    expect(tablist.parentElement?.parentElement).toHaveClass('max-w-[calc(100vw-2rem)]')
  })

  test('opens when the stored value has epochs and no range', () => {
    renderContent({
      value: {
        from: new Date('2026-09-05T15:30:00.000Z'),
        to: new Date('2026-10-05T15:30:00.000Z'),
        timezone: 'UTC'
      } as DateRangeV2Value
    })

    expect(screen.getByRole('tab', { name: /Relative/ })).toHaveAttribute('aria-selected', 'true')
  })

  test('shows only the tab lines named in tabDetails', () => {
    renderContent({ config: { tabDetails: ['description'] } })

    expect(screen.getByText('A window counted back from now, or forward to a future date.')).toBeInTheDocument()
    expect(screen.queryByText('e.g. Last 7 days · Next 2 weeks')).not.toBeInTheDocument()
    expect(screen.queryByText('Moves with the clock on every refresh.')).not.toBeInTheDocument()
  })

  test('leaves tab titles when tabDetails is empty', () => {
    renderContent({ config: { tabDetails: [] } })

    expect(screen.getByRole('tab', { name: 'Relative' })).toBeInTheDocument()
    expect(screen.queryByText('A window counted back from now, or forward to a future date.')).not.toBeInTheDocument()
    expect(screen.queryByText('e.g. Last 7 days · Next 2 weeks')).not.toBeInTheDocument()
    expect(screen.queryByText('Moves with the clock on every refresh.')).not.toBeInTheDocument()
  })

  test('previews the draft in the header', () => {
    renderContent()

    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.queryByText('RELATIVE')).not.toBeInTheDocument()
  })

  test('keeps each tab draft when switching tabs', async () => {
    const { onApply } = renderContent()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    expect(screen.getByText('Previous month')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /Relative/ }))
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'UTC'
      })
    )
  })

  test('applies the active tab draft', async () => {
    const { onApply } = renderContent()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Previous' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        range: { kind: 'calendar', position: 'previous', amount: 1, unit: 'month' },
        timezone: 'UTC'
      })
    )
  })

  test('disables the opposite direction for past-only pickers', async () => {
    renderContent({ config: { direction: 'past' } })

    expect(screen.getByRole('radio', { name: 'Last' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Next' })).toBeDisabled()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    expect(screen.getByRole('radio', { name: 'Previous' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'This' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Next' })).toBeDisabled()
    expect(screen.getByText('Previous month')).toBeInTheDocument()
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

    expect(document.getElementById('date-range-v2-timezone')).toBeInTheDocument()
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
      value: { from, to, range: { kind: 'preset', preset: 'LAST_7_DAYS' }, timezone: 'UTC' },
      config: {
        modes: [
          {
            mode: 'presets',
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
          },
          { mode: 'relative' },
          { mode: 'calendar' },
          { mode: 'fixed' }
        ]
      }
    })

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Presets'),
      expect.stringContaining('Relative'),
      expect.stringContaining('Calendar periods'),
      expect.stringContaining('Fixed')
    ])
    expect(screen.getByRole('tab', { name: /Presets/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Last 7 days', exact: true })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ range: { kind: 'preset', preset: 'LAST_7_DAYS' }, timezone: 'UTC', from, to })
    )
  })

  test('labels a selected preset by its name', () => {
    const from = new Date('2026-10-11T20:34:00.000Z')
    const to = new Date('2026-10-14T20:34:00.000Z')
    renderContent({
      value: { from, to, range: { kind: 'preset', preset: 'PREVIOUS_3_DAYS' }, timezone: 'UTC' },
      config: {
        modes: [
          {
            mode: 'presets',
            presets: [
              {
                label: 'Previous 3 days',
                value: 'PREVIOUS_3_DAYS',
                group: 'recommended',
                getRange: () => ({ from, to })
              }
            ]
          },
          { mode: 'relative' },
          { mode: 'calendar' },
          { mode: 'fixed' }
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
      value: { from, to: now, range: { kind: 'preset', preset: 'PREVIOUS_3_DAYS' }, timezone: 'UTC' },
      config: {
        direction: 'past',
        modes: [
          {
            mode: 'presets',
            presets: [
              {
                label: 'Previous 3 days',
                value: 'PREVIOUS_3_DAYS',
                group: 'recommended',
                getRange: () => ({ from, to: now })
              }
            ]
          },
          { mode: 'relative' },
          { mode: 'calendar' },
          { mode: 'fixed' }
        ]
      }
    })

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ range: { kind: 'preset', preset: 'PREVIOUS_3_DAYS' }, from, to: now })
    )
  })

  test('passes the selected timezone into getRange', async () => {
    const from = new Date('2026-10-01T00:00:00.000Z')
    const to = new Date('2026-10-07T23:59:00.000Z')
    const seen: string[] = []
    const { onApply } = renderContent({
      value: { from, to, range: { kind: 'preset', preset: 'BILLING_CYCLE' }, timezone: 'Asia/Kolkata' },
      config: {
        modes: [
          {
            mode: 'presets',
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
          },
          { mode: 'relative' },
          { mode: 'calendar' },
          { mode: 'fixed' }
        ]
      }
    })

    expect(seen.length).toBeGreaterThan(0)
    expect(seen.every(timezone => timezone === 'Asia/Kolkata')).toBe(true)
    const beforeApply = seen.length
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(seen.length).toBeGreaterThan(beforeApply)
    expect(seen.every(timezone => timezone === 'Asia/Kolkata')).toBe(true)
    expect(onApply).toHaveBeenCalledWith({
      from,
      to,
      range: { kind: 'preset', preset: 'BILLING_CYCLE' },
      timezone: 'Asia/Kolkata'
    })
  })

  test('shows modes in the order given by config', () => {
    renderContent({ config: { modes: [{ mode: 'fixed' }, { mode: 'relative' }] } })

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Fixed'),
      expect.stringContaining('Relative')
    ])
  })

  test('shows an empty preset select when the presets list is empty', async () => {
    renderContent({ config: { modes: [{ mode: 'presets', presets: [] }, { mode: 'relative' }] } })

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Presets'),
      expect.stringContaining('Relative')
    ])

    await userEvent.click(screen.getByRole('tab', { name: /Presets/ }))

    expect(screen.getByRole('button', { name: 'Select an option' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  test('hides presets when modes leaves them out', () => {
    renderContent({ config: { modes: [{ mode: 'relative' }, { mode: 'calendar' }] } })

    expect(screen.queryByRole('tab', { name: /Presets/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Relative'),
      expect.stringContaining('Calendar periods')
    ])
  })

  test('keeps a listed Presets mode in its configured position', () => {
    renderContent({
      config: {
        modes: [
          { mode: 'fixed' },
          {
            mode: 'presets',
            presets: [
              {
                label: 'Last 7 days',
                value: 'LAST_7_DAYS',
                group: 'recommended',
                getRange: () => ({ from: lastWeek.from!, to: lastWeek.to! })
              }
            ]
          },
          { mode: 'relative' }
        ]
      }
    })

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Fixed'),
      expect.stringContaining('Presets'),
      expect.stringContaining('Relative')
    ])
  })

  test('hides modes that are turned off', () => {
    renderContent({ config: { modes: [{ mode: 'relative' }] } })

    expect(screen.queryByRole('tablist', { name: 'Date range type' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: /Calendar periods/ })).not.toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days').closest('.max-w-\\[calc\\(100vw-2rem\\)\\]')).toBeInTheDocument()
  })

  test('uses a mode label as the tab title', () => {
    renderContent({
      config: {
        modes: [{ mode: 'relative', label: ' Window ' }, { mode: 'calendar', label: '   ' }, { mode: 'fixed' }]
      }
    })

    expect(screen.getByRole('tab', { name: /Window/ })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: /^Relative/ })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Calendar periods/ })).toBeInTheDocument()
  })

  test('hides the calendar amount when that control is off', async () => {
    renderContent({
      config: { modes: [{ mode: 'relative' }, { mode: 'calendar', allowAmount: false }, { mode: 'fixed' }] }
    })

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Previous' }))

    expect(screen.queryByRole('textbox', { name: 'Calendar amount' })).not.toBeInTheDocument()
  })

  test('clears the value without applying a range', async () => {
    const onClear = vi.fn()
    renderContent({ config: { clearable: true }, onClear })

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})

describe('DateRangeV2', () => {
  test('fills epochs when the open picker has a range without bounds', () => {
    const onValueChange = vi.fn()
    render(
      <DateRangeV2
        open
        value={{ range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' }, timezone: 'UTC' }}
        onValueChange={onValueChange}
      />
    )

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'UTC'
      })
    )
    const next = onValueChange.mock.calls.at(-1)?.[0]
    expect(next.from).toBeInstanceOf(Date)
    expect(next.to).toBeInstanceOf(Date)
  })

  test('fills epochs when a closed picker has a range without bounds', () => {
    const onValueChange = vi.fn()
    const value: DateRangeV2Value = {
      range: { kind: 'relative', direction: 'last', amount: 1, unit: 'month' },
      timezone: 'UTC'
    }
    const { rerender } = render(<DateRangeV2 value={value} onValueChange={onValueChange} />)

    expect(onValueChange).toHaveBeenCalledTimes(1)
    const next = onValueChange.mock.calls[0][0]
    expect(next.range).toEqual(value.range)
    expect(next.timezone).toBe('UTC')
    expect(next.from).toBeInstanceOf(Date)
    expect(next.to).toBeInstanceOf(Date)

    rerender(<DateRangeV2 value={value} onValueChange={onValueChange} />)
    expect(onValueChange).toHaveBeenCalledTimes(1)
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

    rerender(
      <DateRangeV2 value={lastWeek} onValueChange={onValueChange} config={{ triggerLabel: { showTimezone: false } }} />
    )
    expect(screen.getByRole('button', { name: /^Date range: Last 7 days/ }).textContent).not.toMatch(/UTC/)

    rerender(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: /^Date range:/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'UTC'
      })
    )
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

  test('uses relative defaultValue for an empty value', () => {
    renderContent({
      value: undefined,
      config: {
        modes: [
          { mode: 'relative', defaultValue: { direction: 'last', amount: 12, unit: 'day' } },
          { mode: 'calendar' },
          { mode: 'fixed' }
        ]
      }
    })

    expect(screen.getByRole('textbox', { name: 'Relative amount' })).toHaveValue('12')
    expect(screen.getByText('Last 12 days')).toBeInTheDocument()
  })

  test('opens the calendar draft on the previous month', async () => {
    renderContent({ value: undefined })

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))

    expect(screen.getByRole('textbox', { name: 'Calendar amount' })).toHaveValue('1')
    expect(screen.getByText('Previous month')).toBeInTheDocument()
  })

  test('opens on the configured relative direction and calendar defaultValue', async () => {
    renderContent({
      value: undefined,
      config: {
        modes: [
          { mode: 'relative', defaultValue: { direction: 'next', amount: 3, unit: 'week' } },
          { mode: 'calendar', defaultValue: { position: 'previous', amount: 7, unit: 'day' } },
          { mode: 'fixed' }
        ]
      }
    })

    expect(screen.getByText('Next 3 weeks')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))

    expect(screen.getByRole('textbox', { name: 'Calendar amount' })).toHaveValue('7')
    expect(screen.getByText('Previous 7 days')).toBeInTheDocument()
  })

  test('fills the start field from the first day click and orders the second click', async () => {
    render(
      <TooltipProvider>
        <DateRangeV2Content
          value={undefined}
          onApply={vi.fn()}
          onCancel={vi.fn()}
          config={{ modes: [{ mode: 'fixed' }] }}
        />
      </TooltipProvider>
    )

    const month = screen.getAllByRole('grid')[0]
    const captionId = month.getAttribute('aria-labelledby')
    const caption = document.getElementById(captionId ?? '')?.textContent ?? ''
    const [monthName, year] = caption.split(' ')
    const shortMonth = monthName.slice(0, 3)
    const day = (name: string) => within(month).getByRole('gridcell', { name })
    const start = () => screen.getByRole('textbox', { name: 'Start' })
    const end = () => screen.getByRole('textbox', { name: 'End' })

    expect(screen.getByText('Select a range')).toBeInTheDocument()

    await userEvent.click(day('9'))

    await waitFor(() => expect(start()).toHaveValue(`${shortMonth} 9, ${year}, 12:00 AM`))
    expect(end()).toHaveValue('')
    expect(screen.getByText(`${shortMonth} 9, ${year} · UTC+00:00`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()

    await userEvent.click(day('16'))

    expect(start()).toHaveValue(`${shortMonth} 9, ${year}, 12:00 AM`)
    await waitFor(() => expect(end()).toHaveValue(`${shortMonth} 16, ${year}, 11:59 PM`))
    expect(screen.getByText(`${shortMonth} 9 – ${shortMonth} 16, ${year} · UTC+00:00`)).toBeInTheDocument()

    await userEvent.click(day('4'))
    await waitFor(() => expect(start()).toHaveValue(`${shortMonth} 4, ${year}, 12:00 AM`))
    expect(end()).toHaveValue('')

    await userEvent.click(day('2'))

    await waitFor(() => expect(start()).toHaveValue(`${shortMonth} 2, ${year}, 12:00 AM`))
    expect(end()).toHaveValue(`${shortMonth} 4, ${year}, 11:59 PM`)
  })

  test('leaves the fixed draft empty when no defaultValue is set', async () => {
    render(
      <TooltipProvider>
        <DateRangeV2Content value={lastWeek} onApply={vi.fn()} onCancel={vi.fn()} />
      </TooltipProvider>
    )

    await userEvent.click(screen.getByRole('tab', { name: /Fixed/ }))

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'End' })).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  test('uses a custom defaultValue for an empty fixed draft', async () => {
    const onApply = vi.fn()
    render(
      <TooltipProvider>
        <DateRangeV2Content
          value={undefined}
          onApply={onApply}
          onCancel={vi.fn()}
          config={{
            modes: [
              { mode: 'relative' },
              { mode: 'calendar' },
              {
                mode: 'fixed',
                defaultValue: {
                  from: '2026-01-01T09:30:00',
                  to: '2026-01-07T17:00:00'
                }
              }
            ]
          }}
        />
      </TooltipProvider>
    )

    await userEvent.click(screen.getByRole('tab', { name: /Fixed/ }))

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('Jan 1, 2026, 9:30 AM')
    expect(screen.getByRole('textbox', { name: 'End' })).toHaveValue('Jan 7, 2026, 5:00 PM')
  })

  test('shows seconds when the fixed mode asks for them', async () => {
    render(
      <TooltipProvider>
        <DateRangeV2Content
          value={undefined}
          onApply={vi.fn()}
          onCancel={vi.fn()}
          config={{
            modes: [
              {
                mode: 'fixed',
                allowSeconds: true,
                defaultValue: {
                  from: '2026-01-01T09:30:15',
                  to: '2026-01-07T17:00:45'
                }
              }
            ]
          }}
        />
      </TooltipProvider>
    )

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('Jan 1, 2026, 9:30:15 AM')
    expect(screen.getByRole('textbox', { name: 'End' })).toHaveValue('Jan 7, 2026, 5:00:45 PM')
  })

  test('orders a same-day fixed default whose end time is earlier', () => {
    render(
      <TooltipProvider>
        <DateRangeV2Content
          value={undefined}
          onApply={vi.fn()}
          onCancel={vi.fn()}
          config={{
            modes: [
              {
                mode: 'fixed',
                defaultValue: {
                  from: '2026-01-05T17:00:00',
                  to: '2026-01-05T09:00:00'
                }
              }
            ]
          }}
        />
      </TooltipProvider>
    )

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('Jan 5, 2026, 9:00 AM')
    expect(screen.getByRole('textbox', { name: 'End' })).toHaveValue('Jan 5, 2026, 5:00 PM')
  })

  test('shifts both ends when an arrow would reverse the range, and swaps a typed reversal on blur', async () => {
    render(
      <TooltipProvider>
        <DateRangeV2Content
          value={undefined}
          onApply={vi.fn()}
          onCancel={vi.fn()}
          config={{
            modes: [
              {
                mode: 'fixed',
                defaultValue: {
                  from: '2026-09-08T11:00:00',
                  to: '2026-09-08T11:59:00'
                }
              }
            ]
          }}
        />
      </TooltipProvider>
    )

    const end = screen.getByRole('textbox', { name: 'End' })
    end.focus()
    await userEvent.keyboard('{ArrowDown}')

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('Sep 8, 2026, 10:00 AM')
    expect(end).toHaveValue('Sep 8, 2026, 10:59 AM')

    await userEvent.clear(end)
    await userEvent.type(end, 'Sep 8, 2026, 9:00 AM')
    await userEvent.tab()

    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveValue('Sep 8, 2026, 9:00 AM')
    expect(screen.getByRole('textbox', { name: 'End' })).toHaveValue('Sep 8, 2026, 10:00 AM')
  })

  test('uses a This calendar defaultValue', async () => {
    renderContent({
      value: undefined,
      config: {
        modes: [
          { mode: 'relative' },
          { mode: 'calendar', defaultValue: { position: 'this', unit: 'month', extent: 'so_far' } },
          { mode: 'fixed' }
        ]
      }
    })

    await userEvent.click(screen.getByRole('tab', { name: /Calendar periods/ }))

    expect(screen.getByText('This month, so far')).toBeInTheDocument()
  })

  test('hides the relative amount and fixed times when those controls are off', async () => {
    renderContent({
      config: {
        modes: [{ mode: 'relative', allowAmount: false }, { mode: 'calendar' }, { mode: 'fixed', allowTime: false }]
      }
    })

    expect(screen.queryByRole('textbox', { name: 'Relative amount' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /Fixed/ }))

    expect(screen.getByRole('textbox', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Start' })).toHaveAttribute('placeholder', 'Describe date')
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

  test('applies relative and calendar config changes to the current value', () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{
          modes: [{ mode: 'relative', defaultValue: { direction: 'last', amount: 7, unit: 'day' } }]
        }}
      />
    )

    rerender(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{
          modes: [{ mode: 'relative', defaultValue: { direction: 'last', amount: 12, unit: 'day' } }]
        }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ range: { kind: 'relative', direction: 'last', amount: 12, unit: 'day' } })
    )

    rerender(
      <DateRangeV2
        value={lastWeek}
        onValueChange={onValueChange}
        config={{
          modes: [{ mode: 'relative', defaultValue: { direction: 'last', amount: 3, unit: 'week' } }]
        }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ range: { kind: 'relative', direction: 'last', amount: 3, unit: 'week' } })
    )

    rerender(<DateRangeV2 value={lastWeek} onValueChange={onValueChange} config={{ direction: 'future' }} />)
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ range: { kind: 'relative', direction: 'next', amount: 7, unit: 'day' } })
    )

    const calendarValue: DateRangeV2Value = {
      ...lastWeek,
      range: { kind: 'calendar', position: 'previous', amount: 1, unit: 'month' }
    }
    rerender(
      <DateRangeV2
        value={calendarValue}
        onValueChange={onValueChange}
        config={{
          modes: [{ mode: 'calendar', defaultValue: { position: 'previous', amount: 4, unit: 'quarter' } }]
        }}
      />
    )
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        range: { kind: 'calendar', position: 'previous', amount: 4, unit: 'quarter' }
      })
    )
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

  test('leaves a fixed range unchanged when relative defaults change', () => {
    const onValueChange = vi.fn()
    const fixed: DateRangeV2Value = {
      ...lastWeek,
      range: {
        kind: 'fixed',
        from: '2026-09-28T15:30:00',
        to: '2026-10-05T15:30:00'
      }
    }
    const { rerender } = render(<DateRangeV2 value={fixed} onValueChange={onValueChange} />)

    rerender(
      <DateRangeV2
        value={fixed}
        onValueChange={onValueChange}
        config={{
          modes: [{ mode: 'relative', defaultValue: { direction: 'last', amount: 12, unit: 'day' } }]
        }}
      />
    )

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
