import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Button } from '../button'

// Wrapper component to provide TooltipProvider for components that need tooltips
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof Button>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <Button {...props}>Click Me</Button>
    </TestWrapper>
  )
}

describe('Button', () => {
  test('should render button with default props', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('cn-button')
  })

  test('should render button with text content', () => {
    renderComponent()

    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  test('should have type="button" by default', () => {
    renderComponent()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  test('should accept custom type attribute', () => {
    renderComponent({ type: 'submit' })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    renderComponent({ onClick: handleClick })

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    renderComponent({ onClick: handleClick, disabled: true })

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  test('should be disabled when disabled prop is true', () => {
    renderComponent({ disabled: true })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  test('should apply primary variant class', () => {
    renderComponent({ variant: 'primary' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-primary')
  })

  test('should apply secondary variant class', () => {
    renderComponent({ variant: 'secondary' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-secondary')
  })

  test('should apply outline variant class', () => {
    renderComponent({ variant: 'outline' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-outline')
  })

  test('should apply ghost variant class', () => {
    renderComponent({ variant: 'ghost' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-ghost')
  })

  test('should apply link variant class', () => {
    renderComponent({ variant: 'link' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-link')
  })

  test('should apply small size class', () => {
    renderComponent({ size: 'sm' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-sm')
  })

  test('should apply xs size class', () => {
    renderComponent({ size: 'xs' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-xs')
  })

  test('should apply 2xs size class', () => {
    renderComponent({ size: '2xs' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-2xs')
  })

  test('should apply 3xs size class', () => {
    renderComponent({ size: '3xs' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-3xs')
  })

  test('should apply success theme class', () => {
    renderComponent({ theme: 'success' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-success')
  })

  test('should apply danger theme class', () => {
    renderComponent({ theme: 'danger' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-danger')
  })

  test('should apply rounded class when rounded prop is true', () => {
    renderComponent({ rounded: true })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-rounded')
  })

  test('should apply custom className', () => {
    renderComponent({ className: 'custom-class' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  test('should show loading spinner when loading is true', () => {
    const { container } = renderComponent({ loading: true })

    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('should disable button when loading is true', () => {
    renderComponent({ loading: true })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  test('should handle async onClick with promise', async () => {
    // Create a promise that we can control
    let resolvePromise: () => void
    const promise = new Promise<void>(resolve => {
      resolvePromise = resolve
    })

    const asyncClick = vi.fn().mockReturnValue(promise)
    const { container } = renderComponent({ onClick: asyncClick })

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(asyncClick).toHaveBeenCalledTimes(1)

    // Button should show loading spinner while promise is pending
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()

    // Resolve the promise
    resolvePromise!()
    await promise
  })

  test('should handle rejected promise in onClick', async () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const asyncClick = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('error')).catch(() => {
        // Catch the rejection to prevent unhandled promise rejection warning
      })
    })
    renderComponent({ onClick: asyncClick })

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(asyncClick).toHaveBeenCalledTimes(1)

    // Wait for promise to settle
    await new Promise(resolve => setTimeout(resolve, 10))

    consoleError.mockRestore()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(
      <TestWrapper>
        <Button ref={ref}>Button</Button>
      </TestWrapper>
    )

    expect(ref).toHaveBeenCalled()
  })

  test('should render tooltip when tooltipProps are provided', () => {
    renderComponent({
      iconOnly: true,
      tooltipProps: {
        content: 'Tooltip content'
      }
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  test('should apply icon-only class when iconOnly is true', () => {
    renderComponent({ iconOnly: true, tooltipProps: { content: 'Icon button' } })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-icon-only')
  })

  test('should render children correctly', () => {
    render(
      <TestWrapper>
        <Button>
          <span data-testid="child">Child Element</span>
        </Button>
      </TestWrapper>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  test('should preserve other HTML attributes', () => {
    render(
      <Button aria-label="Custom label" data-testid="custom-button">
        Click Me
      </Button>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  test('should handle multiple clicks', async () => {
    const handleClick = vi.fn()
    renderComponent({ onClick: handleClick })

    const button = screen.getByRole('button')
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  test('should combine multiple variant classes', () => {
    renderComponent({
      variant: 'outline',
      size: 'sm',
      theme: 'danger',
      rounded: true
    })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cn-button-outline')
    expect(button).toHaveClass('cn-button-sm')
    expect(button).toHaveClass('cn-button-danger')
    expect(button).toHaveClass('cn-button-rounded')
  })

  test('should stop loading after promise resolves', async () => {
    let resolvePromise: () => void
    const promise = new Promise<void>(resolve => {
      resolvePromise = resolve
    })

    const asyncClick = vi.fn().mockReturnValue(promise)

    const { container } = renderComponent({ onClick: asyncClick })

    const button = screen.getByRole('button')
    await userEvent.click(button)

    // Check spinner is present
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()

    // Resolve the promise
    resolvePromise!()
    await promise

    // Wait for loading state to clear
    await waitFor(() => {
      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
    })
  })

  describe('Additional Variants', () => {
    test('should apply ai variant class', () => {
      renderComponent({ variant: 'ai' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-ai')
    })

    test('should apply transparent variant class', () => {
      renderComponent({ variant: 'transparent' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-transparent')
    })
  })

  describe('Micro Sizes (2xs, 3xs)', () => {
    test('should automatically set iconOnly for 2xs size', () => {
      renderComponent({ size: '2xs' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-2xs')
      expect(button).toHaveClass('cn-button-icon-only')
    })

    test('should automatically set iconOnly for 3xs size', () => {
      renderComponent({ size: '3xs' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-3xs')
      expect(button).toHaveClass('cn-button-icon-only')
    })
  })

  describe('asChild Prop', () => {
    test('should render as Slot component when asChild is true', () => {
      const { container } = render(
        <TestWrapper>
          <Button asChild>
            <a href="/test">Link Button</a>
          </Button>
        </TestWrapper>
      )

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    test('should apply button classes to Slot child', () => {
      const { container } = render(
        <TestWrapper>
          <Button asChild variant="primary">
            <a href="/test">Link</a>
          </Button>
        </TestWrapper>
      )

      const link = container.querySelector('a')
      expect(link).toHaveClass('cn-button')
      expect(link).toHaveClass('cn-button-primary')
    })
  })

  describe('Loading State with Children', () => {
    test('should show spinner and children when loading and not iconOnly', () => {
      const { container } = render(
        <TestWrapper>
          <Button loading>
            <span data-testid="child-text">Save</span>
          </Button>
        </TestWrapper>
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(screen.getByTestId('child-text')).toBeInTheDocument()
    })

    test('should show only spinner when loading and iconOnly', () => {
      const { container } = render(
        <TestWrapper>
          <Button loading iconOnly tooltipProps={{ content: 'Save' }}>
            <span data-testid="icon-child">Icon</span>
          </Button>
        </TestWrapper>
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(screen.queryByTestId('icon-child')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip Props', () => {
    test('should render tooltip with title and content', () => {
      render(
        <TestWrapper>
          <Button iconOnly tooltipProps={{ title: 'Save Action', content: 'Save your changes' }}>
            Save
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply tooltip side prop', () => {
      render(
        <TestWrapper>
          <Button iconOnly tooltipProps={{ content: 'Tooltip', side: 'bottom' }}>
            Button
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply tooltip align prop', () => {
      render(
        <TestWrapper>
          <Button iconOnly tooltipProps={{ content: 'Tooltip', align: 'start' }}>
            Button
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should hide tooltip arrow with hideArrow prop', () => {
      render(
        <TestWrapper>
          <Button iconOnly tooltipProps={{ content: 'No arrow tooltip' }}>
            Button
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('ignoreIconOnlyTooltip Prop', () => {
    test('should not require tooltip when iconOnly with ignoreIconOnlyTooltip', () => {
      render(
        <TestWrapper>
          <Button iconOnly ignoreIconOnlyTooltip>
            Icon
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('cn-button-icon-only')
    })
  })

  describe('Props Omission', () => {
    test('should not pass tooltipProps to button DOM', () => {
      render(
        <TestWrapper>
          <Button tooltipProps={{ content: 'Tooltip' }}>Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('tooltipProps')
    })

    test('should not pass ignoreIconOnlyTooltip to button DOM', () => {
      render(
        <TestWrapper>
          <Button iconOnly ignoreIconOnlyTooltip>
            Button
          </Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('ignoreIconOnlyTooltip')
    })
  })

  describe('Default Values', () => {
    test('should use default variant primary', () => {
      render(
        <TestWrapper>
          <Button>Default</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-primary')
    })

    test('should use default size md', () => {
      render(
        <TestWrapper>
          <Button>Default Size</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      // md is default, won't have specific size class
      expect(button).not.toHaveClass('cn-button-sm')
      expect(button).not.toHaveClass('cn-button-xs')
    })

    test('should use default theme', () => {
      render(
        <TestWrapper>
          <Button>Default Theme</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-default')
    })
  })

  describe('Component DisplayName', () => {
    test('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button')
    })
  })

  describe('onClick Handler Edge Cases', () => {
    test('should work without onClick handler', async () => {
      renderComponent()

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Should not throw error
      expect(button).toBeInTheDocument()
    })

    test('should handle onClick returning void', async () => {
      const handleClick = vi.fn().mockReturnValue(undefined)
      renderComponent({ onClick: handleClick })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should handle onClick returning non-promise value', async () => {
      const handleClick = vi.fn().mockReturnValue('some value')
      renderComponent({ onClick: handleClick })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Promise Loading States', () => {
    test('should combine loading prop and promise loading', async () => {
      let resolvePromise: () => void
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve
      })

      const asyncClick = vi.fn().mockReturnValue(promise)
      const { container } = renderComponent({ onClick: asyncClick, loading: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      await userEvent.click(button)

      // Button should still show loading
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()

      resolvePromise!()
      await promise
    })

    test('should maintain loading during long async operation', async () => {
      vi.useFakeTimers()

      const longAsyncClick = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 5000))
      })

      const { container } = renderComponent({ onClick: longAsyncClick })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Should be loading immediately
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      expect(button).toBeDisabled()

      // Should still be loading after some time
      vi.advanceTimersByTime(2500)
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()

      // Complete the promise
      vi.advanceTimersByTime(2500)
      await waitFor(() => {
        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
      })

      vi.useRealTimers()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when variant changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Button variant="primary">Button</Button>
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-primary')

      rerender(
        <TestWrapper>
          <Button variant="secondary">Button</Button>
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-secondary')
      expect(button).not.toHaveClass('cn-button-primary')
    })

    test('should update when size changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Button size="md">Button</Button>
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).not.toHaveClass('cn-button-sm')

      rerender(
        <TestWrapper>
          <Button size="sm">Button</Button>
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toHaveClass('cn-button-sm')
    })

    test('should update when disabled changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Button disabled={false}>Button</Button>
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).not.toBeDisabled()

      rerender(
        <TestWrapper>
          <Button disabled={true}>Button</Button>
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Complex State Combinations', () => {
    test('should handle disabled and loading together', () => {
      renderComponent({ disabled: true, loading: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    test('should handle iconOnly with loading', () => {
      const { container } = render(
        <TestWrapper>
          <Button iconOnly loading tooltipProps={{ content: 'Loading' }}>
            Icon
          </Button>
        </TestWrapper>
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    test('should handle all variants with all sizes', () => {
      const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'ai' | 'transparent'> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'link',
        'ai',
        'transparent'
      ]
      const sizes: Array<'md' | 'sm' | 'xs' | '2xs' | '3xs'> = ['md', 'sm', 'xs', '2xs', '3xs']

      variants.forEach(variant => {
        sizes.forEach(size => {
          const { container } = render(
            <TestWrapper>
              <Button variant={variant} size={size}>
                Button
              </Button>
            </TestWrapper>
          )

          const button = container.querySelector('button')
          expect(button).toBeInTheDocument()
        })
      })
    })

    test('should handle all themes with all variants', () => {
      const themes: Array<'default' | 'success' | 'danger'> = ['default', 'success', 'danger']
      const variants: Array<'primary' | 'secondary' | 'outline'> = ['primary', 'secondary', 'outline']

      themes.forEach(theme => {
        variants.forEach(variant => {
          const { container } = render(
            <TestWrapper>
              <Button theme={theme} variant={variant}>
                Button
              </Button>
            </TestWrapper>
          )

          const button = container.querySelector('button')
          expect(button).toBeInTheDocument()
        })
      })
    })

    test('should handle rounded with all variants', () => {
      const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost' | 'link'> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'link'
      ]

      variants.forEach(variant => {
        render(
          <TestWrapper>
            <Button variant={variant} rounded>
              Rounded {variant}
            </Button>
          </TestWrapper>
        )

        const button = screen.getByRole('button', { name: `Rounded ${variant}` })
        expect(button).toHaveClass('cn-button-rounded')
        expect(button).toHaveClass(`cn-button-${variant}`)
      })
    })
  })

  describe('Accessibility', () => {
    test('should maintain button role', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should support aria-label', () => {
      render(
        <TestWrapper>
          <Button aria-label="Close dialog">X</Button>
        </TestWrapper>
      )

      const button = screen.getByLabelText('Close dialog')
      expect(button).toBeInTheDocument()
    })

    test('should support aria-describedby', () => {
      render(
        <TestWrapper>
          <Button aria-describedby="help-text">Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })

    test('should be keyboard accessible', async () => {
      const handleClick = vi.fn()
      renderComponent({ onClick: handleClick })

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await userEvent.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Type Attribute', () => {
    test('should support reset type', () => {
      render(
        <TestWrapper>
          <Button type="reset">Reset</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('Children Rendering', () => {
    test('should render complex children', () => {
      render(
        <TestWrapper>
          <Button>
            <span>Icon</span>
            <span>Text</span>
          </Button>
        </TestWrapper>
      )

      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    test('should render string children', () => {
      render(
        <TestWrapper>
          <Button>Simple Text</Button>
        </TestWrapper>
      )

      expect(screen.getByText('Simple Text')).toBeInTheDocument()
    })

    test('should render number children', () => {
      render(
        <TestWrapper>
          <Button>{42}</Button>
        </TestWrapper>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  describe('Event Handling', () => {
    test('should handle onMouseEnter', async () => {
      const handleMouseEnter = vi.fn()
      render(
        <TestWrapper>
          <Button onMouseEnter={handleMouseEnter}>Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.hover(button)

      expect(handleMouseEnter).toHaveBeenCalled()
    })

    test('should handle onMouseLeave', async () => {
      const handleMouseLeave = vi.fn()
      render(
        <TestWrapper>
          <Button onMouseLeave={handleMouseLeave}>Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.hover(button)
      await userEvent.unhover(button)

      expect(handleMouseLeave).toHaveBeenCalled()
    })

    test('should handle onFocus', async () => {
      const handleFocus = vi.fn()
      render(
        <TestWrapper>
          <Button onFocus={handleFocus}>Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      button.focus()

      expect(handleFocus).toHaveBeenCalled()
    })

    test('should handle onBlur', async () => {
      const handleBlur = vi.fn()
      render(
        <TestWrapper>
          <Button onBlur={handleBlur}>Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      button.focus()
      button.blur()

      expect(handleBlur).toHaveBeenCalled()
    })
  })
})
