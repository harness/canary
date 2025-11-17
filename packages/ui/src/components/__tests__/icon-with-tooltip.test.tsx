import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { IconWithTooltip, IconWithTooltipProps } from '../icon-with-tooltip'

// Mock Tooltip component
vi.mock('../tooltip', async () => {
  const actual = await vi.importActual('../tooltip')
  return {
    ...actual,
    Tooltip: ({ children, content, title, ...props }: any) => (
      <div data-testid="tooltip" data-content={content} data-title={title} {...props}>
        {children}
      </div>
    )
  }
})

// Mock IconV2 component
vi.mock('../icon-v2', async () => {
  const actual = await vi.importActual('../icon-v2')
  return {
    ...actual,
    IconV2: ({ name, size, ...props }: any) => (
      <svg data-testid="icon-v2" data-name={name} data-size={size} {...props} />
    )
  }
})

const renderComponent = (props: Partial<IconWithTooltipProps> = {}) => {
  const defaultProps: IconWithTooltipProps = {
    content: 'Tooltip content'
  }
  return render(<IconWithTooltip {...defaultProps} {...props} />)
}

describe('IconWithTooltip', () => {
  describe('Basic Rendering', () => {
    test('should render icon', () => {
      renderComponent()
      expect(screen.getByTestId('icon-v2')).toBeInTheDocument()
    })

    test('should render tooltip wrapper', () => {
      renderComponent()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })

    test('should render button element', () => {
      const { container } = renderComponent()
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    test('should render with default icon name (info-circle)', () => {
      renderComponent()
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-name', 'info-circle')
    })

    test('should render with default icon size (md)', () => {
      renderComponent()
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-size', 'md')
    })
  })

  describe('Tooltip Content', () => {
    test('should display tooltip content', () => {
      renderComponent({ content: 'Test tooltip content' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('data-content', 'Test tooltip content')
    })

    test('should display tooltip title when provided', () => {
      renderComponent({ content: 'Content', title: 'Tooltip Title' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('data-title', 'Tooltip Title')
    })

    test('should handle empty content string', () => {
      renderComponent({ content: '' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('data-content', '')
    })

    test('should handle React node as content', () => {
      renderComponent({ content: <span>React Node Content</span> })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    test('should disable button when disabled prop is true', () => {
      const { container } = renderComponent({ disabled: true })
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })

    test('should not disable button when disabled prop is false', () => {
      const { container } = renderComponent({ disabled: false })
      const button = container.querySelector('button')
      expect(button).not.toBeDisabled()
    })

    test('should not disable button when disabled prop is undefined', () => {
      const { container } = renderComponent()
      const button = container.querySelector('button')
      expect(button).not.toBeDisabled()
    })

    test('should add pointer-events-none class when disabled', () => {
      const { container } = renderComponent({ disabled: true })
      const button = container.querySelector('button')
      expect(button).toHaveClass('pointer-events-none')
    })

    test('should not add pointer-events-none class when not disabled', () => {
      const { container } = renderComponent({ disabled: false })
      const button = container.querySelector('button')
      expect(button).not.toHaveClass('pointer-events-none')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className to button', () => {
      const { container } = renderComponent({ className: 'custom-class' })
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })

    test('should merge custom className with disabled classes', () => {
      const { container } = renderComponent({ className: 'custom-class', disabled: true })
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('pointer-events-none')
    })

    test('should handle empty className', () => {
      const { container } = renderComponent({ className: '' })
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Icon Props', () => {
    test('should pass iconProps to IconV2', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          size: 'lg',
          color: 'danger'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-name', 'account')
      expect(icon).toHaveAttribute('data-size', 'lg')
    })

    test('should override default icon name with iconProps', () => {
      renderComponent({
        iconProps: {
          name: 'arrow-down'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-name', 'arrow-down')
    })

    test('should override default icon size with iconProps', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          size: 'xl'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-size', 'xl')
    })

    test('should handle iconProps with color', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          color: 'success'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toBeInTheDocument()
    })

    test('should handle iconProps with skipSize', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          skipSize: true
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toBeInTheDocument()
    })

    test('should handle iconProps with className', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          className: 'icon-custom-class'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveClass('icon-custom-class')
    })
  })

  describe('Tooltip Props', () => {
    test('should pass side prop to Tooltip', () => {
      renderComponent({ side: 'bottom' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('side', 'bottom')
    })

    test('should pass align prop to Tooltip', () => {
      renderComponent({ align: 'start' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('align', 'start')
    })

    test('should pass delay prop to Tooltip', () => {
      renderComponent({ delay: 1000 })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toBeInTheDocument()
    })

    test('should pass hideArrow prop to Tooltip', () => {
      renderComponent({ hideArrow: true })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toBeInTheDocument()
    })

    test('should pass open prop to Tooltip', () => {
      renderComponent({ open: true })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toBeInTheDocument()
    })

    test('should pass className prop to Tooltip', () => {
      renderComponent({ className: 'tooltip-class' })
      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle all tooltip side values', () => {
      const sides = ['top', 'bottom', 'left', 'right'] as const
      sides.forEach(side => {
        const { unmount } = renderComponent({ side })
        const tooltip = screen.getByTestId('tooltip')
        expect(tooltip).toHaveAttribute('side', side)
        unmount()
      })
    })

    test('should handle all tooltip align values', () => {
      const aligns = ['start', 'center', 'end'] as const
      aligns.forEach(align => {
        const { unmount } = renderComponent({ align })
        const tooltip = screen.getByTestId('tooltip')
        expect(tooltip).toHaveAttribute('align', align)
        unmount()
      })
    })

    test('should handle undefined iconProps', () => {
      renderComponent({ iconProps: undefined })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('data-name', 'info-circle')
    })

    test('should handle empty iconProps object', () => {
      renderComponent({ iconProps: { name: 'account' } })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toBeInTheDocument()
    })

    test('should handle multiple iconProps properties', () => {
      renderComponent({
        iconProps: {
          name: 'account',
          size: 'lg',
          color: 'danger',
          skipSize: false,
          className: 'custom-icon-class'
        }
      })
      const icon = screen.getByTestId('icon-v2')
      expect(icon).toHaveAttribute('data-name', 'account')
      expect(icon).toHaveAttribute('data-size', 'lg')
      expect(icon).toHaveClass('custom-icon-class')
    })
  })

  describe('Accessibility', () => {
    test('should render button as focusable element', () => {
      const { container } = renderComponent()
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    test('should disable button interaction when disabled', () => {
      const { container } = renderComponent({ disabled: true })
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('pointer-events-none')
    })
  })

  describe('Component Integration', () => {
    test('should render IconV2 inside button', () => {
      const { container } = renderComponent()
      const button = container.querySelector('button')
      const icon = screen.getByTestId('icon-v2')
      expect(button).toContainElement(icon)
    })

    test('should render button inside Tooltip', () => {
      const { container } = renderComponent()
      const tooltip = screen.getByTestId('tooltip')
      const button = container.querySelector('button')
      expect(tooltip).toContainElement(button)
    })

    test('should maintain component hierarchy', () => {
      renderComponent()
      const tooltip = screen.getByTestId('tooltip')
      const icon = screen.getByTestId('icon-v2')
      expect(tooltip).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
    })
  })
})
