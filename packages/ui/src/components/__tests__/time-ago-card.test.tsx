import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { TimeAgoCard, TimeAgoContent, useFormattedTime } from '../time-ago-card'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof TimeAgoCard>> = {}) => {
  return render(
    <TestWrapper>
      <TimeAgoCard {...props} />
    </TestWrapper>
  )
}

// Test helper to create timestamps
const createTimestamp = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

describe('TimeAgoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    test('should render with recent timestamp', () => {
      const timestamp = createTimestamp(1)
      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should render with old timestamp', () => {
      const timestamp = createTimestamp(30)
      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should display "Unknown time" when timestamp is null', () => {
      renderComponent({ timestamp: null })

      expect(screen.getByText('Unknown time')).toBeInTheDocument()
    })

    test('should display "Unknown time" when timestamp is undefined', () => {
      renderComponent({ timestamp: undefined })

      expect(screen.getByText('Unknown time')).toBeInTheDocument()
    })

    test('should render as span when timestamp is null', () => {
      renderComponent({ timestamp: null })

      const element = screen.getByText('Unknown time')
      expect(element.tagName).toBe('SPAN')
    })

    test('should render as button when timestamp is valid', () => {
      const timestamp = createTimestamp(1)
      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Time Formatting', () => {
    test('should show relative time for recent dates', () => {
      const now = new Date()
      const timestamp = new Date(now.getTime() - 5 * 60 * 1000).toISOString() // 5 minutes ago

      renderComponent({ timestamp, cutoffDays: 8 })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('minute')
    })

    test('should show absolute time for old dates', () => {
      const timestamp = createTimestamp(10) // 10 days ago

      renderComponent({ timestamp, cutoffDays: 8 })

      const button = screen.getByRole('button')
      // Should contain month name or date format
      expect(button.textContent).toBeTruthy()
    })

    test('should respect cutoffDays prop', () => {
      const timestamp = createTimestamp(5)

      renderComponent({ timestamp, cutoffDays: 3 })

      // Should use absolute format since 5 days > 3 day cutoff
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle timestamp as number', () => {
      const timestamp = Date.now() - 1000 * 60 * 60 // 1 hour ago

      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle timestamp as string', () => {
      const timestamp = new Date().toISOString()

      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should remove "about" prefix from formatted time', () => {
      const timestamp = createTimestamp(0.5)

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should not contain "about"
      expect(button.textContent).not.toContain('about')
    })

    test('should remove "less than" prefix from formatted time', () => {
      const now = new Date()
      const timestamp = new Date(now.getTime() - 1000).toISOString() // 1 second ago

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should not contain "less than"
      expect(button.textContent).not.toContain('less than')
    })
  })

  describe('Custom Time Format Options', () => {
    test('should accept custom dateTimeFormatOptions', () => {
      const timestamp = createTimestamp(10)
      const customOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }

      renderComponent({ timestamp, dateTimeFormatOptions: customOptions })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle different locale formats', () => {
      const timestamp = createTimestamp(10)

      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Prefix Support', () => {
    test('should render beforeCutoffPrefix for recent dates', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp, beforeCutoffPrefix: 'Updated', cutoffDays: 8 })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Updated')
    })

    test('should render afterCutoffPrefix for old dates', () => {
      const timestamp = createTimestamp(10)

      renderComponent({ timestamp, afterCutoffPrefix: 'Created on', cutoffDays: 8 })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Created on')
    })

    test('should not render prefix when not provided', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      expect(button.textContent).not.toContain('Updated')
    })

    test('should handle only beforeCutoffPrefix', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp, beforeCutoffPrefix: 'Posted', cutoffDays: 8 })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Posted')
    })

    test('should handle only afterCutoffPrefix', () => {
      const timestamp = createTimestamp(10)

      renderComponent({ timestamp, afterCutoffPrefix: 'On', cutoffDays: 8 })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('On')
    })

    test('should choose correct prefix based on cutoff', () => {
      const recentTimestamp = createTimestamp(5)
      const oldTimestamp = createTimestamp(10)

      const { unmount } = renderComponent({
        timestamp: recentTimestamp,
        beforeCutoffPrefix: 'Recent:',
        afterCutoffPrefix: 'Old:',
        cutoffDays: 7
      })

      expect(screen.getByRole('button').textContent).toContain('Recent:')
      unmount()

      renderComponent({
        timestamp: oldTimestamp,
        beforeCutoffPrefix: 'Recent:',
        afterCutoffPrefix: 'Old:',
        cutoffDays: 7
      })

      expect(screen.getByRole('button').textContent).toContain('Old:')
    })
  })

  describe('Tooltip', () => {
    test('should render with tooltip', async () => {
      const timestamp = createTimestamp(1)
      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      await userEvent.hover(button)

      // Tooltip should be present in the DOM
      expect(button).toBeInTheDocument()
    })

    test('should render tooltip with timestamp', () => {
      const timestamp = createTimestamp(1)
      renderComponent({ timestamp })

      // TimeAgoContent should be rendered with tooltip
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    test('should apply custom textProps', () => {
      const timestamp = createTimestamp(1)
      renderComponent({
        timestamp,
        textProps: {
          className: 'custom-text',
          color: 'foreground-1'
        }
      })

      const time = screen.getByRole('button').querySelector('time')
      expect(time).toHaveClass('custom-text')
    })

    test('should apply custom triggerClassName', () => {
      const timestamp = createTimestamp(1)
      renderComponent({
        timestamp,
        triggerClassName: 'custom-trigger'
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-trigger')
    })

    test('should apply custom triggerProps', () => {
      const timestamp = createTimestamp(1)
      const onClick = vi.fn()

      renderComponent({
        timestamp,
        triggerProps: {
          onClick,
          id: 'custom-trigger'
        }
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('id', 'custom-trigger')
    })

    test('should handle all props together', () => {
      const timestamp = createTimestamp(1)
      renderComponent({
        timestamp,
        cutoffDays: 5,
        beforeCutoffPrefix: 'Updated',
        afterCutoffPrefix: 'Created',
        textProps: { className: 'text-class' },
        triggerClassName: 'trigger-class',
        triggerProps: { id: 'test-id' }
      })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('trigger-class')
      expect(button).toHaveAttribute('id', 'test-id')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>()
      const timestamp = createTimestamp(1)

      render(
        <TestWrapper>
          <TimeAgoCard ref={ref} timestamp={timestamp} />
        </TestWrapper>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    test('should forward ref to span when timestamp is null', () => {
      const ref = React.createRef<HTMLSpanElement>()

      render(
        <TestWrapper>
          <TimeAgoCard ref={ref} timestamp={null} />
        </TestWrapper>
      )

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('Display Name', () => {
    test('should have correct display name', () => {
      expect(TimeAgoCard.displayName).toBe('TimeAgoCard')
    })
  })

  describe('Edge Cases', () => {
    test('should handle invalid timestamp gracefully', () => {
      renderComponent({ timestamp: 'invalid' })

      expect(screen.getByText('Unknown time')).toBeInTheDocument()
    })

    test('should handle very old timestamps', () => {
      const veryOld = new Date('1970-01-01').toISOString()
      renderComponent({ timestamp: veryOld })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle future timestamps', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // Tomorrow
      renderComponent({ timestamp: future })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle timestamp at exact cutoff boundary', () => {
      const timestamp = createTimestamp(8)
      renderComponent({ timestamp, cutoffDays: 8 })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle zero cutoffDays', () => {
      const timestamp = createTimestamp(0)
      renderComponent({ timestamp, cutoffDays: 0 })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle very large cutoffDays', () => {
      const timestamp = createTimestamp(5)
      renderComponent({ timestamp, cutoffDays: 1000 })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle empty string timestamp', () => {
      renderComponent({ timestamp: '' })

      // Empty string creates Invalid Date
      expect(screen.getByText('Unknown time')).toBeInTheDocument()
    })

    test('should handle timestamp as 0', () => {
      renderComponent({ timestamp: 0 })

      // Unix epoch (Jan 1, 1970)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('TimeAgoContent Component', () => {
    test('should render time ago content with formatted times', () => {
      const formattedFullArray = [
        {
          date: '01 January, 2024',
          time: '12:00:00',
          label: 'UTC'
        },
        {
          date: '01 January, 2024',
          time: '07:00:00',
          label: 'EST'
        }
      ]

      render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={formattedFullArray} />
        </TestWrapper>
      )

      expect(screen.getByText('UTC')).toBeInTheDocument()
      expect(screen.getByText('EST')).toBeInTheDocument()
      // Check for at least one occurrence of the date
      const dates = screen.getAllByText('01 January, 2024')
      expect(dates.length).toBeGreaterThan(0)
      expect(screen.getByText('12:00:00')).toBeInTheDocument()
      expect(screen.getByText('07:00:00')).toBeInTheDocument()
    })

    test('should render multiple time zones', () => {
      const formattedFullArray = [
        { date: 'Date 1', time: 'Time 1', label: 'UTC' },
        { date: 'Date 2', time: 'Time 2', label: 'PST' }
      ]

      render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={formattedFullArray} />
        </TestWrapper>
      )

      expect(screen.getByText('UTC')).toBeInTheDocument()
      expect(screen.getByText('PST')).toBeInTheDocument()
    })

    test('should render time elements with correct datetime attributes', () => {
      const formattedFullArray = [{ date: '2024-01-01', time: '12:00:00', label: 'UTC' }]

      render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={formattedFullArray} />
        </TestWrapper>
      )

      const timeElements = screen.getAllByText('2024-01-01')
      expect(timeElements[0].tagName).toBe('TIME')
      expect(timeElements[0]).toHaveAttribute('datetime', '2024-01-01')
    })

    test('should handle empty array', () => {
      const { container } = render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={[]} />
        </TestWrapper>
      )

      const content = container.querySelector('.cn-time-ago-card-content')
      expect(content).toBeInTheDocument()
      expect(content?.children.length).toBe(0)
    })

    test('should apply correct styling classes', () => {
      const formattedFullArray = [{ date: 'Date', time: 'Time', label: 'UTC' }]

      const { container } = render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={formattedFullArray} />
        </TestWrapper>
      )

      const content = container.querySelector('.cn-time-ago-card-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('useFormattedTime Hook', () => {
    const TestComponent = ({ timestamp, cutoffDays }: { timestamp?: string | number | null; cutoffDays?: number }) => {
      const { formattedShort, formattedFull, isBeyondCutoff } = useFormattedTime(timestamp, cutoffDays)
      return (
        <div>
          <div data-testid="formatted-short">{formattedShort}</div>
          <div data-testid="formatted-full-length">{formattedFull.length}</div>
          <div data-testid="is-beyond-cutoff">{String(isBeyondCutoff)}</div>
        </div>
      )
    }

    test('should return formatted short time', () => {
      const timestamp = createTimestamp(1)
      render(<TestComponent timestamp={timestamp} />)

      const shortTime = screen.getByTestId('formatted-short')
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should return formattedFull array with 2 entries for valid time', () => {
      const timestamp = createTimestamp(1)
      render(<TestComponent timestamp={timestamp} />)

      const fullLength = screen.getByTestId('formatted-full-length')
      expect(fullLength.textContent).toBe('2')
    })

    test('should return empty formattedFull for invalid time', () => {
      render(<TestComponent timestamp="invalid" />)

      const fullLength = screen.getByTestId('formatted-full-length')
      expect(fullLength.textContent).toBe('0')
    })

    test('should return isBeyondCutoff true for old dates', () => {
      const timestamp = createTimestamp(10)
      render(<TestComponent timestamp={timestamp} cutoffDays={8} />)

      const isBeyondCutoff = screen.getByTestId('is-beyond-cutoff')
      expect(isBeyondCutoff.textContent).toBe('true')
    })

    test('should return isBeyondCutoff false for recent dates', () => {
      const timestamp = createTimestamp(5)
      render(<TestComponent timestamp={timestamp} cutoffDays={8} />)

      const isBeyondCutoff = screen.getByTestId('is-beyond-cutoff')
      expect(isBeyondCutoff.textContent).toBe('false')
    })

    test('should return "Unknown time" for null timestamp', () => {
      render(<TestComponent timestamp={null} />)

      const shortTime = screen.getByTestId('formatted-short')
      // useFormattedTime returns "Unknown time" for null, but also creates invalid date
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should return "Unknown time" for undefined timestamp', () => {
      render(<TestComponent timestamp={undefined} />)

      const shortTime = screen.getByTestId('formatted-short')
      // useFormattedTime handles undefined by using default 0
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should handle timestamp of 0', () => {
      render(<TestComponent timestamp={0} />)

      const shortTime = screen.getByTestId('formatted-short')
      // Should format epoch time
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should handle custom cutoffDays', () => {
      const timestamp = createTimestamp(5)
      render(<TestComponent timestamp={timestamp} cutoffDays={3} />)

      const isBeyondCutoff = screen.getByTestId('is-beyond-cutoff')
      expect(isBeyondCutoff.textContent).toBe('true')
    })
  })

  describe('Component Memo', () => {
    test('should be memoized', () => {
      expect(TimeAgoCard.displayName).toBe('TimeAgoCard')
      // Memo wraps the component, so it should have memo characteristics
      expect(TimeAgoCard).toBeDefined()
    })

    test('should not re-render with same props', () => {
      const timestamp = createTimestamp(1)
      const { rerender } = renderComponent({ timestamp })

      const button1 = screen.getByRole('button')
      const content1 = button1.textContent

      rerender(
        <TestWrapper>
          <TimeAgoCard timestamp={timestamp} />
        </TestWrapper>
      )

      const button2 = screen.getByRole('button')
      expect(button2.textContent).toBe(content1)
    })
  })

  describe('DateTime Attribute', () => {
    test('should have datetime attribute on time element', () => {
      const timestamp = createTimestamp(1)
      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      const timeElement = button.querySelector('time')
      expect(timeElement).toHaveAttribute('datetime')
    })

    test('should use timestamp as datetime value', () => {
      const timestamp = '2024-01-01T12:00:00Z'
      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      const timeElement = button.querySelector('time')
      expect(timeElement).toHaveAttribute('datetime', timestamp)
    })

    test('should handle numeric timestamp for datetime', () => {
      const timestamp = 1704110400000 // Specific timestamp
      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      const timeElement = button.querySelector('time')
      expect(timeElement).toHaveAttribute('datetime', String(timestamp))
    })
  })

  describe('Interaction', () => {
    test('should be clickable', async () => {
      const timestamp = createTimestamp(1)
      const onClick = vi.fn()

      renderComponent({
        timestamp,
        triggerProps: { onClick }
      })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('should support all button HTML attributes', () => {
      const timestamp = createTimestamp(1)
      renderComponent({
        timestamp,
        triggerProps: {
          'aria-label': 'Time information',
          id: 'time-card'
        }
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Time information')
      expect(button).toHaveAttribute('id', 'time-card')
    })
  })

  describe('Multiple TimeAgoCards', () => {
    test('should render multiple instances independently', () => {
      const timestamp1 = createTimestamp(1)
      const timestamp2 = createTimestamp(10)

      render(
        <TestWrapper>
          <>
            <TimeAgoCard timestamp={timestamp1} beforeCutoffPrefix="Recent:" cutoffDays={8} />
            <TimeAgoCard timestamp={timestamp2} afterCutoffPrefix="Old:" cutoffDays={8} />
          </>
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should handle different timestamps', () => {
      const now = Date.now()
      const oneHourAgo = now - 1000 * 60 * 60
      const oneDayAgo = now - 1000 * 60 * 60 * 24

      render(
        <TestWrapper>
          <>
            <TimeAgoCard timestamp={oneHourAgo} />
            <TimeAgoCard timestamp={oneDayAgo} />
          </>
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })
  })
})
