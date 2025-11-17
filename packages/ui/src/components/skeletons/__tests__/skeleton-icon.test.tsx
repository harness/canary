import { forwardRef } from 'react'

import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonIcon, SkeletonIconProps } from '../skeleton-icon'

// Mock SkeletonBase to observe props
vi.mock('../components/skeleton', () => ({
  SkeletonBase: (() => {
    const Component = forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
      <div data-testid="skeleton-base" ref={ref} className={className} {...props} />
    ))
    Component.displayName = 'SkeletonBaseMock'
    return Component
  })()
}))

// Provide deterministic class merging
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

// Avoid importing full component library
vi.mock('@/components', () => ({
  iconVariants: vi.fn()
}))

const renderComponent = (props: Partial<SkeletonIconProps> = {}) => {
  const defaultProps: SkeletonIconProps = {
    size: 'sm'
  }

  return render(<SkeletonIcon {...defaultProps} {...props} />)
}

describe('SkeletonIcon', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    test('renders skeleton base element', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toBeInTheDocument()
    })

    test('exposes displayName', () => {
      expect(SkeletonIcon.displayName).toBe('SkeletonIcon')
    })

    test('applies base class', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-icon')
    })
  })

  describe('Size Variants', () => {
    const sizes: SkeletonIconProps['size'][] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl']

    sizes.forEach(size => {
      test(`applies size specific class for ${size}`, () => {
        const { getByTestId } = renderComponent({ size })
        expect(getByTestId('skeleton-base')).toHaveClass(`cn-skeleton-icon-${size}`)
      })
    })

    test('defaults to small size when omitted', () => {
      const { getByTestId } = renderComponent({ size: undefined })
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-icon-sm')
    })
  })

  describe('ClassName Merging', () => {
    test('merges custom className with generated classes', () => {
      const { getByTestId } = renderComponent({ className: 'extra-class', size: 'md' })
      const element = getByTestId('skeleton-base')
      expect(element).toHaveClass('cn-skeleton-icon')
      expect(element).toHaveClass('cn-skeleton-icon-md')
      expect(element).toHaveClass('extra-class')
    })

    test('handles empty className gracefully', () => {
      const { getByTestId } = renderComponent({ className: '' })
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-icon')
    })

    test('handles undefined className', () => {
      const { getByTestId } = renderComponent({ className: undefined })
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-icon')
    })
  })

  describe('Ref Forwarding', () => {
    test('forwards ref to DOM element', () => {
      const ref: React.RefObject<HTMLDivElement> = { current: null }
      render(<SkeletonIcon ref={ref} size="lg" />)
      expect(ref.current).instanceOf(HTMLDivElement)
    })

    test('provides access to DOM APIs', () => {
      const ref: React.RefObject<HTMLDivElement> = { current: null }
      render(<SkeletonIcon ref={ref} size="sm" />)
      expect(ref.current).not.toBeNull()
      expect(typeof ref.current?.focus).toBe('function')
    })
  })

  describe('Accessibility & Attributes', () => {
    test('accepts aria attributes', () => {
      const { getByTestId } = renderComponent({ 'aria-label': 'loading icon' } as any)
      expect(getByTestId('skeleton-base')).toHaveAttribute('aria-label', 'loading icon')
    })

    test('accepts role attribute', () => {
      const { getByTestId } = renderComponent({ role: 'status' } as any)
      expect(getByTestId('skeleton-base')).toHaveAttribute('role', 'status')
    })

    test('supports custom data attributes', () => {
      const { getByTestId } = renderComponent({ 'data-testflag': 'true' } as any)
      expect(getByTestId('skeleton-base')).toHaveAttribute('data-testflag', 'true')
    })
  })

  describe('Edge Cases', () => {
    test('renders with minimal props', () => {
      const { getByTestId } = render(<SkeletonIcon size="sm" />)
      expect(getByTestId('skeleton-base')).toBeInTheDocument()
    })

    test('maintains stable rendering across re-renders', () => {
      const { getByTestId, rerender } = renderComponent({ size: 'sm', className: 'first' })
      const initial = getByTestId('skeleton-base')
      rerender(<SkeletonIcon size="sm" className="second" />)
      const second = getByTestId('skeleton-base')
      expect(initial).toBe(second)
    })

    test('handles multiple instances independently', () => {
      const { getByTestId } = render(
        <>
          <SkeletonIcon size="xs" className="icon-1" data-testid="icon-1" />
          <SkeletonIcon size="xl" className="icon-2" data-testid="icon-2" />
        </>
      )

      expect(getByTestId('icon-1')).toBeInTheDocument()
      expect(getByTestId('icon-2')).toBeInTheDocument()
    })
  })
})
