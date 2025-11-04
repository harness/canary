import { render, RenderResult } from '@testing-library/react'

import { Spacer } from '../spacer'

const renderComponent = (props: Partial<React.ComponentProps<typeof Spacer>> = {}): RenderResult => {
  return render(<Spacer {...props} />)
}

describe('Spacer', () => {
  describe('Basic Rendering', () => {
    test('should render spacer', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply default size 4', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-4)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should be aria-hidden', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should render as div element', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('div[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    test('should apply size 1', () => {
      const { container } = renderComponent({ size: 1 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-1)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply size 2', () => {
      const { container } = renderComponent({ size: 2 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-2)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply size 3', () => {
      const { container } = renderComponent({ size: 3 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-3)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply size 5', () => {
      const { container } = renderComponent({ size: 5 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-5)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply size 10', () => {
      const { container } = renderComponent({ size: 10 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-10)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply size 20', () => {
      const { container } = renderComponent({ size: 20 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-20)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply fractional size 1.5', () => {
      const { container } = renderComponent({ size: 1.5 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-1-half)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply fractional size 2.5', () => {
      const { container } = renderComponent({ size: 2.5 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-2-half)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should apply fractional size 4.5', () => {
      const { container } = renderComponent({ size: 4.5 })

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-4-half)]"]')
      expect(spacer).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-spacer' })

      const spacer = container.querySelector('.custom-spacer')
      expect(spacer).toBeInTheDocument()
    })

    test('should combine size and className', () => {
      const { container } = renderComponent({ size: 8, className: 'extra-class' })

      const spacer = container.querySelector('.extra-class')
      expect(spacer).toBeInTheDocument()
      const sizedSpacer = container.querySelector('[class*="mt-[var(--cn-spacing-8)]"]')
      expect(sizedSpacer).toBeInTheDocument()
    })
  })

  describe('HTML Attributes', () => {
    test('should pass through additional props', () => {
      const { container } = render(<Spacer data-testid="spacer" id="test-spacer" />)

      const spacer = container.querySelector('#test-spacer')
      expect(spacer).toBeInTheDocument()
      expect(spacer).toHaveAttribute('data-testid', 'spacer')
    })

    test('should handle style attribute', () => {
      const { container } = render(<Spacer style={{ backgroundColor: 'red' }} />)

      const spacer = container.querySelector('[aria-hidden="true"]')
      expect(spacer).toHaveAttribute('style')
    })
  })

  describe('Edge Cases', () => {
    test('should render without size prop and use default', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should handle all valid integer size values', () => {
      const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 20] as const

      sizes.forEach(size => {
        const { container, unmount } = renderComponent({ size })
        const spacer = container.querySelector('[aria-hidden="true"]')
        expect(spacer).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle all valid fractional size values', () => {
      const sizes = [1.5, 2.5, 4.5] as const

      sizes.forEach(size => {
        const { container, unmount } = renderComponent({ size })
        const spacer = container.querySelector('[aria-hidden="true"]')
        expect(spacer).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle size with className', () => {
      const { container } = renderComponent({ size: 6, className: 'custom' })

      const spacer = container.querySelector('.custom')
      expect(spacer).toBeInTheDocument()
      const sizedSpacer = container.querySelector('[class*="mt-[var(--cn-spacing-6)]"]')
      expect(sizedSpacer).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Spacer.displayName).toBe('Spacer')
    })
  })

  describe('Re-rendering', () => {
    test('should update when size changes', () => {
      const { container, rerender } = render(<Spacer size={2} />)

      let spacer = container.querySelector('[class*="mt-[var(--cn-spacing-2)]"]')
      expect(spacer).toBeInTheDocument()

      rerender(<Spacer size={5} />)

      spacer = container.querySelector('[class*="mt-[var(--cn-spacing-5)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should update when className changes', () => {
      const { container, rerender } = render(<Spacer className="class-1" />)

      let spacer = container.querySelector('.class-1')
      expect(spacer).toBeInTheDocument()

      rerender(<Spacer className="class-2" />)

      spacer = container.querySelector('.class-2')
      expect(spacer).toBeInTheDocument()
      expect(container.querySelector('.class-1')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should always have aria-hidden attribute', () => {
      renderComponent()

      const spacer = document.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should be aria-hidden even with custom props', () => {
      renderComponent({ size: 10, className: 'custom' })

      const spacer = document.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default to size 4 when not specified', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[class*="mt-[var(--cn-spacing-4)]"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should render as div element by default', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('div[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })
  })

  describe('Additional Props Forwarding', () => {
    test('should forward data attributes', () => {
      const { container } = render(<Spacer data-testid="spacer-test" data-custom="value" />)

      const spacer = container.querySelector('[data-testid="spacer-test"]')
      expect(spacer).toBeInTheDocument()
      expect(spacer).toHaveAttribute('data-custom', 'value')
    })

    test('should forward role attribute', () => {
      const { container } = render(<Spacer role="presentation" />)

      const spacer = container.querySelector('[role="presentation"]')
      expect(spacer).toBeInTheDocument()
    })
  })
})
