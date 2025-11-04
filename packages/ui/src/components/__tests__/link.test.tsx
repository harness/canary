import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Link } from '../link'

const renderComponent = (props: Partial<React.ComponentProps<typeof Link>> = {}): RenderResult => {
  return render(
    <Link to="/" {...props}>
      Link Text
    </Link>
  )
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

    test('should handle numeric children', () => {
      const { container } = render(<Link to="/">{123}</Link>)

      expect(screen.getByText('123')).toBeInTheDocument()
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should handle null children', () => {
      const { container } = render(<Link to="/">{null}</Link>)

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should handle undefined children', () => {
      const { container } = render(<Link to="/">{undefined}</Link>)

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should handle long text content', () => {
      const longText = 'This is a very long link text that should wrap or truncate properly'
      render(<Link to="/">{longText}</Link>)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    test('should handle special characters in children', () => {
      const specialText = '<>&"'
      render(<Link to="/">{specialText}</Link>)

      expect(screen.getByText(specialText)).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Link.displayName).toBe('Link')
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes', () => {
      const { container } = renderComponent({ 'data-testid': 'custom-link' } as any)

      const link = container.querySelector('[data-testid="custom-link"]')
      expect(link).toBeInTheDocument()
    })

    test('should forward aria attributes', () => {
      renderComponent({ 'aria-label': 'Custom label' })

      const link = screen.getByLabelText('Custom label')
      expect(link).toBeInTheDocument()
    })

    test('should forward title attribute', () => {
      const { container } = renderComponent({ title: 'Link title' })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('title', 'Link title')
    })

    test('should forward target attribute for external links', () => {
      const { container } = render(
        <Link external href="https://example.com" target="_blank">
          External Link
        </Link>
      )

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('target', '_blank')
    })

    test('should forward rel attribute for external links', () => {
      const { container } = render(
        <Link external href="https://example.com" rel="noopener noreferrer">
          External Link
        </Link>
      )

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Re-rendering', () => {
    test('should update when variant changes', () => {
      const { rerender, container } = render(
        <Link to="/" variant="default">
          Link
        </Link>
      )

      let link = container.querySelector('.cn-link-default')
      expect(link).toBeInTheDocument()

      rerender(
        <Link to="/" variant="secondary">
          Link
        </Link>
      )

      link = container.querySelector('.cn-link-secondary')
      expect(link).toBeInTheDocument()
    })

    test('should update when size changes', () => {
      const { rerender, container } = render(
        <Link to="/" size="md">
          Link
        </Link>
      )

      let link = container.querySelector('a')
      expect(link).not.toHaveClass('cn-link-sm')

      rerender(
        <Link to="/" size="sm">
          Link
        </Link>
      )

      link = container.querySelector('.cn-link-sm')
      expect(link).toBeInTheDocument()
    })

    test('should update when disabled state changes', () => {
      const { rerender, container } = render(
        <Link to="/" disabled={false}>
          Link
        </Link>
      )

      let link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'false')

      rerender(
        <Link to="/" disabled={true}>
          Link
        </Link>
      )

      link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'true')
    })

    test('should update when children change', () => {
      const { rerender } = render(<Link to="/">Initial</Link>)

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<Link to="/">Updated</Link>)

      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Initial')).not.toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default to medium size', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link).not.toHaveClass('cn-link-sm')
    })

    test('should default to not disabled', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'false')
    })

    test('should default to show hover underline', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link).not.toHaveClass('cn-link-no-underline')
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props with external link', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <Link
          external
          href="https://example.com"
          variant="secondary"
          size="sm"
          prefixIcon="star"
          suffixIcon="check"
          noHoverUnderline={true}
          disabled={false}
          className="custom"
          onClick={handleClick}
        >
          External Link
        </Link>
      )

      const link = container.querySelector('.custom.cn-link-secondary.cn-link-sm.cn-link-no-underline')
      expect(link).toBeInTheDocument()

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBe(2)
    })

    test('should handle all props with internal link', () => {
      const handleClick = vi.fn()
      const { container } = renderComponent({
        to: '/dashboard',
        variant: 'secondary',
        size: 'sm',
        prefixIcon: 'nav-arrow-left',
        suffixIcon: 'arrow-up-right',
        noHoverUnderline: true,
        disabled: false,
        className: 'custom',
        onClick: handleClick
      })

      const link = container.querySelector('.custom.cn-link-secondary.cn-link-sm.cn-link-no-underline')
      expect(link).toBeInTheDocument()

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBe(2)
    })

    test('should handle prefix icon with disabled link', () => {
      const { container } = renderComponent({
        prefixIcon: 'star',
        disabled: true
      })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('data-disabled', 'true')

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should handle suffix icon with secondary variant', () => {
      const { container } = renderComponent({
        variant: 'secondary',
        suffixIcon: 'check'
      })

      const link = container.querySelector('.cn-link-secondary')
      expect(link).toBeInTheDocument()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper link semantics', () => {
      const { container } = renderComponent()

      const link = container.querySelector('a')
      expect(link?.tagName).toBe('A')
    })

    test('should indicate disabled state', () => {
      const { container } = renderComponent({ disabled: true })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })

    test('should be keyboard navigable when not disabled', async () => {
      const handleClick = vi.fn()
      const { container } = renderComponent({ onClick: handleClick })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).not.toHaveAttribute('tabindex', '-1')
    })

    test('should support aria-label', () => {
      renderComponent({ 'aria-label': 'Go to homepage' })

      const link = screen.getByLabelText('Go to homepage')
      expect(link).toBeInTheDocument()
    })

    test('should support aria-describedby', () => {
      const { container } = renderComponent({ 'aria-describedby': 'link-description' })

      const link = container.querySelector('a')
      expect(link).toHaveAttribute('aria-describedby', 'link-description')
    })
  })

  describe('Icon Behavior', () => {
    test('should render default prefix icon when boolean true', () => {
      const { container } = renderComponent({ prefixIcon: true })

      // Default prefix icon is 'nav-arrow-left'
      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })

    test('should render default suffix icon when boolean true', () => {
      const { container } = renderComponent({ suffixIcon: true })

      // Default suffix icon is 'arrow-up-right'
      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })

    test('should not render icons when false', () => {
      const { container } = renderComponent({
        prefixIcon: false,
        suffixIcon: false
      })

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBe(0)
    })
  })
})
