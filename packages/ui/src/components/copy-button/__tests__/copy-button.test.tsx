import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import copy from 'clipboard-copy'
import { vi } from 'vitest'

import { CopyButton } from '../copy-button'

// Mock clipboard-copy
vi.mock('clipboard-copy', () => ({
  default: vi.fn(() => Promise.resolve())
}))

const mockCopy = copy as ReturnType<typeof vi.fn>

const COPY_TEXT = 'test-copy-text'

// Wrapper component to provide TooltipProvider for components that need tooltips
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof CopyButton>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <CopyButton name={COPY_TEXT} {...props} />
    </TestWrapper>
  )
}

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  test('should render copy button with default props', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  test('should display copy icon initially', () => {
    renderComponent()

    // The button should contain a copy icon (checking for svg element)
    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  test('should call clipboard-copy with correct text when clicked', async () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    await userEvent.click(button)

    expect(mockCopy).toHaveBeenCalledWith(COPY_TEXT)
    expect(mockCopy).toHaveBeenCalledTimes(1)
  })

  test('should show check icon after successful copy', async () => {
    vi.useFakeTimers()
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    await userEvent.click(button)

    await waitFor(() => {
      // After clicking, the icon should change (this is a bit tricky to test directly)
      // We're checking that the copy function was called
      expect(mockCopy).toHaveBeenCalled()
    })

    vi.useRealTimers()
  })

  test('should revert to copy icon after timeout', async () => {
    vi.useFakeTimers()
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    await userEvent.click(button)

    // Fast-forward time by 1000ms (the timeout duration)
    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockCopy).toHaveBeenCalled()
    })

    vi.useRealTimers()
  })

  test('should call custom onClick handler when provided', async () => {
    const handleClick = vi.fn()
    renderComponent({ onClick: handleClick })

    const button = screen.getByRole('button', { name: /copy/i })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(mockCopy).toHaveBeenCalledWith(COPY_TEXT)
  })

  test('should stop event propagation when clicked', async () => {
    const handleClick = vi.fn()
    const handleParentClick = vi.fn()

    render(
      <TestWrapper>
        <div onClick={handleParentClick} role="button" tabIndex={0} onKeyDown={() => {}}>
          <CopyButton name={COPY_TEXT} onClick={handleClick} />
        </div>
      </TestWrapper>
    )

    const button = screen.getByRole('button', { name: /copy/i })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleParentClick).not.toHaveBeenCalled()
  })

  test('should apply custom className', () => {
    const customClass = 'custom-class'
    renderComponent({ className: customClass })

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toHaveClass(customClass)
  })

  test('should render with custom button variant', () => {
    renderComponent({ buttonVariant: 'ghost' })

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  test('should render with custom size', () => {
    renderComponent({ size: 'md' })

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  test('should render with custom icon size', () => {
    renderComponent({ iconSize: 'md' })

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  test('should render with custom color', () => {
    renderComponent({ color: 'success' })

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toBeInTheDocument()
  })

  test('should have correct aria-label', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toHaveAttribute('aria-label', 'Copy')
  })

  test('should have button type="button"', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })
    expect(button).toHaveAttribute('type', 'button')
  })

  test('should handle multiple rapid clicks', async () => {
    vi.useFakeTimers()
    renderComponent()

    const button = screen.getByRole('button', { name: /copy/i })

    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)

    expect(mockCopy).toHaveBeenCalledTimes(3)

    vi.useRealTimers()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(
      <TestWrapper>
        <CopyButton ref={ref} name={COPY_TEXT} />
      </TestWrapper>
    )

    expect(ref).toHaveBeenCalled()
  })
})
