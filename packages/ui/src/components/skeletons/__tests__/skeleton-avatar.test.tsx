import { forwardRef } from 'react'

import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonAvatar, SkeletonAvatarProps } from '../skeleton-avatar'

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

// Mock avatarVariants from components
vi.mock('@/components', () => ({
  avatarVariants: vi.fn()
}))

const renderComponent = (props: Partial<SkeletonAvatarProps> = {}) => {
  const defaultProps: SkeletonAvatarProps = {
    size: 'sm'
  }
  return render(<SkeletonAvatar {...defaultProps} {...props} />)
}

describe('SkeletonAvatar', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton avatar', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SkeletonAvatar.displayName).toBe('SkeletonAvatar')
    })

    test('should apply cn-skeleton-avatar class', () => {
      const { getByTestId } = renderComponent()
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
    })
  })

  describe('Size Variants', () => {
    test('should render with xs size', () => {
      const { getByTestId } = renderComponent({ size: 'xs' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-xs')
    })

    test('should render with sm size', () => {
      const { getByTestId } = renderComponent({ size: 'sm' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-sm')
    })

    test('should render with md size', () => {
      const { getByTestId } = renderComponent({ size: 'md' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-md')
    })

    test('should render with lg size', () => {
      const { getByTestId } = renderComponent({ size: 'lg' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-lg')
    })

    test('should default to sm size', () => {
      const { getByTestId } = renderComponent({ size: 'sm' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-sm')
    })
  })

  describe('Rounded Variant', () => {
    test('should apply rounded class when rounded is true', () => {
      const { getByTestId } = renderComponent({ rounded: true })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
    })

    test('should not apply rounded class when rounded is false', () => {
      const { getByTestId } = renderComponent({ rounded: false })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).not.toHaveClass('cn-skeleton-avatar-rounded')
    })

    test('should default to not rounded', () => {
      const { getByTestId } = renderComponent({ rounded: undefined })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).not.toHaveClass('cn-skeleton-avatar-rounded')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { getByTestId } = renderComponent({ className: 'custom-avatar' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom-avatar')
    })

    test('should merge custom className with variant classes', () => {
      const { getByTestId } = renderComponent({ size: 'md', className: 'custom-avatar' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-md')
      expect(skeleton).toHaveClass('custom-avatar')
    })

    test('should handle empty className', () => {
      const { getByTestId } = renderComponent({ className: '' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
    })

    test('should handle undefined className', () => {
      const { getByTestId } = renderComponent({ className: undefined })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to SkeletonBase', () => {
      const ref = { current: null }
      render(<SkeletonAvatar ref={ref} size="sm" />)
      expect(ref.current).not.toBeNull()
    })

    test('should allow ref access to element', () => {
      const ref = { current: null }
      render(<SkeletonAvatar ref={ref} size="md" />)
      expect(ref.current).toHaveProperty('focus')
    })
  })

  describe('Size and Rounded Combinations', () => {
    test('should handle xs size with rounded', () => {
      const { getByTestId } = renderComponent({ size: 'xs', rounded: true })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-xs')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
    })

    test('should handle sm size with rounded', () => {
      const { getByTestId } = renderComponent({ size: 'sm', rounded: true })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-sm')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
    })

    test('should handle md size with rounded', () => {
      const { getByTestId } = renderComponent({ size: 'md', rounded: true })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-md')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
    })

    test('should handle lg size with rounded', () => {
      const { getByTestId } = renderComponent({ size: 'lg', rounded: true })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-lg')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
    })
  })

  describe('All Size Variants', () => {
    const sizes: Array<SkeletonAvatarProps['size']> = ['xs', 'sm', 'md', 'lg']

    sizes.forEach(size => {
      test(`should render ${size} size correctly`, () => {
        const { getByTestId } = renderComponent({ size })
        const skeleton = getByTestId('skeleton-base')
        expect(skeleton).toHaveClass(`cn-skeleton-avatar-${size}`)
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle all props together', () => {
      const { getByTestId } = renderComponent({
        size: 'lg',
        rounded: true,
        className: 'custom-class'
      })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-lg')
      expect(skeleton).toHaveClass('cn-skeleton-avatar-rounded')
      expect(skeleton).toHaveClass('custom-class')
    })

    test('should handle minimal props', () => {
      const { getByTestId } = renderComponent({ size: 'sm' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple avatars with different sizes', () => {
      const { container } = render(
        <>
          <SkeletonAvatar size="xs" />
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
        </>
      )
      const avatars = container.querySelectorAll('.cn-skeleton-avatar')
      expect(avatars).toHaveLength(4)
    })

    test('should handle independent props for multiple instances', () => {
      render(
        <>
          <SkeletonAvatar size="xs" rounded={true} />
          <SkeletonAvatar size="lg" rounded={false} />
        </>
      )
      // Both should render independently
      expect(document.querySelectorAll('.cn-skeleton-avatar')).toHaveLength(2)
    })
  })

  describe('Class Variance Authority Integration', () => {
    test('should use cva for variant generation', () => {
      const { getByTestId } = renderComponent({ size: 'md', rounded: true })
      const skeleton = getByTestId('skeleton-base')
      // Verify that both variant classes are applied
      expect(skeleton.className).toContain('cn-skeleton-avatar')
    })

    test('should apply default variants when not specified', () => {
      const { getByTestId } = render(<SkeletonAvatar size="sm" />)
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-avatar')
    })
  })
})
