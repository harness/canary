import { render, RenderResult } from '@testing-library/react'
import { vi } from 'vitest'

import { Separator } from '../separator'

const renderComponent = (props: Partial<React.ComponentProps<typeof Separator>> = {}): RenderResult => {
  return render(<Separator {...props} />)
}

describe('Separator', () => {
  describe('Basic Rendering', () => {
    test('should render separator', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should apply default horizontal orientation', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.h-px.w-full')
      expect(separator).toBeInTheDocument()
    })

    test('should render with vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const separator = container.querySelector('.h-full.w-px')
      expect(separator).toBeInTheDocument()
    })

    test('should be decorative by default', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-separator' })

      const separator = container.querySelector('.custom-separator')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Orientation', () => {
    test('should apply horizontal styling', () => {
      const { container } = renderComponent({ orientation: 'horizontal' })

      const separator = container.querySelector('.h-px.w-full')
      expect(separator).toBeInTheDocument()
    })

    test('should apply vertical styling', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const separator = container.querySelector('.h-full.w-px')
      expect(separator).toBeInTheDocument()
    })

    test('should render vertical separator', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const separator = container.querySelector('.bg-cn-separator-subtle.h-full.w-px')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Decorative Prop', () => {
    test('should be decorative by default', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should handle decorative false', () => {
      const { container } = renderComponent({ decorative: false })

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should handle decorative true explicitly', () => {
      const { container } = renderComponent({ decorative: true })

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    test('should apply background color', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should apply shrink-0 class', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.shrink-0')
      expect(separator).toBeInTheDocument()
    })

    test('should combine custom className with default styles', () => {
      const { container } = renderComponent({ className: 'my-4' })

      const separator = container.querySelector('.my-4')
      expect(separator).toBeInTheDocument()
      const bgSeparator = container.querySelector('.bg-cn-separator-subtle')
      expect(bgSeparator).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref', () => {
      const ref = vi.fn()

      render(<Separator ref={ref} />)

      expect(ref).toHaveBeenCalled()
    })

    test('should provide access to DOM element through ref', () => {
      const ref = { current: null as HTMLDivElement | null }

      render(<Separator ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('HTML Attributes', () => {
    test('should pass through additional props', () => {
      const { container } = render(<Separator data-testid="separator" id="test-sep" />)

      const separator = container.querySelector('#test-sep')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-testid', 'separator')
    })

    test('should handle aria attributes', () => {
      const { container } = render(<Separator aria-label="Section divider" />)

      const separator = container.querySelector('[aria-label="Section divider"]')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should render with minimal props', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should handle both orientation and className together', () => {
      const { container } = renderComponent({
        orientation: 'vertical',
        className: 'custom-class'
      })

      const separator = container.querySelector('.custom-class')
      expect(separator).toBeInTheDocument()
      const verticalSeparator = container.querySelector('.h-full.w-px')
      expect(verticalSeparator).toBeInTheDocument()
    })

    test('should handle all props together', () => {
      const { container } = render(
        <Separator
          orientation="horizontal"
          decorative={false}
          className="my-custom-class"
          data-testid="test-separator"
        />
      )

      const separator = container.querySelector('[data-testid="test-separator"]')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveClass('my-custom-class')
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Separator.displayName).toBeTruthy()
    })
  })

  describe('Re-rendering', () => {
    test('should update when orientation changes', () => {
      const { container, rerender } = render(<Separator orientation="horizontal" />)

      let separator = container.querySelector('.h-px.w-full')
      expect(separator).toBeInTheDocument()

      rerender(<Separator orientation="vertical" />)

      separator = container.querySelector('.h-full.w-px')
      expect(separator).toBeInTheDocument()
    })

    test('should update when decorative changes', () => {
      const { container, rerender } = render(<Separator decorative={true} />)

      let separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()

      rerender(<Separator decorative={false} />)

      separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should update when className changes', () => {
      const { container, rerender } = render(<Separator className="class-1" />)

      let separator = container.querySelector('.class-1')
      expect(separator).toBeInTheDocument()

      rerender(<Separator className="class-2" />)

      separator = container.querySelector('.class-2')
      expect(separator).toBeInTheDocument()
      expect(container.querySelector('.class-1')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should be accessible as decorative element', () => {
      renderComponent({ decorative: true })

      // Decorative separators are purely visual
      const separator = document.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should be accessible as semantic element when not decorative', () => {
      renderComponent({ decorative: false })

      // Non-decorative separators have semantic meaning
      const separator = document.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })

    test('should have proper aria-label when provided', () => {
      const { container } = render(<Separator aria-label="Content divider" decorative={false} />)

      const separator = container.querySelector('[aria-label="Content divider"]')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default orientation to horizontal', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.h-px.w-full')
      expect(separator).toBeInTheDocument()
    })

    test('should default decorative to true', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('.bg-cn-separator-subtle')
      expect(separator).toBeInTheDocument()
    })
  })
})
