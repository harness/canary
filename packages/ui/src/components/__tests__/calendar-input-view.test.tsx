import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { CalendarInputView } from '../calendar-input-view'

describe('CalendarInputView', () => {
  test('renders TextInput structure with design-system input classes', () => {
    const { container } = render(<CalendarInputView setValue={vi.fn()} />)

    expect(container.querySelector('.cn-input-container')).toBeInTheDocument()
    expect(container.querySelector('.cn-input-input')).toHaveClass('cursor-pointer')
  })

  test('renders placeholder when value is empty', () => {
    render(<CalendarInputView setValue={vi.fn()} placeholder="Pick a date" />)

    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument()
  })

  test('renders formatted value when value is provided', () => {
    const value = '2024-01-15T12:00:00.000Z'
    const formattedValue = new Date(value).toLocaleDateString()

    render(<CalendarInputView value={value} setValue={vi.fn()} />)

    expect(screen.getByDisplayValue(formattedValue)).toBeInTheDocument()
  })

  test('does not allow manual text entry', async () => {
    const setValue = vi.fn()

    render(<CalendarInputView setValue={setValue} />)

    const input = screen.getByPlaceholderText('Select date')
    await userEvent.click(input)
    await userEvent.type(input, '01/15/2024')

    expect(setValue).not.toHaveBeenCalled()
    expect(input).toHaveValue('')
  })

  test('opens calendar popover when input is clicked', async () => {
    render(<CalendarInputView setValue={vi.fn()} />)

    await userEvent.click(screen.getByPlaceholderText('Select date'))

    expect(document.querySelector('.cn-popover-content')).toBeInTheDocument()
    expect(document.querySelector('.rdp')).toBeInTheDocument()
  })

  test('calls setValue when a date is selected from the calendar', async () => {
    const setValue = vi.fn()
    const value = '2024-01-01T00:00:00.000Z'
    const formattedValue = new Date(value).toLocaleDateString()

    render(<CalendarInputView value={value} setValue={setValue} />)

    await userEvent.click(screen.getByDisplayValue(formattedValue))

    await waitFor(() => {
      expect(document.querySelector('.rdp')).toBeInTheDocument()
    })

    const calendar = document.querySelector('.rdp')!
    const dayButton = Array.from(calendar.querySelectorAll('button')).find(button =>
      /^\d+$/.test(button.textContent?.trim() ?? '')
    )

    expect(dayButton).toBeDefined()
    await userEvent.click(dayButton!)

    expect(setValue).toHaveBeenCalled()
    expect(setValue.mock.calls[0][0]).toBeInstanceOf(Date)
  })
})
