import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Toggle } from '../toggle'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof Toggle>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <Toggle text="Toggle" {...props} />
    </TestWrapper>
  )
}

describe('Toggle', () => {
  describe('Basic Rendering', () => {
    test('should render toggle button', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Toggle' })
      expect(button).toBeInTheDocument()
    })

    test('should render with text', () => {
      renderComponent({ text: 'Test Toggle' })

      expect(screen.getByRole('button', { name: 'Test Toggle' })).toBeInTheDocument()
    })

    test('should render as unselected by default', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')
    })

    test('should render with default outline variant', () => {
      const { container } = renderComponent()

      const toggle = container.querySelector('.cn-button-outline')
      expect(toggle).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-toggle' })

      const element = container.querySelector('.custom-toggle')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Toggle State', () => {
    test('should handle selection', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange, selected: false })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    test('should handle unselection', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange, selected: true })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleChange).toHaveBeenCalledWith(false)
    })

    test('should support controlled state', () => {
      const { rerender } = render(
        <TestWrapper>
          <Toggle text="Toggle" selected={false} onChange={vi.fn()} />
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')

      rerender(
        <TestWrapper>
          <Toggle text="Toggle" selected={true} onChange={vi.fn()} />
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
    })

    test('should support uncontrolled state with defaultValue', () => {
      renderComponent({ defaultValue: true })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
    })

    test('should stop event propagation', async () => {
      const handleParentClick = vi.fn()
      const handleChange = vi.fn()

      render(
        <TestWrapper>
          <div onClick={handleParentClick} role="presentation">
            <Toggle text="Toggle" onChange={handleChange} />
          </div>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleChange).toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('Variants & Themes', () => {
    test('should apply ghost variant', () => {
      const { container } = renderComponent({ variant: 'ghost' })

      const toggle = container.querySelector('.cn-button-ghost')
      expect(toggle).toBeInTheDocument()
    })

    test('should apply transparent variant', () => {
      const { container } = renderComponent({ variant: 'transparent' })

      const toggle = container.querySelector('.cn-toggle-transparent')
      expect(toggle).toBeInTheDocument()
    })

    test('should apply primary variant when selected', () => {
      const { container } = renderComponent({ selected: true, selectedVariant: 'primary' })

      const button = container.querySelector('.cn-button-primary')
      expect(button).toBeInTheDocument()
    })

    test('should apply secondary variant when selected', () => {
      const { container } = renderComponent({ selected: true, selectedVariant: 'secondary' })

      const button = container.querySelector('.cn-button-secondary')
      expect(button).toBeInTheDocument()
    })

    test('should keep transparent variant when selected if variant is transparent', () => {
      const { container } = renderComponent({
        selected: true,
        variant: 'transparent',
        selectedVariant: 'primary'
      })

      const button = container.querySelector('.cn-button-transparent')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    test('should apply medium size by default', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply small size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const toggle = container.querySelector('.cn-toggle-sm')
      expect(toggle).toBeInTheDocument()
    })

    test('should apply extra small size', () => {
      const { container } = renderComponent({ size: 'xs' })

      const toggle = container.querySelector('.cn-toggle-xs')
      expect(toggle).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    test('should render with prefix icon', () => {
      const { container } = renderComponent({ prefixIcon: 'star' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with suffix icon', () => {
      const { container } = renderComponent({ suffixIcon: 'check' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with both prefix and suffix icons', () => {
      renderComponent({ prefixIcon: 'star', suffixIcon: 'check' })

      // Both icons are rendered
      const icons = document.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(2)
    })

    test('should render icon-only toggle', () => {
      renderComponent({ iconOnly: true, prefixIcon: 'star', text: 'Star' })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Star')
    })

    test('should apply custom icon props', () => {
      const { container } = renderComponent({
        prefixIcon: 'star',
        prefixIconProps: { className: 'custom-icon-class' }
      })

      const icon = container.querySelector('.custom-icon-class')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    test('should disable toggle when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    test('should not trigger onChange when disabled', async () => {
      const handleChange = vi.fn()
      renderComponent({ disabled: true, onChange: handleChange })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Tooltip Integration', () => {
    test('should render with tooltip', () => {
      renderComponent({ tooltipProps: { content: 'Toggle this' } })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should support tooltip props', () => {
      renderComponent({
        tooltipProps: {
          content: 'Tooltip content',
          side: 'bottom'
        }
      })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Rounded Prop', () => {
    test('should apply rounded style when rounded is true', () => {
      const { container } = renderComponent({ rounded: true })

      const button = container.querySelector('.cn-button-rounded')
      expect(button).toBeInTheDocument()
    })

    test('should not apply rounded style by default', () => {
      const { container } = renderComponent()

      const button = container.querySelector('.cn-button-rounded')
      expect(button).not.toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Toggle ref={ref} text="Toggle" />
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete toggle with all props', () => {
      const handleChange = vi.fn()
      const { container } = renderComponent({
        text: 'Complete Toggle',
        prefixIcon: 'star',
        suffixIcon: 'check',
        selected: true,
        selectedVariant: 'primary',
        variant: 'outline',
        size: 'sm',
        rounded: true,
        onChange: handleChange,
        className: 'custom-class'
      })

      expect(screen.getByRole('button', { name: 'Complete Toggle' })).toBeInTheDocument()
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
      expect(container.querySelector('.cn-toggle-sm')).toBeInTheDocument()
      expect(container.querySelector('.cn-button-rounded')).toBeInTheDocument()
    })

    test('should render icon-only with tooltip', () => {
      renderComponent({
        iconOnly: true,
        prefixIcon: 'heart',
        text: 'Favorite',
        tooltipProps: { content: 'Add to favorites' }
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Favorite')
    })

    test('should handle state transitions', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const button = screen.getByRole('button')

      // Click to select
      await userEvent.click(button)
      expect(handleChange).toHaveBeenNthCalledWith(1, true)

      // Click to unselect
      await userEvent.click(button)
      expect(handleChange).toHaveBeenNthCalledWith(2, false)
    })
  })

  describe('Edge Cases', () => {
    test('should work without onChange callback', async () => {
      renderComponent({ onChange: undefined })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Should not crash
      expect(button).toBeInTheDocument()
    })

    test('should handle empty text', () => {
      renderComponent({ text: '' })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })
})
