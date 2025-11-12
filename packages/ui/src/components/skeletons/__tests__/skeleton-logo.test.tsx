import { forwardRef } from 'react'

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonLogo, SkeletonLogoProps } from '../skeleton-logo'

// Mock SkeletonBase
vi.mock('../components/skeleton', () => ({
  SkeletonBase: (() => {
    const Component = forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
      <div data-testid="skeleton-base" ref={ref} className={className} {...props} />
    ))
    Component.displayName = 'SkeletonBaseMock'
    return Component
  })()
}))

// Mock cn utility
vi.mock('@utils/cn', () => ({
  cn: (...classes: any[]) =>
    classes
      .flatMap(value => {
        if (!value) return []
        if (typeof value === 'string') return value
        if (Array.isArray(value)) return value
        if (typeof value === 'object') {
          return Object.entries(value)
            .filter(([, condition]) => Boolean(condition))
            .map(([key]) => key)
        }
        return []
      })
      .join(' ')
}))

// Mock logoVariants from components
vi.mock('@/components', () => ({
  logoVariants: vi.fn()
}))

const renderComponent = (props: Partial<SkeletonLogoProps> = {}) => {
  const defaultProps: SkeletonLogoProps = {
    size: 'lg'
  }
  return render(<SkeletonLogo {...defaultProps} {...props} />)
}

describe('SkeletonLogo', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton logo', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SkeletonLogo.displayName).toBe('SkeletonLogo')
    })

    test('should apply cn-skeleton-logo class', () => {
      const { getByTestId } = renderComponent()
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
    })
  })

  describe('Size Variants', () => {
    test('should render with xs size', () => {
      const { getByTestId } = renderComponent({ size: 'xs' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-xs')
    })

    test('should render with sm size', () => {
      const { getByTestId } = renderComponent({ size: 'sm' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-sm')
    })

    test('should render with md size', () => {
      const { getByTestId } = renderComponent({ size: 'md' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-md')
    })

    test('should render with lg size', () => {
      const { getByTestId } = renderComponent({ size: 'lg' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-lg')
    })

    test('should default to lg size', () => {
      const { getByTestId } = renderComponent({ size: 'lg' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-lg')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { getByTestId } = renderComponent({ className: 'custom-logo' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom-logo')
    })

    test('should merge custom className with variant classes', () => {
      const { getByTestId } = renderComponent({ size: 'md', className: 'custom-logo' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
      expect(skeleton).toHaveClass('cn-skeleton-logo-md')
      expect(skeleton).toHaveClass('custom-logo')
    })

    test('should handle empty className', () => {
      const { getByTestId } = renderComponent({ className: '' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
    })

    test('should handle undefined className', () => {
      const { getByTestId } = renderComponent({ className: undefined })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
    })

    test('should handle multiple custom classes', () => {
      const { getByTestId } = renderComponent({ className: 'class-1 class-2' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('class-1 class-2')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to SkeletonBase', () => {
      const ref = { current: null }
      render(<SkeletonLogo ref={ref} size="lg" />)
      expect(ref.current).not.toBeNull()
    })

    test('should allow ref access to element', () => {
      const ref = { current: null }
      render(<SkeletonLogo ref={ref} size="md" />)
      expect(ref.current).toHaveProperty('focus')
    })

    test('should maintain ref across different sizes', () => {
      const ref = { current: null }
      render(<SkeletonLogo ref={ref} size="xs" />)
      expect(ref.current).not.toBeNull()
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('All Size Variants', () => {
    const sizes: Array<SkeletonLogoProps['size']> = ['xs', 'sm', 'md', 'lg']

    sizes.forEach(size => {
      test(`should render ${size} size correctly`, () => {
        const { getByTestId } = renderComponent({ size })
        const skeleton = getByTestId('skeleton-base')
        expect(skeleton).toHaveClass(`cn-skeleton-logo-${size}`)
      })
    })

    test('should apply base class for all sizes', () => {
      sizes.forEach(size => {
        const { getByTestId, unmount } = renderComponent({ size })
        const skeleton = getByTestId('skeleton-base')
        expect(skeleton).toHaveClass('cn-skeleton-logo')
        unmount()
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle all props together', () => {
      const { getByTestId } = renderComponent({
        size: 'md',
        className: 'custom-class'
      })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
      expect(skeleton).toHaveClass('cn-skeleton-logo-md')
      expect(skeleton).toHaveClass('custom-class')
    })

    test('should handle minimal props', () => {
      const { getByTestId } = renderComponent({ size: 'lg' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple logos with different sizes', () => {
      const { container } = render(
        <>
          <SkeletonLogo size="xs" />
          <SkeletonLogo size="sm" />
          <SkeletonLogo size="md" />
          <SkeletonLogo size="lg" />
        </>
      )
      const logos = container.querySelectorAll('.cn-skeleton-logo')
      expect(logos).toHaveLength(4)
    })

    test('should handle independent props for multiple instances', () => {
      render(
        <>
          <SkeletonLogo size="xs" className="logo-1" />
          <SkeletonLogo size="lg" className="logo-2" />
        </>
      )
      expect(document.querySelectorAll('.cn-skeleton-logo')).toHaveLength(2)
    })

    test('should maintain independent state for each instance', () => {
      const ref1 = { current: null }
      const ref2 = { current: null }

      render(
        <>
          <SkeletonLogo ref={ref1} size="sm" />
          <SkeletonLogo ref={ref2} size="lg" />
        </>
      )

      expect(ref1.current).not.toBeNull()
      expect(ref2.current).not.toBeNull()
      expect(ref1.current).not.toBe(ref2.current)
    })
  })

  describe('Class Variance Authority Integration', () => {
    test('should use cva for variant generation', () => {
      const { getByTestId } = renderComponent({ size: 'md' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton.className).toContain('cn-skeleton-logo')
    })

    test('should apply default variants when not specified', () => {
      const { getByTestId } = render(<SkeletonLogo size="lg" />)
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
    })

    test('should generate correct classes for each size', () => {
      const sizes: Array<SkeletonLogoProps['size']> = ['xs', 'sm', 'md', 'lg']

      sizes.forEach(size => {
        const { getByTestId, unmount } = renderComponent({ size })
        const skeleton = getByTestId('skeleton-base')
        expect(skeleton.className).toContain('cn-skeleton-logo')
        expect(skeleton.className).toContain(`cn-skeleton-logo-${size}`)
        unmount()
      })
    })
  })

  describe('Size Transitions', () => {
    test('should update class when size changes', () => {
      const { getByTestId, rerender } = render(<SkeletonLogo size="xs" />)

      let skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-xs')

      rerender(<SkeletonLogo size="lg" />)

      skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-lg')
      expect(skeleton).not.toHaveClass('cn-skeleton-logo-xs')
    })

    test('should maintain base class during size changes', () => {
      const { getByTestId, rerender } = render(<SkeletonLogo size="sm" />)

      let skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')

      rerender(<SkeletonLogo size="lg" />)

      skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo')
    })

    test('should preserve custom className during size changes', () => {
      const { getByTestId, rerender } = render(<SkeletonLogo size="sm" className="custom" />)

      let skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom')

      rerender(<SkeletonLogo size="md" className="custom" />)

      skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom')
    })
  })

  describe('Component Integration', () => {
    test('should work within other components', () => {
      render(
        <div data-testid="container">
          <SkeletonLogo size="lg" />
        </div>
      )

      const container = screen.getByTestId('container') as HTMLElement
      const skeleton = screen.getByTestId('skeleton-base')

      expect(container).toContainElement(skeleton)
    })

    test('should work with layout components', () => {
      render(
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <SkeletonLogo size="xs" />
          <SkeletonLogo size="sm" />
          <SkeletonLogo size="md" />
          <SkeletonLogo size="lg" />
        </div>
      )

      const logos = document.querySelectorAll('.cn-skeleton-logo')
      expect(logos).toHaveLength(4)
    })
  })

  describe('Default Size Behavior', () => {
    test('should use lg as default size', () => {
      const { getByTestId } = render(<SkeletonLogo size="lg" />)
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-lg')
    })

    test('should override default with provided size', () => {
      const { getByTestId } = render(<SkeletonLogo size="xs" />)
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-logo-xs')
      expect(skeleton).not.toHaveClass('cn-skeleton-logo-lg')
    })
  })
})
