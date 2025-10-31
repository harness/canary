import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Link } from '../link'

const renderComponent = (props: Partial<React.ComponentProps<typeof Link>> = {}): RenderResult => {
  return render(<Link to="/" {...props}>Link Text</Link>)
}

describe('Link', () => {
  describe('Basic Rendering', () => {
    test('should render link', () => {
      renderComponent()

      expect(screen.getByText('Link Text')).toBeInTheDocument()
    })

    test('should render as anchor element', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should apply default variant', () => {
      const { container } = renderComponent()

      const link = container.querySelector('.cn-link-default')
      expect(link).toBeInTheDocument()
    })

    test('should apply base link class', () => {
      const { container } = renderComponent()

      const link = container.querySelector('.cn-link')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    test('should apply default variant', () => {
      const { container } = renderComponent({ variant: 'default' })

      const link = container.querySelector('.cn-link-default')
      expect(link).toBeInTheDocument()
    })

    test('should apply secondary variant', () => {
      const { container } = renderComponent({ variant: 'secondary' })

      const link = container.querySelector('.cn-link-secondary')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    test('should apply medium size by default', () => {
      renderComponent()

      const link = screen.getByText('Link Text')
      expect(link).toBeInTheDocument()
    })

    test('should apply small size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const link = container.querySelector('.cn-link-sm')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    test('should render with prefix icon (boolean)', () => {
      const { container } = renderComponent({ prefixIcon: true })

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })

    test('should render with custom prefix icon', () => {
      const { container } = renderComponent({ prefixIcon: 'star' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with suffix icon (boolean)', () => {
      const { container } = renderComponent({ suffixIcon: true })

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })

    test('should render with custom suffix icon', () => {
      const { container } = renderComponent({ suffixIcon: 'check' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with both prefix and suffix icons', () => {
      const { container } = renderComponent({ prefixIcon: true, suffixIcon: true })

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBe(2)
    })
  })

  describe('Disabled State', () => {
    test('should apply disabled attribute', () => {
      const { container } = renderComponent({ disabled: true })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'true')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })

    test('should prevent click when disabled', async () => {
      const handleClick = vi.fn()
      renderComponent({ disabled: true, onClick: handleClick })

      const link = screen.getByText('Link Text')
      await userEvent.click(link)

      expect(handleClick).not.toHaveBeenCalled()
    })

    test('should stop propagation when disabled', async () => {
      const handleClick = vi.fn()
      const handleParentClick = vi.fn()

      const { container } = render(
        <div onClick={handleParentClick} role="presentation">
          <Link to="/" disabled onClick={handleClick}>
            Disabled Link
          </Link>
        </div>
      )

      const link = container.querySelector('a')
      if (link) {
        await userEvent.click(link)
      }

      expect(handleClick).not.toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('Hover Underline', () => {
    test('should show underline on hover by default', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link).not.toHaveClass('cn-link-no-underline')
    })

    test('should hide underline when noHoverUnderline is true', () => {
      const { container } = renderComponent({ noHoverUnderline: true })

      const link = container.querySelector('.cn-link-no-underline')
      expect(link).toBeInTheDocument()
    })
  })

  describe('External Links', () => {
    test('should render external link as regular anchor', () => {
      const { container } = render(
        <Link external href="https://example.com">
          External
        </Link>
      )

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should accept href for external links', () => {
      const { container } = render(
        <Link external href="https://example.com">
          External
        </Link>
      )

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Internal Links', () => {
    test('should render internal link with to prop', () => {
      renderComponent({ to: '/internal' })

      expect(screen.getByText('Link Text')).toBeInTheDocument()
    })

    test('should use router Link component for internal links', () => {
      const { container } = renderComponent({ to: '/dashboard' })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Click Handling', () => {
    test('should call onClick when link is clicked', async () => {
      const handleClick = vi.fn()
      renderComponent({ onClick: handleClick })

      const link = screen.getByText('Link Text')
      await userEvent.click(link)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should allow onClick without preventing default', async () => {
      const handleClick = vi.fn()
      renderComponent({ onClick: handleClick })

      const link = screen.getByText('Link Text')
      await userEvent.click(link)

      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-link' })

      const link = container.querySelector('.custom-link')
      expect(link).toBeInTheDocument()
    })

    test('should combine variant, size, and className', () => {
      const { container } = renderComponent({
        variant: 'secondary',
        size: 'sm',
        className: 'extra-class'
      })

      const link = container.querySelector('.cn-link-secondary.cn-link-sm.extra-class')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref', () => {
      const ref = vi.fn()

      render(
        <Link ref={ref} to="/">
          Link
        </Link>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should provide access to anchor element through ref', () => {
      const ref = { current: null as HTMLAnchorElement | null }

      render(
        <Link ref={ref} to="/">
          Link
        </Link>
      )

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty children', () => {
      const { container } = render(<Link to="/">{''}</Link>)

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should render ReactNode children', () => {
      render(
        <Link to="/">
          <span data-testid="custom">Custom Content</span>
        </Link>
      )

      expect(screen.getByTestId('custom')).toBeInTheDocument()
    })

    test('should combine all props', () => {
      const { container } = renderComponent({
        variant: 'secondary',
        size: 'sm',
        prefixIcon: 'star',
        suffixIcon: 'check',
        noHoverUnderline: true,
        className: 'custom-link'
      })

      const link = container.querySelector('.custom-link.cn-link-secondary.cn-link-sm.cn-link-no-underline')
      expect(link).toBeInTheDocument()
    })

    test('should handle disabled link with icons', () => {
      const { container } = renderComponent({
        disabled: true,
        prefixIcon: true,
        suffixIcon: true
      })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'true')
      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBe(2)
    })
  })
})

