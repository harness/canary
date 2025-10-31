import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Text } from '../text'

const renderComponent = (props: Partial<React.ComponentProps<typeof Text>> = {}): RenderResult => {
  return render(<Text {...props}>Test Text</Text>)
}

describe('Text', () => {
  describe('Basic Rendering', () => {
    test('should render text content', () => {
      renderComponent()

      expect(screen.getByText('Test Text')).toBeInTheDocument()
    })

    test('should render as p element by default', () => {
      const { container } = renderComponent()

      const text = container.querySelector('p')
      expect(text).toBeInTheDocument()
    })

    test('should apply default body-normal variant', () => {
      const { container } = renderComponent()

      const text = container.querySelector('.font-body-normal')
      expect(text).toBeInTheDocument()
    })

    test('should apply default foreground-2 color', () => {
      const { container } = renderComponent()

      const text = container.querySelector('.text-cn-2')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Typography Variants', () => {
    test('should render heading-hero variant', () => {
      const { container } = renderComponent({ variant: 'heading-hero' })

      const text = container.querySelector('.font-heading-hero')
      expect(text).toBeInTheDocument()
    })

    test('should render heading-section variant', () => {
      const { container } = renderComponent({ variant: 'heading-section' })

      const text = container.querySelector('.font-heading-section')
      expect(text).toBeInTheDocument()
    })

    test('should render body-strong variant', () => {
      const { container } = renderComponent({ variant: 'body-strong' })

      const text = container.querySelector('.font-body-strong')
      expect(text).toBeInTheDocument()
    })

    test('should render body-code variant', () => {
      const { container } = renderComponent({ variant: 'body-code' })

      const text = container.querySelector('.font-body-code')
      expect(text).toBeInTheDocument()
    })

    test('should render caption-normal variant', () => {
      const { container } = renderComponent({ variant: 'caption-normal' })

      const text = container.querySelector('.font-caption-normal')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Color Variants', () => {
    test('should apply foreground-1 color', () => {
      const { container } = renderComponent({ color: 'foreground-1' })

      const text = container.querySelector('.text-cn-1')
      expect(text).toBeInTheDocument()
    })

    test('should apply success color', () => {
      const { container } = renderComponent({ color: 'success' })

      const text = container.querySelector('.text-cn-success')
      expect(text).toBeInTheDocument()
    })

    test('should apply danger color', () => {
      const { container } = renderComponent({ color: 'danger' })

      const text = container.querySelector('.text-cn-danger')
      expect(text).toBeInTheDocument()
    })

    test('should apply warning color', () => {
      const { container } = renderComponent({ color: 'warning' })

      const text = container.querySelector('.text-cn-warning')
      expect(text).toBeInTheDocument()
    })

    test('should apply brand color', () => {
      const { container } = renderComponent({ color: 'brand' })

      const text = container.querySelector('.text-cn-brand')
      expect(text).toBeInTheDocument()
    })

    test('should apply disabled color', () => {
      const { container } = renderComponent({ color: 'disabled' })

      const text = container.querySelector('.text-cn-disabled')
      expect(text).toBeInTheDocument()
    })

    test('should apply inherit color', () => {
      const { container } = renderComponent({ color: 'inherit' })

      const text = container.querySelector('.text-inherit')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Text Alignment', () => {
    test('should apply left alignment', () => {
      const { container } = renderComponent({ align: 'left' })

      const text = container.querySelector('.text-left')
      expect(text).toBeInTheDocument()
    })

    test('should apply center alignment', () => {
      const { container } = renderComponent({ align: 'center' })

      const text = container.querySelector('.text-center')
      expect(text).toBeInTheDocument()
    })

    test('should apply right alignment', () => {
      const { container } = renderComponent({ align: 'right' })

      const text = container.querySelector('.text-right')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Truncation', () => {
    test('should apply truncate class when truncate is true', () => {
      const { container } = renderComponent({ truncate: true })

      const text = container.querySelector('.truncate')
      expect(text).toBeInTheDocument()
    })

    test('should add title attribute when truncated', () => {
      const { container } = renderComponent({ truncate: true })

      const text = container.querySelector('p')
      expect(text).toHaveAttribute('title')
    })

    test('should use custom title when provided', () => {
      const { container } = renderComponent({ truncate: true, title: 'Custom Title' })

      const text = container.querySelector('p')
      expect(text).toHaveAttribute('title', 'Custom Title')
    })
  })

  describe('Line Clamp', () => {
    test('should apply line-clamp-1', () => {
      const { container } = renderComponent({ lineClamp: 1 })

      const text = container.querySelector('.line-clamp-1')
      expect(text).toBeInTheDocument()
    })

    test('should apply line-clamp-2', () => {
      const { container } = renderComponent({ lineClamp: 2 })

      const text = container.querySelector('.line-clamp-2')
      expect(text).toBeInTheDocument()
    })

    test('should apply line-clamp-3', () => {
      const { container } = renderComponent({ lineClamp: 3 })

      const text = container.querySelector('.line-clamp-3')
      expect(text).toBeInTheDocument()
    })

    test('should add title when line clamped', () => {
      const { container } = renderComponent({ lineClamp: 2 })

      const text = container.querySelector('p')
      expect(text).toHaveAttribute('title')
    })
  })

  describe('Text Wrap', () => {
    test('should apply wrap style', () => {
      const { container } = renderComponent({ wrap: 'wrap' })

      const text = container.querySelector('.text-wrap')
      expect(text).toBeInTheDocument()
    })

    test('should apply nowrap style', () => {
      const { container } = renderComponent({ wrap: 'nowrap' })

      const text = container.querySelector('.text-nowrap')
      expect(text).toBeInTheDocument()
    })

    test('should apply pretty wrap', () => {
      const { container } = renderComponent({ wrap: 'pretty' })

      const text = container.querySelector('.text-pretty')
      expect(text).toBeInTheDocument()
    })

    test('should apply balance wrap', () => {
      const { container } = renderComponent({ wrap: 'balance' })

      const text = container.querySelector('.text-balance')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Element Types (as prop)', () => {
    test('should render as div when as="div"', () => {
      const { container } = render(<Text as="div">Content</Text>)

      const text = container.querySelector('div')
      expect(text).toHaveTextContent('Content')
    })

    test('should render as span when as="span"', () => {
      const { container } = render(<Text as="span">Content</Text>)

      const text = container.querySelector('span')
      expect(text).toHaveTextContent('Content')
    })

    test('should render as h1 when as="h1"', () => {
      const { container } = render(<Text as="h1">Heading</Text>)

      const text = container.querySelector('h1')
      expect(text).toHaveTextContent('Heading')
    })

    test('should render as label when as="label"', () => {
      const { container } = render(<Text as="label">Label</Text>)

      const text = container.querySelector('label')
      expect(text).toHaveTextContent('Label')
    })
  })

  describe('Heading Role', () => {
    test('should apply heading role for heading variants', () => {
      const { container } = renderComponent({ variant: 'heading-hero' })

      const heading = container.querySelector('[role="heading"]')
      expect(heading).toBeInTheDocument()
    })

    test('should not apply heading role for body variants', () => {
      const { container } = renderComponent({ variant: 'body-normal' })

      const heading = container.querySelector('[role="heading"]')
      expect(heading).not.toBeInTheDocument()
    })
  })

  describe('AsChild Prop', () => {
    test('should merge props when asChild is true', () => {
      render(
        <Text asChild>
          <button>Button Text</button>
        </Text>
      )

      expect(screen.getByRole('button', { name: 'Button Text' })).toBeInTheDocument()
    })

    test('should apply text classes to child when asChild', () => {
      const { container } = render(
        <Text asChild color="danger">
          <div data-testid="child">Child</div>
        </Text>
      )

      const child = container.querySelector('[data-testid="child"]')
      expect(child).toHaveClass('text-cn-danger')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref', () => {
      const ref = vi.fn()

      render(<Text ref={ref}>Text</Text>)

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('HTML Attributes', () => {
    test('should pass through HTML attributes', () => {
      const { container } = render(
        <Text data-testid="text" id="test-text">
          Content
        </Text>
      )

      const text = container.querySelector('#test-text')
      expect(text).toBeInTheDocument()
      expect(text).toHaveAttribute('data-testid', 'text')
    })

    test('should handle className prop', () => {
      const { container } = renderComponent({ className: 'custom-text' })

      const text = container.querySelector('.custom-text')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should combine multiple props', () => {
      const { container } = renderComponent({
        variant: 'heading-section',
        color: 'brand',
        align: 'center',
        className: 'custom-class'
      })

      const text = container.querySelector('.custom-class')
      expect(text).toBeInTheDocument()
      expect(text).toHaveClass('font-heading-section')
      expect(text).toHaveClass('text-cn-brand')
      expect(text).toHaveClass('text-center')
    })

    test('should render truncated text with custom color', () => {
      const { container } = renderComponent({
        truncate: true,
        color: 'success',
        variant: 'body-strong'
      })

      const text = container.querySelector('.truncate.text-cn-success.font-body-strong')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should render with all variant types', () => {
      const variants = [
        'heading-hero',
        'heading-section',
        'heading-subsection',
        'heading-base',
        'heading-small',
        'body-normal',
        'body-single-line-normal',
        'body-strong',
        'body-single-line-strong',
        'body-code',
        'caption-normal',
        'caption-light',
        'caption-strong',
        'caption-single-line-normal',
        'caption-single-line-light'
      ] as const

      variants.forEach(variant => {
        const { container } = render(<Text variant={variant}>Text</Text>)
        const element = container.querySelector(`[class*="font-${variant}"]`)
        expect(element).toBeInTheDocument()
      })
    })
  })
})
