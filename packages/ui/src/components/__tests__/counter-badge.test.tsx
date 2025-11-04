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

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(CounterBadge.displayName).toBe('CounterBadge')
    })
  })

  describe('All Variant Combinations', () => {
    test('should render outline variant with all themes', () => {
      const themes: Array<'default' | 'info' | 'success' | 'danger'> = ['default', 'info', 'success', 'danger']

      themes.forEach(theme => {
        const { container } = render(
          <CounterBadge variant="outline" theme={theme}>
            {theme}
          </CounterBadge>
        )

        const badge = container.querySelector('.cn-badge-outline')
        expect(badge).toBeInTheDocument()
      })
    })

    test('should render secondary variant with all themes', () => {
      const themes: Array<'default' | 'info' | 'success' | 'danger'> = ['default', 'info', 'success', 'danger']

      themes.forEach(theme => {
        const { container } = render(
          <CounterBadge variant="secondary" theme={theme}>
            {theme}
          </CounterBadge>
        )

        const badge = container.querySelector('.cn-badge-secondary')
        expect(badge).toBeInTheDocument()
      })
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when variant changes', () => {
      const { container, rerender } = render(<CounterBadge variant="outline">5</CounterBadge>)

      let badge = container.querySelector('.cn-badge-outline')
      expect(badge).toBeInTheDocument()

      rerender(<CounterBadge variant="secondary">5</CounterBadge>)

      badge = container.querySelector('.cn-badge-secondary')
      expect(badge).toBeInTheDocument()
    })

    test('should update when theme changes', () => {
      const { container, rerender } = render(<CounterBadge theme="default">5</CounterBadge>)

      let badge = container.querySelector('.cn-badge-muted')
      expect(badge).toBeInTheDocument()

      rerender(<CounterBadge theme="info">5</CounterBadge>)

      badge = container.querySelector('.cn-badge-info')
      expect(badge).toBeInTheDocument()
    })

    test('should update when children change', () => {
      const { rerender } = render(<CounterBadge>5</CounterBadge>)

      expect(screen.getByText('5')).toBeInTheDocument()

      rerender(<CounterBadge>10</CounterBadge>)

      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.queryByText('5')).not.toBeInTheDocument()
    })

    test('should update when className changes', () => {
      const { container, rerender } = render(<CounterBadge className="class1">5</CounterBadge>)

      let badge = container.querySelector('.class1')
      expect(badge).toBeInTheDocument()

      rerender(<CounterBadge className="class2">5</CounterBadge>)

      badge = container.querySelector('.class2')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should use outline variant by default', () => {
      const { container } = render(<CounterBadge>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge-outline')
      expect(badge).toBeInTheDocument()
    })

    test('should use default theme by default', () => {
      const { container } = render(<CounterBadge>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge-muted')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle negative numbers', () => {
      render(<CounterBadge>-5</CounterBadge>)

      expect(screen.getByText('-5')).toBeInTheDocument()
    })

    test('should handle very large numbers', () => {
      render(<CounterBadge>9999</CounterBadge>)

      expect(screen.getByText('9999')).toBeInTheDocument()
    })

    test('should handle special text content', () => {
      render(<CounterBadge>New!</CounterBadge>)

      expect(screen.getByText('New!')).toBeInTheDocument()
    })

    test('should handle mixed content with elements', () => {
      render(
        <CounterBadge>
          <span>Count: </span>
          <strong>5</strong>
        </CounterBadge>
      )

      expect(screen.getByText('Count:')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    test('should handle undefined children', () => {
      const { container } = render(<CounterBadge>{undefined}</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })

    test('should handle boolean children', () => {
      const { container } = render(<CounterBadge>{false}</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward title attribute', () => {
      const { container } = render(<CounterBadge title="Badge title">5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toHaveAttribute('title', 'Badge title')
    })

    test('should forward data attributes', () => {
      render(
        <CounterBadge data-testid="custom-badge" data-value="test">
          5
        </CounterBadge>
      )

      const badge = screen.getByTestId('custom-badge')
      expect(badge).toHaveAttribute('data-value', 'test')
    })

    test('should forward aria-live', () => {
      const { container } = render(<CounterBadge aria-live="polite">5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Class Name Combinations', () => {
    test('should combine multiple custom classes', () => {
      const { container } = render(<CounterBadge className="class1 class2 class3">5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toHaveClass('class1')
      expect(badge).toHaveClass('class2')
      expect(badge).toHaveClass('class3')
    })

    test('should combine custom class with variant classes', () => {
      const { container } = render(
        <CounterBadge className="custom" variant="secondary" theme="success">
          5
        </CounterBadge>
      )

      const badge = container.querySelector('.cn-badge')
      expect(badge).toHaveClass('custom')
      expect(badge).toHaveClass('cn-badge-secondary')
      expect(badge).toHaveClass('cn-badge-success')
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      const ref = vi.fn()
      const { container } = render(
        <CounterBadge
          ref={ref}
          variant="secondary"
          theme="info"
          className="complex-badge"
          id="complex-id"
          data-testid="complex-test"
          aria-label="Notification count"
          style={{ padding: '5px' }}
        >
          42
        </CounterBadge>
      )

      const badge = container.querySelector('#complex-id')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('complex-badge')
      expect(badge).toHaveClass('cn-badge-secondary')
      expect(badge).toHaveClass('cn-badge-info')
      expect(badge).toHaveAttribute('aria-label', 'Notification count')
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Omitted Props', () => {
    test('should omit color prop', () => {
      // color is omitted from the type definition
      const { container } = render(<CounterBadge>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })

    test('should omit role prop', () => {
      // role is omitted from the type definition
      const { container } = render(<CounterBadge>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })

    test('should omit onClick prop', () => {
      // onClick is omitted from the type definition
      const { container } = render(<CounterBadge>5</CounterBadge>)

      const badge = container.querySelector('.cn-badge')
      expect(badge).toBeInTheDocument()
    })
  })
})
