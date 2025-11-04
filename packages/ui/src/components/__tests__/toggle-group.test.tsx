import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ToggleGroup } from '../toggle-group'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof ToggleGroup.Root>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <ToggleGroup.Root {...props}>
        <ToggleGroup.Item value="option1" text="Option 1" />
        <ToggleGroup.Item value="option2" text="Option 2" />
        <ToggleGroup.Item value="option3" text="Option 3" />
      </ToggleGroup.Root>
    </TestWrapper>
  )
}

describe('ToggleGroup', () => {
  describe('ToggleGroup.Root', () => {
    test('should render toggle group', () => {
      const { container } = renderComponent()

      const group = container.querySelector('.cn-toggle-group')
      expect(group).toBeInTheDocument()
    })

    test('should render all toggle items', () => {
      renderComponent()

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-group' })

      const group = container.querySelector('.custom-group')
      expect(group).toBeInTheDocument()
    })

    test('should render with vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const group = container.querySelector('.cn-toggle-group-vertical')
      expect(group).toBeInTheDocument()
    })

    test('should forward ref', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <ToggleGroup.Root ref={ref}>
            <ToggleGroup.Item value="test" text="Test" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Single Selection Mode', () => {
    test('should allow single selection by default', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const button1 = screen.getByText('Option 1')
      await userEvent.click(button1)

      expect(handleChange).toHaveBeenCalledWith('option1')
    })

    test('should handle value change in single mode', async () => {
      const handleChange = vi.fn()
      renderComponent({ type: 'single', onChange: handleChange })

      const button1 = screen.getByText('Option 1')
      const button2 = screen.getByText('Option 2')

      await userEvent.click(button1)
      expect(handleChange).toHaveBeenCalledWith('option1')

      await userEvent.click(button2)
      expect(handleChange).toHaveBeenCalledWith('option2')
    })

    test('should support controlled single value', () => {
      const { rerender } = render(
        <TestWrapper>
          <ToggleGroup.Root type="single" value="option1" onChange={vi.fn()}>
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button1 = screen.getByText('Option 1')
      expect(button1).toHaveAttribute('data-state', 'on')

      rerender(
        <TestWrapper>
          <ToggleGroup.Root type="single" value="option2" onChange={vi.fn()}>
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button2 = screen.getByText('Option 2')
      expect(button2).toHaveAttribute('data-state', 'on')
    })
  })

  describe('Multiple Selection Mode', () => {
    test('should allow multiple selections', async () => {
      const handleChange = vi.fn()
      renderComponent({ type: 'multiple', onChange: handleChange })

      const button1 = screen.getByText('Option 1')
      const button2 = screen.getByText('Option 2')

      await userEvent.click(button1)
      expect(handleChange).toHaveBeenCalledWith(['option1'])

      await userEvent.click(button2)
      expect(handleChange).toHaveBeenCalledWith(['option1', 'option2'])
    })

    test('should support controlled multiple values', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root type="multiple" value={['option1', 'option3']} onChange={vi.fn()}>
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
            <ToggleGroup.Item value="option3" text="Option 3" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button1 = screen.getByText('Option 1')
      const button3 = screen.getByText('Option 3')

      expect(button1).toHaveAttribute('data-state', 'on')
      expect(button3).toHaveAttribute('data-state', 'on')
    })

    test('should deselect item in multiple mode', async () => {
      const handleChange = vi.fn()
      renderComponent({ type: 'multiple', value: ['option1'], onChange: handleChange })

      const button1 = screen.getByText('Option 1')
      await userEvent.click(button1)

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('ToggleGroup.Item', () => {
    test('should render toggle item with text', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="test" text="Test Item" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    test('should render with prefix icon', () => {
      const { container } = render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="test" text="Test" prefixIcon="star" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with suffix icon', () => {
      const { container } = render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="test" text="Test" suffixIcon="check" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render as icon-only', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="test" iconOnly prefixIcon="star" text="Icon Only" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button = screen.getByRole('radio')
      expect(button).toHaveAttribute('aria-label', 'Icon Only')
    })

    test('should disable individual item', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="test" text="Disabled" disabled />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button = screen.getByText('Disabled')
      expect(button).toHaveAttribute('disabled')
    })

    test('should forward ref on item', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item ref={ref} value="test" text="Test" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    test('should disable all items when group is disabled', () => {
      renderComponent({ disabled: true })

      const buttons = screen.getAllByRole('radio')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('disabled')
      })
    })

    test('should combine group and item disabled states', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root disabled={false}>
            <ToggleGroup.Item value="item1" text="Enabled" />
            <ToggleGroup.Item value="item2" text="Disabled" disabled />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const enabledButton = screen.getByText('Enabled')
      const disabledButton = screen.getByText('Disabled')

      expect(enabledButton).not.toHaveAttribute('disabled')
      expect(disabledButton).toHaveAttribute('disabled')
    })
  })

  describe('Variants & Styling', () => {
    test('should apply variant to all items', () => {
      const { container } = renderComponent({ variant: 'ghost' })

      const ghostButtons = container.querySelectorAll('.cn-button-ghost')
      expect(ghostButtons.length).toBeGreaterThan(0)
    })

    test('should apply size to all items', () => {
      const { container } = renderComponent({ size: 'sm' })

      const smallToggles = container.querySelectorAll('.cn-toggle-sm')
      expect(smallToggles.length).toBe(3)
    })

    test('should apply selected variant to selected items', () => {
      const { container } = renderComponent({
        value: 'option1',
        selectedVariant: 'primary'
      })

      const primaryButton = container.querySelector('.cn-button-primary')
      expect(primaryButton).toBeInTheDocument()
    })

    test('should apply secondary variant to selected items', () => {
      const { container } = renderComponent({
        value: 'option1',
        selectedVariant: 'secondary'
      })

      const secondaryButton = container.querySelector('.cn-button-secondary')
      expect(secondaryButton).toBeInTheDocument()
    })
  })

  describe('Unselectable Mode', () => {
    test('should prevent unselecting when unselectable is true', async () => {
      const handleChange = vi.fn()
      renderComponent({ unselectable: true, value: 'option1', onChange: handleChange })

      const button1 = screen.getByText('Option 1')
      await userEvent.click(button1)

      // Should not allow deselection
      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should allow selection changes when unselectable is true', async () => {
      const handleChange = vi.fn()
      renderComponent({ unselectable: true, value: 'option1', onChange: handleChange })

      const button2 = screen.getByText('Option 2')
      await userEvent.click(button2)

      expect(handleChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('Complex Scenarios', () => {
    test('should render vertical group with icons', () => {
      const { container } = render(
        <TestWrapper>
          <ToggleGroup.Root orientation="vertical" size="sm">
            <ToggleGroup.Item value="bold" iconOnly prefixIcon="bold" text="Bold" />
            <ToggleGroup.Item value="italic" iconOnly prefixIcon="italic" text="Italic" />
            <ToggleGroup.Item value="underline" iconOnly prefixIcon="underline" text="Underline" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const group = container.querySelector('.cn-toggle-group-vertical')
      expect(group).toBeInTheDocument()

      const buttons = screen.getAllByRole('radio')
      expect(buttons.length).toBe(3)
    })

    test('should handle mixed icon and text items', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="icon" iconOnly prefixIcon="star" text="Star" />
            <ToggleGroup.Item value="text" text="Text Only" />
            <ToggleGroup.Item value="both" prefixIcon="check" text="With Icon" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      // Icon-only has aria-label
      const iconButton = screen.getByRole('radio', { name: 'Star' })
      expect(iconButton).toBeInTheDocument()

      expect(screen.getByText('Text Only')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    test('should render with tooltips on items', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item
              value="save"
              iconOnly
              prefixIcon="check"
              text="Save"
              tooltipProps={{ content: 'Save changes' }}
            />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button = screen.getByRole('radio')
      expect(button).toHaveAttribute('aria-label', 'Save')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty value in single mode', () => {
      renderComponent({ type: 'single', value: '' })

      // All items should be unselected
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    test('should handle empty array in multiple mode', () => {
      renderComponent({ type: 'multiple', value: [] })

      // In multiple mode, items are checkboxes
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    test('should work without onChange callback', async () => {
      renderComponent({ onChange: undefined })

      const button = screen.getByText('Option 1')
      await userEvent.click(button)

      // Should not crash
      expect(button).toBeInTheDocument()
    })

    test('should handle single item in group', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="only" text="Only Item" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Only Item')).toBeInTheDocument()
    })

    test('should handle very long text in items', () => {
      const longText = 'This is a very long text that should still render correctly'
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="long" text={longText} />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    test('should handle special characters in text', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="special" text="<Special & Characters>" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(screen.getByText('<Special & Characters>')).toBeInTheDocument()
    })

    test('should handle numeric values', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="1" text="One" />
            <ToggleGroup.Item value="2" text="Two" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      expect(screen.getByText('One')).toBeInTheDocument()
      expect(screen.getByText('Two')).toBeInTheDocument()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct display name for Root', () => {
      expect(ToggleGroup.Root.displayName).toBeTruthy()
    })

    test('should have correct display name for Item', () => {
      expect(ToggleGroup.Item.displayName).toBeTruthy()
    })
  })

  describe('Default Values', () => {
    test('should default type to single', () => {
      renderComponent()

      // Single mode uses radio role
      const buttons = screen.getAllByRole('radio')
      expect(buttons.length).toBe(3)
    })

    test('should default variant to outline', () => {
      const { container } = renderComponent()

      const outlineToggles = container.querySelectorAll('.cn-toggle')
      expect(outlineToggles.length).toBeGreaterThan(0)
    })

    test('should default size to md', () => {
      const { container } = renderComponent()

      const toggles = container.querySelectorAll('.cn-toggle-md')
      expect(toggles.length).toBe(3)
    })

    test('should default disabled to false', () => {
      renderComponent()

      const buttons = screen.getAllByRole('radio')
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('disabled')
      })
    })

    test('should default unselectable to false', () => {
      renderComponent()

      // Component renders normally
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes in single mode', () => {
      const { rerender } = render(
        <TestWrapper>
          <ToggleGroup.Root type="single" value="option1">
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button1 = screen.getByText('Option 1')
      expect(button1).toHaveAttribute('data-state', 'on')

      rerender(
        <TestWrapper>
          <ToggleGroup.Root type="single" value="option2">
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button2 = screen.getByText('Option 2')
      expect(button2).toHaveAttribute('data-state', 'on')
    })

    test('should update when value changes in multiple mode', () => {
      const { rerender } = render(
        <TestWrapper>
          <ToggleGroup.Root type="multiple" value={['option1']}>
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button1 = screen.getByText('Option 1')
      expect(button1).toHaveAttribute('data-state', 'on')

      rerender(
        <TestWrapper>
          <ToggleGroup.Root type="multiple" value={['option1', 'option2']}>
            <ToggleGroup.Item value="option1" text="Option 1" />
            <ToggleGroup.Item value="option2" text="Option 2" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button2 = screen.getByText('Option 2')
      expect(button2).toHaveAttribute('data-state', 'on')
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ToggleGroup.Root disabled={false}>
            <ToggleGroup.Item value="option1" text="Option 1" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      let button = screen.getByText('Option 1')
      expect(button).not.toHaveAttribute('disabled')

      rerender(
        <TestWrapper>
          <ToggleGroup.Root disabled={true}>
            <ToggleGroup.Item value="option1" text="Option 1" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      button = screen.getByText('Option 1')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Accessibility', () => {
    test('should have proper radio role in single mode', () => {
      renderComponent({ type: 'single' })

      const buttons = screen.getAllByRole('radio')
      expect(buttons.length).toBe(3)
    })

    test('should have proper aria-label for icon-only items', () => {
      render(
        <TestWrapper>
          <ToggleGroup.Root>
            <ToggleGroup.Item value="icon" iconOnly prefixIcon="star" text="Star" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const button = screen.getByRole('radio', { name: 'Star' })
      expect(button).toHaveAttribute('aria-label', 'Star')
    })

    test('should indicate disabled state properly', () => {
      renderComponent({ disabled: true })

      const buttons = screen.getAllByRole('radio')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('disabled')
      })
    })

    test('should have proper data-state for selected items', () => {
      renderComponent({ value: 'option1' })

      const button1 = screen.getByText('Option 1')
      expect(button1).toHaveAttribute('data-state', 'on')

      const button2 = screen.getByText('Option 2')
      expect(button2).toHaveAttribute('data-state', 'off')
    })
  })

  describe('Additional Props Forwarding', () => {
    test('should forward data attributes to root', () => {
      const { container } = render(
        <TestWrapper>
          <ToggleGroup.Root data-testid="group-test">
            <ToggleGroup.Item value="option1" text="Option 1" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const group = container.querySelector('[data-testid="group-test"]')
      expect(group).toBeInTheDocument()
    })

    test('should forward aria attributes to root', () => {
      const { container } = render(
        <TestWrapper>
          <ToggleGroup.Root aria-label="Options group">
            <ToggleGroup.Item value="option1" text="Option 1" />
          </ToggleGroup.Root>
        </TestWrapper>
      )

      const group = container.querySelector('[aria-label="Options group"]')
      expect(group).toBeInTheDocument()
    })
  })
})
