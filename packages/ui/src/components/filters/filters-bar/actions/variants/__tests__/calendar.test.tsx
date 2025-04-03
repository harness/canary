import { ComponentProps } from 'react'

import { fireEvent, render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { vi } from 'vitest'

import { FilterField } from '../../../../types'
import Calendar from '../calendar-field'

const FILTER_TYPE = 'date' as const
const mockDate = new Date('2024-03-27')
const mockFilter: FilterField<Date> = { value: mockDate, type: FILTER_TYPE }
const mockOnUpdateFilter = vi.fn()

const renderComponent = (props: Partial<ComponentProps<typeof Calendar>> = {}): RenderResult =>
  render(
    <Calendar
      filter={{ value: props.filter?.value || mockFilter.value, type: FILTER_TYPE }}
      onUpdateFilter={props.onUpdateFilter || mockOnUpdateFilter}
    />
  )

describe('Calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('it should render with default props', () => {
    renderComponent()

    // Check if input is rendered with formatted date
    const input = screen.getByPlaceholderText('DD/MM/YYYY')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(format(mockDate, 'dd/MM/yyyy'))

    // Check if calendar is rendered
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  test('it should handle valid date input', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText('DD/MM/YYYY')

    // Type a valid date
    await userEvent.clear(input)
    await userEvent.type(input, '25/03/2024')
    fireEvent.blur(input)

    // Check if onUpdateFilter was called with correct date
    expect(mockOnUpdateFilter).toHaveBeenCalledWith(new Date('2024-03-25'))
    expect(input).not.toHaveClass('border-borders-danger')
  })

  test('it should handle invalid date input', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText('DD/MM/YYYY')

    // Type an invalid date
    await userEvent.clear(input)
    await userEvent.type(input, '35/13/2024')
    fireEvent.blur(input)

    // Check if error state is applied
    expect(input).toHaveClass('border-borders-danger')
    expect(mockOnUpdateFilter).toHaveBeenCalledWith(undefined)
  })

  test('it should handle empty input', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText('DD/MM/YYYY')

    // Clear the input
    await userEvent.clear(input)
    fireEvent.blur(input)

    // Check if error state is not applied for empty input
    expect(input).not.toHaveClass('border-borders-danger')
    expect(mockOnUpdateFilter).toHaveBeenCalledWith(undefined)
  })

  test('it should handle date selection from calendar', () => {
    renderComponent()

    // Click on a date in the calendar
    const dateButton = screen.getByRole('button', { name: '27 March 2024' })
    fireEvent.click(dateButton)

    // Check if input is updated and onUpdateFilter is called
    const input = screen.getByPlaceholderText('DD/MM/YYYY')
    expect(input).toHaveValue('27/03/2024')
    expect(mockOnUpdateFilter).toHaveBeenCalledWith(new Date('2024-03-27'))
  })

  test('it should handle Enter key press', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText('DD/MM/YYYY')

    // Type a date and press Enter
    await userEvent.clear(input)
    await userEvent.type(input, '26/03/2024{enter}')

    // Check if onUpdateFilter was called
    expect(mockOnUpdateFilter).toHaveBeenCalledWith(new Date('2024-03-26'))
  })
})
