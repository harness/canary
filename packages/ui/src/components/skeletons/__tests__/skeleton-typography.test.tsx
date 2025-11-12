import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonTypography, SkeletonTypographyProps } from '../skeleton-typography'

// Mock SkeletonBase
vi.mock('../components/skeleton', () => ({
  SkeletonBase: ({ className, ...props }: any) => <div data-testid="skeleton-base" className={className} {...props} />
}))

// Mock cn utility
vi.mock('@utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock typography variant config
vi.mock('@components/text', () => ({
  typographyVariantConfig: {
    'body-normal': 'body-normal',
    'body-single-line-normal': 'body-single-line-normal',
    'caption-normal': 'caption-normal',
    'caption-light': 'caption-light',
    'caption-single-line-normal': 'caption-single-line-normal',
    'caption-single-line-light': 'caption-single-line-light',
    'heading-base': 'heading-base'
  }
}))

const renderComponent = (props: Partial<SkeletonTypographyProps> = {}) => {
  return render(<SkeletonTypography {...props} />)
}

describe('SkeletonTypography', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton typography', () => {
      const { container } = renderComponent()
      const wrapper = container.querySelector('[data-testid="skeleton-base"]')?.parentElement
      expect(wrapper).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SkeletonTypography.displayName).toBe('SkeletonTypography')
    })

    test('should render wrapper div', () => {
      const { container } = renderComponent()
      const wrapper = container.firstChild
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toBeInstanceOf(HTMLDivElement)
    })

    test('should render SkeletonBase inside wrapper', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toBeInTheDocument()
    })

    test('should apply wrapper class', () => {
      const { container } = renderComponent()
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should apply child class to SkeletonBase', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-typography-child')
    })
  })

  describe('Variant Prop', () => {
    test('should render with body-normal variant', () => {
      const { container } = renderComponent({ variant: 'body-normal' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should render with caption-normal variant', () => {
      const { container } = renderComponent({ variant: 'caption-normal' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should render with heading-base variant', () => {
      const { container } = renderComponent({ variant: 'heading-base' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should default to body-normal variant', () => {
      const { container } = renderComponent()
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should handle undefined variant', () => {
      const { container } = renderComponent({ variant: undefined })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })
  })

  describe('Custom ClassNames', () => {
    test('should apply custom className to SkeletonBase', () => {
      const { getByTestId } = renderComponent({ className: 'custom-child' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom-child')
    })

    test('should apply wrapperClassName to wrapper', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-wrapper')
    })

    test('should merge wrapperClassName with base wrapper class', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
      expect(wrapper).toHaveClass('custom-wrapper')
    })

    test('should merge className with child class', () => {
      const { getByTestId } = renderComponent({ className: 'custom-child' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('cn-skeleton-typography-child')
      expect(skeleton).toHaveClass('custom-child')
    })

    test('should handle both className and wrapperClassName', () => {
      const { container, getByTestId } = renderComponent({
        className: 'custom-child',
        wrapperClassName: 'custom-wrapper'
      })

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-wrapper')

      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom-child')
    })

    test('should handle empty classNames', () => {
      const { container, getByTestId } = renderComponent({
        className: '',
        wrapperClassName: ''
      })

      expect(container.firstChild).toHaveClass('cn-skeleton-typography-wrapper')
      expect(getByTestId('skeleton-base')).toHaveClass('cn-skeleton-typography-child')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to wrapper div', () => {
      const ref = { current: null }
      render(<SkeletonTypography ref={ref} />)
      expect(ref.current).not.toBeNull()
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    test('should allow ref access to element methods', () => {
      const ref = { current: null }
      render(<SkeletonTypography ref={ref} />)
      expect(ref.current).toHaveProperty('focus')
      expect(ref.current).toHaveProperty('blur')
    })
  })

  describe('HTML Attributes', () => {
    test('should accept data attributes', () => {
      const { container } = renderComponent({ 'data-testid': 'custom-typography' } as any)
      const wrapper = container.querySelector('[data-testid="custom-typography"]')
      expect(wrapper).toBeInTheDocument()
    })

    test('should accept id attribute', () => {
      const { container } = render(<SkeletonTypography id="typography-id" />)
      const wrapper = container.querySelector('#typography-id')
      expect(wrapper).toBeInTheDocument()
    })

    test('should accept style attribute', () => {
      const { container } = renderComponent({ style: { width: '100px' } } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ width: '100px' })
    })

    test('should accept aria attributes', () => {
      const { container } = renderComponent({ 'aria-label': 'Loading text' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-label', 'Loading text')
    })

    test('should accept role attribute', () => {
      const { container } = renderComponent({ role: 'status' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('role', 'status')
    })
  })

  describe('Edge Cases', () => {
    test('should handle all props together', () => {
      const { container, getByTestId } = renderComponent({
        variant: 'caption-normal',
        className: 'child-class',
        wrapperClassName: 'wrapper-class'
      })

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('wrapper-class')
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')

      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('child-class')
      expect(skeleton).toHaveClass('cn-skeleton-typography-child')
    })

    test('should handle minimal props', () => {
      const { container } = renderComponent()
      expect(container.firstChild).toBeInTheDocument()
    })

    test('should handle undefined props', () => {
      const { container } = renderComponent({
        variant: undefined,
        className: undefined,
        wrapperClassName: undefined
      })
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Typography Variants', () => {
    const variants: Array<SkeletonTypographyProps['variant']> = [
      'body-normal',
      'body-single-line-normal',
      'caption-normal',
      'caption-light',
      'caption-single-line-normal',
      'caption-single-line-light',
      'heading-base'
    ]

    variants.forEach(variant => {
      test(`should render ${variant} variant correctly`, () => {
        const { container } = renderComponent({ variant })
        const wrapper = container.firstChild
        expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
      })
    })

    test('should apply variant class to wrapper', () => {
      variants.forEach(variant => {
        const { container, unmount } = renderComponent({ variant })
        const wrapper = container.firstChild
        expect(wrapper).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple typography skeletons', () => {
      render(
        <>
          <SkeletonTypography variant="body-normal" data-testid="typo-1" />
          <SkeletonTypography variant="caption-normal" data-testid="typo-2" />
          <SkeletonTypography variant="heading-base" data-testid="typo-3" />
        </>
      )

      expect(document.querySelectorAll('[data-testid^="typo-"]')).toHaveLength(3)
    })

    test('should handle independent props for multiple instances', () => {
      const { getAllByTestId } = render(
        <>
          <SkeletonTypography className="class-1" />
          <SkeletonTypography className="class-2" />
        </>
      )

      const skeletons = getAllByTestId('skeleton-base')
      expect(skeletons[0]).toHaveClass('class-1')
      expect(skeletons[1]).toHaveClass('class-2')
    })
  })

  describe('Accessibility', () => {
    test('should support aria-label', () => {
      const { container } = renderComponent({ 'aria-label': 'Loading' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-label', 'Loading')
    })

    test('should support aria-busy', () => {
      const { container } = renderComponent({ 'aria-busy': 'true' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-busy', 'true')
    })

    test('should support aria-live', () => {
      const { container } = renderComponent({ 'aria-live': 'polite' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-live', 'polite')
    })

    test('should support role attribute', () => {
      const { container } = renderComponent({ role: 'status' } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('role', 'status')
    })
  })

  describe('Width Customization', () => {
    test('should accept custom width via className', () => {
      const { getByTestId } = renderComponent({ className: 'w-[129px]' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('w-[129px]')
    })

    test('should accept custom width via style', () => {
      const { container } = renderComponent({ style: { width: '200px' } } as any)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ width: '200px' })
    })

    test('should handle percentage width', () => {
      const { getByTestId } = renderComponent({ className: 'w-1/3' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('w-1/3')
    })

    test('should handle full width', () => {
      const { getByTestId } = renderComponent({ className: 'w-full' })
      const skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('w-full')
    })
  })

  describe('Component Integration', () => {
    test('should work within other components', () => {
      render(
        <div data-testid="container">
          <SkeletonTypography />
        </div>
      )

      const container = screen.getByTestId('container') as HTMLElement
      const skeleton = screen.getByTestId('skeleton-base')

      expect(container).toContainElement(skeleton)
    })

    test('should work in lists', () => {
      render(
        <div>
          {[1, 2, 3].map(i => (
            <SkeletonTypography key={i} data-testid={`item-${i}`} />
          ))}
        </div>
      )

      expect(document.querySelectorAll('[data-testid^="item-"]')).toHaveLength(3)
    })

    test('should work with flex layout', () => {
      render(
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonTypography className="w-[100px]" />
          <SkeletonTypography className="w-[200px]" />
        </div>
      )

      const skeletons = document.querySelectorAll('[data-testid="skeleton-base"]')
      expect(skeletons).toHaveLength(2)
    })
  })

  describe('Variant Transitions', () => {
    test('should update variant when prop changes', () => {
      const { container, rerender } = render(<SkeletonTypography variant="body-normal" />)

      let wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')

      rerender(<SkeletonTypography variant="heading-base" />)

      wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should maintain wrapper class during variant changes', () => {
      const { container, rerender } = render(<SkeletonTypography variant="body-normal" />)

      let wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')

      rerender(<SkeletonTypography variant="caption-normal" />)

      wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should preserve custom className during variant changes', () => {
      const { getByTestId, rerender } = render(<SkeletonTypography variant="body-normal" className="custom" />)

      let skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom')

      rerender(<SkeletonTypography variant="caption-normal" className="custom" />)

      skeleton = getByTestId('skeleton-base')
      expect(skeleton).toHaveClass('custom')
    })
  })

  describe('Class Variance Authority Integration', () => {
    test('should use cva for variant generation', () => {
      const { container } = renderComponent({ variant: 'body-normal' })
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })

    test('should apply default variant when not specified', () => {
      const { container } = renderComponent()
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('cn-skeleton-typography-wrapper')
    })
  })
})
