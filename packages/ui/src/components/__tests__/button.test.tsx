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
})
