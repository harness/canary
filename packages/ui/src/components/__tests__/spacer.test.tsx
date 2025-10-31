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
    test('should render without size prop', () => {
      const { container } = renderComponent()

      const spacer = container.querySelector('[aria-hidden="true"]')
      expect(spacer).toBeInTheDocument()
    })

    test('should handle all valid size values', () => {
      const sizes = [1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 20] as const

      sizes.forEach(size => {
        const { container } = renderComponent({ size })
        const spacer = container.querySelector('[aria-hidden="true"]')
        expect(spacer).toBeInTheDocument()
      })
    })
  })
})

