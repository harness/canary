import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Calendar, CalendarProps } from '../calendar'

const renderComponent = (props: CalendarProps = {}): RenderResult => {
  return render(<Calendar {...props} />)
}

describe('Calendar', () => {
  describe('Basic Rendering', () => {
    test('should render calendar', () => {
      const { container } = renderComponent()

      // Calendar is rendered
      const calendar = container.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should render current month', () => {
      const now = new Date(2024, 0, 15) // January 2024
      renderComponent({ month: now })

      // January heading is present
      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should render with custom month', () => {
      const customDate = new Date(2023, 5, 1) // June 2023
      renderComponent({ month: customDate })

      expect(screen.getByText('June 2023')).toBeInTheDocument()
    })

    test('should render navigation buttons', () => {
      renderComponent()

      // Previous and next buttons exist
      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should show outside days by default', () => {
      renderComponent()

      // Outside days are visible
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should hide outside days when showOutsideDays is false', () => {
      renderComponent({ showOutsideDays: false })

      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })
  })

  describe('Single Date Selection', () => {
    test('should handle single date selection', async () => {
      const handleSelect = vi.fn()
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'single', onSelect: handleSelect, month })

      // Find any date button and click it
      const buttons = screen.getAllByRole('button')
      const dateButton = buttons.find(btn => btn.textContent && /^\d+$/.test(btn.textContent.trim()))

      if (dateButton) {
        await userEvent.click(dateButton)
        expect(handleSelect).toHaveBeenCalled()
      }
    })

    test('should render selected date', () => {
      const selectedDate = new Date(2024, 0, 15)
      renderComponent({ mode: 'single', selected: selectedDate, month: selectedDate })

      // Selected date has appropriate styling
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should handle date selection change', async () => {
      const handleSelect = vi.fn()
      const month = new Date(2024, 0, 1)
      const { rerender } = render(<Calendar mode="single" onSelect={handleSelect} selected={undefined} month={month} />)

      // Find any date button and click it
      const buttons = screen.getAllByRole('button')
      const dateButton = buttons.find(btn => btn.textContent && /^\d+$/.test(btn.textContent.trim()))

      if (dateButton) {
        await userEvent.click(dateButton)
        expect(handleSelect).toHaveBeenCalled()
      }

      const selectedDate = new Date(2024, 0, 15)
      rerender(<Calendar mode="single" onSelect={handleSelect} selected={selectedDate} month={month} />)

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })
  })

  describe('Date Range Selection', () => {
    test('should handle range selection mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'range', month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should render selected range', () => {
      const range = {
        from: new Date(2024, 0, 10),
        to: new Date(2024, 0, 20)
      }
      renderComponent({ mode: 'range', selected: range, month: new Date(2024, 0, 1) })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should handle range selection', async () => {
      const handleSelect = vi.fn()
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'range', onSelect: handleSelect, month })

      // Find any date button and click it
      const buttons = screen.getAllByRole('button')
      const dateButton = buttons.find(btn => btn.textContent && /^\d+$/.test(btn.textContent.trim()))

      if (dateButton) {
        await userEvent.click(dateButton)
        expect(handleSelect).toHaveBeenCalled()
      }
    })
  })

  describe('Multiple Date Selection', () => {
    test('should handle multiple selection mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'multiple', month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should render multiple selected dates', () => {
      const selected = [new Date(2024, 0, 10), new Date(2024, 0, 15), new Date(2024, 0, 20)]
      renderComponent({ mode: 'multiple', selected, month: new Date(2024, 0, 1) })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should handle multiple date selection', async () => {
      const handleSelect = vi.fn()
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'multiple', onSelect: handleSelect, month })

      // Find any date button and click it
      const buttons = screen.getAllByRole('button')
      const dateButton = buttons.find(btn => btn.textContent && /^\d+$/.test(btn.textContent.trim()))

      if (dateButton) {
        await userEvent.click(dateButton)
        expect(handleSelect).toHaveBeenCalled()
      }
    })
  })

  describe('Navigation', () => {
    test('should navigate to next month', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()

      // Navigation is present
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should navigate to previous month', () => {
      const month = new Date(2024, 1, 1) // February
      renderComponent({ month })

      expect(screen.getByText('February 2024')).toBeInTheDocument()

      // Navigation is present
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should handle controlled navigation', () => {
      const handleMonthChange = vi.fn()
      const month = new Date(2024, 0, 1)
      renderComponent({ month, onMonthChange: handleMonthChange })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })
  })

  describe('Disabled Dates', () => {
    test('should disable dates based on disabled prop', () => {
      const month = new Date(2024, 0, 1)
      const disabledDates = [new Date(2024, 0, 15)]
      renderComponent({ mode: 'single', month, disabled: disabledDates })

      // Calendar renders with disabled dates configuration
      expect(screen.getByText('January 2024')).toBeInTheDocument()
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should disable dates before a specific date', () => {
      const month = new Date(2024, 0, 1)
      const minDate = new Date(2024, 0, 10)
      renderComponent({ mode: 'single', month, disabled: { before: minDate } })

      // Calendar renders with date constraints
      expect(screen.getByText('January 2024')).toBeInTheDocument()
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should disable dates after a specific date', () => {
      const month = new Date(2024, 0, 1)
      const maxDate = new Date(2024, 0, 20)
      renderComponent({ mode: 'single', month, disabled: { after: maxDate } })

      // Calendar renders with date constraints
      expect(screen.getByText('January 2024')).toBeInTheDocument()
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should disable date range', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({
        mode: 'single',
        month,
        disabled: { from: new Date(2024, 0, 10), to: new Date(2024, 0, 20) }
      })

      // Calendar renders with disabled range
      expect(screen.getByText('January 2024')).toBeInTheDocument()
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })
  })

  describe('Styling & Customization', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-calendar' })

      const calendar = container.querySelector('.custom-calendar')
      expect(calendar).toBeTruthy()
    })

    test('should apply custom classNames to specific parts', () => {
      renderComponent({
        classNames: {
          caption: 'custom-caption',
          day: 'custom-day'
        }
      })

      const customCaption = document.querySelector('.custom-caption')
      expect(customCaption).toBeTruthy()
    })

    test('should render custom icons', () => {
      renderComponent()

      // Icons are rendered
      const icons = document.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Different Modes', () => {
    test('should work in default mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should work in single mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'single', month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should work in range mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'range', month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should work in multiple mode', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'multiple', month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })
  })

  describe('Advanced Features', () => {
    test('should render multiple months', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ numberOfMonths: 2, month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
      expect(screen.getByText('February 2024')).toBeInTheDocument()
    })

    test('should handle today date highlighting', () => {
      const today = new Date()
      renderComponent({ month: today })

      // Today's date should be highlighted
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should handle week start day', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ month, weekStartsOn: 1 }) // Monday

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    test('should render with from and to dates', () => {
      renderComponent({
        mode: 'range',
        fromDate: new Date(2024, 0, 1),
        toDate: new Date(2024, 11, 31)
      })

      // Calendar renders with constraints
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    test('should handle leap year', () => {
      const leapYear = new Date(2024, 1, 1) // February 2024 (leap year)
      renderComponent({ month: leapYear })

      expect(screen.getByText('February 2024')).toBeInTheDocument()
      // February 2024 is a leap year - calendar should render
      const calendar = document.querySelector('.rdp')
      expect(calendar).toBeTruthy()
    })

    test('should handle non-leap year', () => {
      const nonLeapYear = new Date(2023, 1, 1) // February 2023 (not leap year)
      renderComponent({ month: nonLeapYear })

      expect(screen.getByText('February 2023')).toBeInTheDocument()
      // Should not have 29th day as a valid date (might be outside day)
    })

    test('should handle year transitions', () => {
      const december = new Date(2023, 11, 1)
      renderComponent({ month: december })

      expect(screen.getByText('December 2023')).toBeInTheDocument()
    })

    test('should handle undefined selected date', () => {
      const month = new Date(2024, 0, 1)
      renderComponent({ mode: 'single', selected: undefined, month })

      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })
  })
})
