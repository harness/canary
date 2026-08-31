import { useState } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays, format } from 'date-fns'
import { vi } from 'vitest'

import { DateRangePicker } from '../date-range-picker'
import { CivilDate, DateRangeValue } from '../types'

const toCivilDate = (date: Date): CivilDate => format(date, 'yyyy-MM-dd') as CivilDate

const rollingValue: DateRangeValue = {
  kind: 'relative',
  direction: 'past',
  amount: 7,
  unit: 'day',
  timeZone: 'UTC'
}

const getTrigger = () => screen.getByRole('button', { name: /^Date range:/ })

const openPicker = async () => {
  await userEvent.click(getTrigger())
}

const choosePresetDirection = async (current: 'Last' | 'Next', next: 'Last' | 'Next') => {
  fireEvent.keyDown(screen.getByRole('button', { name: `Duration direction: ${current}` }), { key: 'Enter' })
  const option = await waitFor(() => screen.getAllByRole('menuitem').find(item => item.textContent?.startsWith(next)))
  fireEvent.click(option!)
}

describe('DateRangePicker', () => {
  test('starts with a timezone-aware trigger and opens on Presets without a selection', async () => {
    render(<DateRangePicker value={undefined} onChange={vi.fn()} />)

    const custom = getTrigger()
    expect(custom).toHaveTextContent('Custom')
    expect(custom).toHaveTextContent('UTC+00:00')
    expect(screen.queryByRole('radio', { name: 'Default' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: 'Today' })).not.toBeInTheDocument()

    await openPicker()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByRole('menuitem', { name: 'Presets', current: 'page' })).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem').map(item => item.textContent)).toEqual([
      'Presets',
      'Rolling',
      'Period to date',
      'Previous period',
      'Fixed'
    ])
    expect(screen.queryByRole('menuitem', { name: 'Since' })).not.toBeInTheDocument()
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0)
  })

  test('shows explicitly set time and the timezone in the trigger', () => {
    render(
      <DateRangePicker
        value={{
          kind: 'absolute',
          timeZone: 'UTC',
          from: { date: '2026-08-04', time: '00:00' },
          to: { date: '2026-08-20', time: '23:59' }
        }}
        onChange={vi.fn()}
      />
    )

    const trigger = screen.getByRole('button', { name: /Date range:.*UTC/ })
    expect(trigger).toHaveTextContent('00:00 Aug 4 – 23:59 Aug 20, 2026')
    expect(trigger).toHaveTextContent('UTC+00:00')
    expect(trigger).toHaveAttribute('aria-label', expect.stringMatching(/12:00 AM.*11:59 PM.*UTC/))
  })

  test('keeps presets inside the editor and commits them on Apply', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    expect(screen.queryByRole('radio', { name: '30D' })).not.toBeInTheDocument()
    await openPicker()
    expect(screen.getByRole('menuitem', { name: 'Presets', current: 'page' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: '30D' }))
    expect(onChange).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'relative', direction: 'past', amount: 30, unit: 'day' })
    )
  })

  test('switches modes and restores the controlled value on Cancel', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    expect(screen.getByText('Starts')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onChange).not.toHaveBeenCalled()

    await openPicker()
    expect(screen.getByRole('menuitem', { name: 'Presets', current: 'page' })).toBeInTheDocument()
  })

  test('only commits the draft on Apply', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await choosePresetDirection('Last', 'Next')
    expect(onChange).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ kind: 'relative', direction: 'future' }))
  })

  test('clears the draft without closing the editor or committing', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('button', { name: 'Clear range' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByRole('menuitem', { name: 'Presets', current: 'page' })).toBeInTheDocument()
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0)
  })

  test('keeps the timezone and always-visible full-day time fields when cleared', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={{ ...rollingValue, timeZone: 'America/New_York' }} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    expect(screen.queryByRole('switch', { name: 'Enable time ranges' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Start time')).toHaveValue('12:00 AM')
    expect(screen.getByLabelText('End time')).toHaveValue('11:59 PM')

    await userEvent.click(screen.getByRole('button', { name: 'Clear range' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'UTC' })).not.toBeInTheDocument()
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0)
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    expect(screen.getByLabelText('Start time')).toHaveValue('12:00 AM')
    expect(screen.getByLabelText('End time')).toHaveValue('11:59 PM')
  })

  test('keeps unchanged full-day times implicit in the applied fixed value', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    expect(screen.getByLabelText('Start time')).toHaveValue('12:00 AM')
    expect(screen.getByLabelText('End time')).toHaveValue('11:59 PM')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'absolute',
        from: expect.not.objectContaining({ time: expect.anything() }),
        to: expect.not.objectContaining({ time: expect.anything() })
      })
    )
    // The badge itself reads "UTC+00:00", so only the range portion is checked.
    expect(getTrigger().querySelector('span')).not.toHaveTextContent(/00:00|23:59/)
  })

  test('edits the start date by typing and with the arrow keys', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))

    const startDate = screen.getByLabelText('Start date')
    await userEvent.clear(startDate)
    await userEvent.type(startDate, 'Aug 19, 2026{enter}')
    expect(startDate).toHaveValue('Aug 19, 2026')

    fireEvent.keyDown(startDate, { key: 'ArrowUp' })
    expect(screen.getByLabelText('Start date')).toHaveValue('Aug 20, 2026')

    fireEvent.keyDown(screen.getByLabelText('Start date'), { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByLabelText('Start date'), { key: 'ArrowDown' })
    expect(screen.getByLabelText('Start date')).toHaveValue('Aug 18, 2026')

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'absolute', from: expect.objectContaining({ date: '2026-08-18' }) })
    )
  })

  test('restores the last valid date when the typed text cannot be parsed', async () => {
    render(<DateRangePicker value={rollingValue} onChange={vi.fn()} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))

    const startDate = screen.getByLabelText('Start date')
    const original = (startDate as HTMLInputElement).value
    await userEvent.clear(startDate)
    await userEvent.type(startDate, 'not a date')
    fireEvent.blur(startDate)

    expect(screen.getByLabelText('Start date')).toHaveValue(original)
  })

  test('edits time by typing and steps it by hour with arrow keys', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    const startTime = screen.getByLabelText('Start time')
    expect(screen.queryByText('SELECT START TIME')).not.toBeInTheDocument()
    await userEvent.clear(startTime)
    await userEvent.type(startTime, '7:15 am{enter}')
    expect(startTime).toHaveValue('7:15 AM')
    fireEvent.keyDown(startTime, { key: 'ArrowUp' })
    expect(screen.getByLabelText('Start time')).toHaveValue('8:15 AM')
    fireEvent.keyDown(screen.getByLabelText('Start time'), { key: 'ArrowDown' })
    expect(screen.getByLabelText('Start time')).toHaveValue('7:15 AM')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'absolute',
        from: expect.objectContaining({ time: '07:15' })
      })
    )
  })

  test('commits custom adjustments with Apply and keeps them mutually exclusive', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} enableOffset enableExclusions />)

    expect(screen.queryByRole('button', { name: 'Exclude' })).not.toBeInTheDocument()
    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rolling' }))
    await userEvent.click(screen.getByRole('button', { name: 'Exclude' }))
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('button', { name: 'Exclude' })).toHaveAttribute('data-selected', 'true')
    expect(onChange).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Offset' }))
    await userEvent.clear(screen.getByLabelText('Offset amount'))
    await userEvent.type(screen.getByLabelText('Offset amount'), '3')

    expect(screen.getByRole('button', { name: 'Offset' })).toHaveAttribute('data-selected', 'true')
    expect(screen.getByRole('button', { name: 'Exclude' })).toHaveAttribute('data-selected', 'false')
    expect(onChange).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'relative',
        adjustment: { type: 'offset', offset: { amount: 3, unit: 'day' } }
      })
    )
  })

  test('steps the rolling amount with the arrow keys', async () => {
    const onChange = vi.fn()
    render(<DateRangePicker value={rollingValue} onChange={onChange} />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rolling' }))

    const amount = screen.getByLabelText('Rolling amount')
    expect(amount).toHaveAttribute('type', 'text')
    expect(amount).toHaveValue('7')

    fireEvent.keyDown(amount, { key: 'ArrowUp' })
    expect(screen.getByLabelText('Rolling amount')).toHaveValue('8')
    fireEvent.keyDown(screen.getByLabelText('Rolling amount'), { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByLabelText('Rolling amount'), { key: 'ArrowDown' })
    expect(screen.getByLabelText('Rolling amount')).toHaveValue('6')

    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ kind: 'relative', amount: 6 }))
  })

  test('only renders adjustments for Rolling ranges', async () => {
    render(<DateRangePicker value={rollingValue} onChange={vi.fn()} enableOffset enableExclusions />)

    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Fixed' }))
    expect(screen.queryByRole('button', { name: 'Exclude' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Offset' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Rolling' }))
    expect(screen.getByRole('button', { name: 'Exclude' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Offset' })).toBeEnabled()
    expect(screen.queryByRole('radio', { name: '30D' })).not.toBeInTheDocument()
  })

  test('applies the in-editor direction to duration presets only', async () => {
    const Harness = () => {
      const [value, setValue] = useState<DateRangeValue | undefined>(rollingValue)
      return (
        <>
          <DateRangePicker value={value} onChange={setValue} />
          <span data-testid="applied">{JSON.stringify(value)}</span>
        </>
      )
    }
    render(<Harness />)
    const applied = () => JSON.parse(screen.getByTestId('applied').textContent || '{}')

    await openPicker()
    await choosePresetDirection('Last', 'Next')
    await userEvent.click(screen.getByRole('radio', { name: '30D' }))
    expect(applied()).toMatchObject({ direction: 'past', amount: 7, unit: 'day' })
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(applied()).toMatchObject({ direction: 'future', amount: 30, unit: 'day' })

    await openPicker()
    await userEvent.click(screen.getByRole('radio', { name: 'Today' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(applied()).toMatchObject({ direction: 'past', amount: 1, unit: 'day' })
  })

  test('marks today in the calendar', async () => {
    render(<DateRangePicker value={rollingValue} onChange={vi.fn()} />)

    await openPicker()
    expect(document.querySelectorAll('.day-today').length).toBeGreaterThan(0)
  })

  test('allows future dates by default', async () => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    render(
      <DateRangePicker
        value={{
          kind: 'absolute',
          timeZone: 'UTC',
          from: { date: toCivilDate(today), time: '00:00' },
          to: { date: toCivilDate(tomorrow), time: '23:59' }
        }}
        onChange={vi.fn()}
      />
    )

    await openPicker()
    const tomorrowButton = screen
      .getAllByRole('gridcell', { name: String(tomorrow.getDate()) })
      .find(button => !button.classList.contains('day-outside'))

    expect(tomorrowButton).toBeDefined()
    expect(tomorrowButton).not.toBeDisabled()
  })

  test('only shows optional search and rolling adjustments when enabled', async () => {
    const { rerender } = render(<DateRangePicker value={rollingValue} onChange={vi.fn()} />)
    await openPicker()

    expect(screen.queryByPlaceholderText(/Describe a date and time range/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Offset/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Exclude/ })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    rerender(
      <DateRangePicker
        value={rollingValue}
        onChange={vi.fn()}
        onInterpretQuery={async () => rollingValue}
        enableOffset
        enableExclusions
      />
    )
    await openPicker()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rolling' }))

    expect(screen.getByPlaceholderText(/Describe a date and time range/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Offset/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Exclude/ })).toBeInTheDocument()
  })
})
