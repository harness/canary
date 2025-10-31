import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { CounterBadge } from '../counter-badge'

const renderComponent = (props: Partial<React.ComponentProps<typeof CounterBadge>> = {}): RenderResult => {
  return render(<CounterBadge {...props}>5</CounterBadge>)
}

describe('CounterBadge', () => {
  describe('Basic Rendering', () => {
    test('should render counter badge', () => {
      renderComponent()

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    test('should render with custom content', () => {
      render(<CounterBadge>99+</CounterBadge>)

      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    test('should render with numeric content', () => {
      render(<CounterBadge>{10}</CounterBadge>)

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    test('should apply base badge classes', () => {
      const { container } = renderComponent()

      const badge = container.querySelector('.cn-badge.cn-badge-counter')
      expect(badge).toBeInTheDocument()
    })

    test('should apply inline-flex and w-fit', () => {
      const { container } = renderComponent()

      const badge = container.querySelector('.inline-flex.w-fit.items-center')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    test('should apply outline variant by default', () => {
      const { container } = renderComponent()

      const badge = container.querySelector('.cn-badge-outline')
      expect(badge).toBeInTheDocument()
    })

    test('should apply secondary variant', () => {
      const { container } = renderComponent({ variant: 'secondary' })

      const badge = container.querySelector('.cn-badge-secondary')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Themes', () => {
    test('should apply default (muted) theme by default', () => {
      const { container } = renderComponent()

      const badge = container.querySelector('.cn-badge-muted')
      expect(badge).toBeInTheDocument()
    })

    test('should apply info theme', () => {
      const { container } = renderComponent({ theme: 'info' })

      const badge = container.querySelector('.cn-badge-info')
      expect(badge).toBeInTheDocument()
    })

    test('should apply success theme', () => {
      const { container } = renderComponent({ theme: 'success' })

      const badge = container.querySelector('.cn-badge-success')
      expect(badge).toBeInTheDocument()
    })

    test('should apply danger theme', () => {
      const { container } = renderComponent({ theme: 'danger' })

      const badge = container.querySelector('.cn-badge-danger')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Variant & Theme Combinations', () => {
    test('should combine outline variant with info theme', () => {
      const { container } = renderComponent({ variant: 'outline', theme: 'info' })

      const badge = container.querySelector('.cn-badge-outline.cn-badge-info')
      expect(badge).toBeInTheDocument()
    })

    test('should combine secondary variant with success theme', () => {
      const { container } = renderComponent({ variant: 'secondary', theme: 'success' })

      const badge = container.querySelector('.cn-badge-secondary.cn-badge-success')
      expect(badge).toBeInTheDocument()
    })

    test('should combine outline variant with danger theme', () => {
      const { container } = renderComponent({ variant: 'outline', theme: 'danger' })

      const badge = container.querySelector('.cn-badge-outline.cn-badge-danger')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-badge' })

      const badge = container.querySelector('.custom-badge')
      expect(badge).toBeInTheDocument()
    })

    test('should combine custom className with variants', () => {
      const { container } = renderComponent({
        className: 'extra-class',
        variant: 'secondary',
        theme: 'info'
      })

      const badge = container.querySelector('.extra-class')
      expect(badge).toBeInTheDocument()
      const themedBadge = container.querySelector('.cn-badge-secondary.cn-badge-info')
      expect(themedBadge).toBeInTheDocument()
    })
  })

  describe('Children Content', () => {
    test('should render text children', () => {
      render(<CounterBadge>New</CounterBadge>)

      expect(screen.getByText('New')).toBeInTheDocument()
    })

    test('should render numeric children', () => {
      render(<CounterBadge>{0}</CounterBadge>)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    test('should render ReactNode children', () => {
      render(
        <CounterBadge>
          <span data-testid="custom-content">Custom</span>
        </CounterBadge>
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    test('should handle large numbers', () => {
      render(<CounterBadge>999+</CounterBadge>)

      expect(screen.getByText('999+')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref', () => {
      const ref = vi.fn()

      render(<CounterBadge ref={ref}>5</CounterBadge>)

      expect(ref).toHaveBeenCalled()
    })

    test('should provide access to DOM element through ref', () => {
      const ref = { current: null as HTMLDivElement | null }

      render(<CounterBadge ref={ref}>5</CounterBadge>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('HTML Attributes', () => {
    test('should pass through HTML attributes', () => {
      const { container } = render(
        <CounterBadge data-testid="badge" id="test-badge">
          5
        </CounterBadge>
      )

      const badge = container.querySelector('#test-badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute('data-testid', 'badge')
    })

    test('should handle aria attributes', () => {
      const { container } = render(<CounterBadge aria-label="Notification count">3</CounterBadge>)

      const badge = container.querySelector('[aria-label="Notification count"]')
      expect(badge).toBeInTheDocument()
    })

    test('should handle style attribute', () => {
      const { container } = render(<CounterBadge style={{ marginLeft: '10px' }}>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toHaveStyle({ marginLeft: '10px' })
    })
  })

  describe('Edge Cases', () => {
    test('should render with zero count', () => {
      render(<CounterBadge>0</CounterBadge>)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    test('should render with empty content', () => {
      const { container } = render(<CounterBadge>{''}</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })

    test('should render with null children', () => {
      const { container } = render(<CounterBadge>{null}</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })
  })
})
