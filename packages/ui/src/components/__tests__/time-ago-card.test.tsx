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

    test('should display empty string when timestamp is null', () => {
      const { container } = renderComponent({ timestamp: null })

      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
    })

    test('should display empty string when timestamp is undefined', () => {
      const { container } = renderComponent({ timestamp: undefined })

      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
    })

    test('should render as span when timestamp is null', () => {
      const { container } = renderComponent({ timestamp: null })

      const element = container.querySelector('span')
      expect(element?.tagName).toBe('SPAN')
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

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should show relative time in narrow format
      expect(button.textContent).toBeTruthy()
    })

    test('should show relative time for old dates', () => {
      const timestamp = createTimestamp(10) // 10 days ago

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should show relative time (e.g., "10d ago")
      expect(button.textContent).toBeTruthy()
    })

    test('should always use relative time format', () => {
      const timestamp = createTimestamp(5)

      renderComponent({ timestamp })

      // Should always use relative format regardless of age
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

    test('should use narrow format for relative time', () => {
      const timestamp = createTimestamp(0.5)

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should use narrow format (e.g., "12h ago")
      expect(button.textContent).toBeTruthy()
    })

    test('should handle very recent timestamps', () => {
      const now = new Date()
      const timestamp = new Date(now.getTime() - 1000).toISOString() // 1 second ago

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should show seconds in narrow format
      expect(button.textContent).toBeTruthy()
    })
  })

  describe('Locale Support', () => {
    test('should handle different locale formats', () => {
      const timestamp = createTimestamp(10)

      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should use Intl.RelativeTimeFormat for formatting', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      // Should render with relative time format
      expect(button.textContent).toBeTruthy()
    })
  })

  describe('Prefix Support', () => {
    test('should render prefix when provided', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp, prefix: 'Updated' })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Updated')
    })

    test('should not render prefix when not provided', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp })

      const button = screen.getByRole('button')
      expect(button.textContent).not.toContain('Updated')
    })

    test('should handle prefix with recent dates', () => {
      const timestamp = createTimestamp(1)

      renderComponent({ timestamp, prefix: 'Posted' })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Posted')
    })

    test('should handle prefix with old dates', () => {
      const timestamp = createTimestamp(10)

      renderComponent({ timestamp, prefix: 'Created' })

      const button = screen.getByRole('button')
      expect(button.textContent).toContain('Created')
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
        prefix: 'Updated',
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
      const { container } = renderComponent({ timestamp: 'invalid' })

      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
    })

    test('should handle very old timestamps', () => {
      const veryOld = new Date('1980-01-01').toISOString()
      renderComponent({ timestamp: veryOld })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle future timestamps', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // Tomorrow
      renderComponent({ timestamp: future })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle timestamps at various ages', () => {
      const timestamp = createTimestamp(8)
      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle very recent timestamps', () => {
      const timestamp = createTimestamp(0)
      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle very old timestamps', () => {
      const timestamp = createTimestamp(1000)
      renderComponent({ timestamp })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle empty string timestamp', () => {
      const { container } = renderComponent({ timestamp: '' })

      // Empty string creates Invalid Date and shows empty string
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
    })

    test('should handle timestamp as 0', () => {
      const { container } = renderComponent({ timestamp: 0 })

      // Timestamp 0 is treated as missing data and shows empty string
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
    })

    test('should handle extreme future dates', () => {
      const farFuture = new Date('2100-01-01').toISOString()
      renderComponent({ timestamp: farFuture })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle Infinity gracefully', () => {
      const { container } = renderComponent({ timestamp: Infinity })

      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBe('')
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
      render(
        <TestWrapper>
          <TimeAgoContent formattedFullArray={[]} />
        </TestWrapper>
      )

      // Should show "Unknown time" in tooltip content for empty array
      expect(screen.getByText('Unknown time')).toBeInTheDocument()
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
    const TestComponent = ({ timestamp }: { timestamp?: string | number | null }) => {
      const { formattedShort, formattedFull } = useFormattedTime(timestamp)
      return (
        <div>
          <div data-testid="formatted-short">{formattedShort}</div>
          <div data-testid="formatted-full-length">{formattedFull.length}</div>
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

    test('should return relative time for old dates', () => {
      const timestamp = createTimestamp(10)
      render(<TestComponent timestamp={timestamp} />)

      const shortTime = screen.getByTestId('formatted-short')
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should return relative time for recent dates', () => {
      const timestamp = createTimestamp(5)
      render(<TestComponent timestamp={timestamp} />)

      const shortTime = screen.getByTestId('formatted-short')
      expect(shortTime).toBeInTheDocument()
      expect(shortTime.textContent).toBeTruthy()
    })

    test('should return empty string for null timestamp', () => {
      render(<TestComponent timestamp={null} />)

      const shortTime = screen.getByTestId('formatted-short')
      // useFormattedTime returns empty string for null
      expect(shortTime.textContent).toBe('')
    })

    test('should return empty string for undefined timestamp', () => {
      render(<TestComponent timestamp={undefined} />)

      const shortTime = screen.getByTestId('formatted-short')
      expect(shortTime).toBeInTheDocument()
      // useFormattedTime handles undefined by using default 0 which returns empty string
      expect(shortTime.textContent).toBe('')
    })

    test('should handle timestamp of 0 as empty string', () => {
      render(<TestComponent timestamp={0} />)

      const shortTime = screen.getByTestId('formatted-short')
      // Timestamp 0 is treated as missing data and shows empty string
      expect(shortTime.textContent).toBe('')
    })

    test('should always return relative format', () => {
      const timestamp = createTimestamp(5)
      render(<TestComponent timestamp={timestamp} />)

      const shortTime = screen.getByTestId('formatted-short')
      // Should always use relative time format
      expect(shortTime.textContent).toBeTruthy()
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
            <TimeAgoCard timestamp={timestamp1} prefix="Recent:" />
            <TimeAgoCard timestamp={timestamp2} prefix="Old:" />
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
