import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SkeletonBase } from '../components/skeleton'

// Mock cn utility
vi.mock('@utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('SkeletonBase', () => {
  describe('Basic Rendering', () => {
    test('should render skeleton element', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(SkeletonBase.displayName).toBe('SkeletonBase')
    })

    test('should render as div element', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton?.tagName).toBe('DIV')
    })

    test('should apply cn-skeleton-base class', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('cn-skeleton-base')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" className="custom-skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('custom-skeleton')
    })

    test('should merge custom className with base class', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" className="custom-skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('cn-skeleton-base')
      expect(skeleton).toHaveClass('custom-skeleton')
    })

    test('should handle empty className', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" className="" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('cn-skeleton-base')
    })

    test('should handle multiple custom classes', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" className="class-1 class-2 class-3" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('cn-skeleton-base')
      expect(skeleton).toHaveClass('class-1 class-2 class-3')
    })
  })

  describe('HTML Attributes', () => {
    test('should accept data attributes', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" data-custom="value" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('data-custom', 'value')
    })

    test('should accept id attribute', () => {
      const { container } = render(<SkeletonBase id="skeleton-id" />)
      const skeleton = container.querySelector('#skeleton-id')
      expect(skeleton).toBeInTheDocument()
    })

    test('should accept style attribute', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" style={{ width: '100px' }} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveStyle({ width: '100px' })
    })

    test('should accept aria attributes', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" aria-label="Loading" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading')
    })

    test('should accept role attribute', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" role="status" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('role', 'status')
    })

    test('should accept title attribute', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" title="Loading content" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('title', 'Loading content')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to div element', () => {
      const ref = { current: null }
      render(<SkeletonBase ref={ref} data-testid="skeleton" />)
      expect(ref.current).not.toBeNull()
      expect((ref.current as any)?.tagName).toBe('DIV')
    })

    test('should allow ref access to element methods', () => {
      const ref = { current: null }
      render(<SkeletonBase ref={ref} data-testid="skeleton" />)
      expect(ref.current).toHaveProperty('focus')
      expect(ref.current).toHaveProperty('blur')
    })
  })

  describe('Children', () => {
    test('should render without children', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton?.children.length).toBe(0)
    })

    test('should render with children', () => {
      render(
        <SkeletonBase data-testid="skeleton">
          <span data-testid="child">Child content</span>
        </SkeletonBase>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    test('should render with text children', () => {
      render(<SkeletonBase data-testid="skeleton">Loading...</SkeletonBase>)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('should render with multiple children', () => {
      render(
        <SkeletonBase data-testid="skeleton">
          <span data-testid="child1">Child 1</span>
          <span data-testid="child2">Child 2</span>
        </SkeletonBase>
      )
      expect(screen.getByTestId('child1')).toBeInTheDocument()
      expect(screen.getByTestId('child2')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle undefined className', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" className={undefined} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveClass('cn-skeleton-base')
    })

    test('should handle null children', () => {
      expect(() => {
        render(<SkeletonBase data-testid="skeleton">{null}</SkeletonBase>)
      }).not.toThrow()
    })

    test('should handle undefined children', () => {
      expect(() => {
        render(<SkeletonBase data-testid="skeleton">{undefined}</SkeletonBase>)
      }).not.toThrow()
    })

    test('should handle boolean children', () => {
      expect(() => {
        render(<SkeletonBase data-testid="skeleton">{false}</SkeletonBase>)
      }).not.toThrow()
    })

    test('should handle array of children', () => {
      render(
        <SkeletonBase data-testid="skeleton">
          {[1, 2, 3].map(num => (
            <div key={num} data-testid={`child-${num}`}>
              {num}
            </div>
          ))}
        </SkeletonBase>
      )
      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('Style Variations', () => {
    test('should accept inline styles', () => {
      const styles = {
        width: '200px',
        height: '100px',
        borderRadius: '8px'
      }
      const { container } = render(<SkeletonBase data-testid="skeleton" style={styles} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveStyle(styles)
    })

    test('should handle CSS custom properties', () => {
      const { container } = render(
        <SkeletonBase data-testid="skeleton" style={{ '--custom-var': '10px' } as React.CSSProperties} />
      )
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should be accessible as loading indicator', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" role="status" aria-label="Loading" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('role', 'status')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading')
    })

    test('should support aria-busy attribute', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" aria-busy="true" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('aria-busy', 'true')
    })

    test('should support aria-live attribute', () => {
      const { container } = render(<SkeletonBase data-testid="skeleton" aria-live="polite" />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      expect(skeleton).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Multiple Instances', () => {
    test('should render multiple skeleton instances', () => {
      render(
        <>
          <SkeletonBase data-testid="skeleton-1" />
          <SkeletonBase data-testid="skeleton-2" />
          <SkeletonBase data-testid="skeleton-3" />
        </>
      )
      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-2')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-3')).toBeInTheDocument()
    })

    test('should handle different props for multiple instances', () => {
      const { container } = render(
        <>
          <SkeletonBase data-testid="skeleton-1" className="class-1" />
          <SkeletonBase data-testid="skeleton-2" className="class-2" />
        </>
      )
      const skeleton1 = container.querySelector('[data-testid="skeleton-1"]')
      const skeleton2 = container.querySelector('[data-testid="skeleton-2"]')
      expect(skeleton1).toHaveClass('class-1')
      expect(skeleton2).toHaveClass('class-2')
    })
  })

  describe('Event Handlers', () => {
    test('should accept onClick handler', async () => {
      const handleClick = vi.fn()
      const { container } = render(<SkeletonBase data-testid="skeleton" onClick={handleClick} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      skeleton && fireEvent.click(skeleton)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should accept onMouseEnter handler', async () => {
      const handleMouseEnter = vi.fn()
      const { container } = render(<SkeletonBase data-testid="skeleton" onMouseEnter={handleMouseEnter} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      skeleton && fireEvent.mouseEnter(skeleton)
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    })

    test('should accept onMouseLeave handler', async () => {
      const handleMouseLeave = vi.fn()
      const { container } = render(<SkeletonBase data-testid="skeleton" onMouseLeave={handleMouseLeave} />)
      const skeleton = container.querySelector('[data-testid="skeleton"]')
      skeleton && fireEvent.mouseLeave(skeleton)
      expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    })
  })

  describe('Integration', () => {
    test('should work within layout components', () => {
      render(
        <div data-testid="container">
          <SkeletonBase data-testid="skeleton" />
        </div>
      )
      const container = screen.getByTestId('container')
      const skeleton = screen.getByTestId('skeleton')
      expect(container).toContainElement(skeleton)
    })

    test('should nest properly', () => {
      render(
        <SkeletonBase data-testid="outer">
          <SkeletonBase data-testid="inner" />
        </SkeletonBase>
      )
      const outer = screen.getByTestId('outer')
      const inner = screen.getByTestId('inner')
      expect(outer).toContainElement(inner)
    })
  })
})
