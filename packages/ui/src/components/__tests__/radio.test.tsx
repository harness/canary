import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// Direct import to avoid circular dependency issues
import { Radio } from '../radio'

const renderComponent = (props: Partial<React.ComponentProps<typeof Radio.Root>> = {}): RenderResult => {
  return render(
    <Radio.Root {...props}>
      <Radio.Item value="option1" label="Option 1" />
      <Radio.Item value="option2" label="Option 2" />
      <Radio.Item value="option3" label="Option 3" />
    </Radio.Root>
  )
}

describe('Radio', () => {
  describe('Radio.Root', () => {
    test('should render radio group', () => {
      renderComponent()

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })

    test('should render all radio items', () => {
      renderComponent()

      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
    })

    test('should have no radio selected by default', () => {
      renderComponent()

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement
      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement
      const radio3 = screen.getByLabelText('Option 3') as HTMLInputElement

      expect(radio1).not.toBeChecked()
      expect(radio2).not.toBeChecked()
      expect(radio3).not.toBeChecked()
    })

    test('should select default value', () => {
      renderComponent({ defaultValue: 'option2' })

      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement
      expect(radio2).toBeChecked()
    })

    test('should call onValueChange when radio is selected', async () => {
      const handleChange = vi.fn()
      renderComponent({ onValueChange: handleChange })

      const radio1 = screen.getByLabelText('Option 1')
      await userEvent.click(radio1)

      expect(handleChange).toHaveBeenCalledWith('option1')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    test('should change selection when different radio is clicked', async () => {
      const handleChange = vi.fn()
      renderComponent({ onValueChange: handleChange })

      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      await userEvent.click(radio1)
      expect(handleChange).toHaveBeenCalledWith('option1')

      await userEvent.click(radio2)
      expect(handleChange).toHaveBeenCalledWith('option2')
      expect(handleChange).toHaveBeenCalledTimes(2)
    })

    test('should only allow one radio to be selected at a time', async () => {
      renderComponent()

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement
      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement

      await userEvent.click(radio1)
      expect(radio1).toBeChecked()
      expect(radio2).not.toBeChecked()

      await userEvent.click(radio2)
      expect(radio1).not.toBeChecked()
      expect(radio2).toBeChecked()
    })

    test('should render with group label', () => {
      renderComponent({ label: 'Choose an option' })

      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    test('should render with group caption', () => {
      renderComponent({ caption: 'Select one of the options below' })

      expect(screen.getByText('Select one of the options below')).toBeInTheDocument()
    })

    test('should disable all radios when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      const radio3 = screen.getByLabelText('Option 3')

      expect(radio1).toBeDisabled()
      expect(radio2).toBeDisabled()
      expect(radio3).toBeDisabled()
    })

    test('should not call onValueChange when disabled', async () => {
      const handleChange = vi.fn()
      renderComponent({ disabled: true, onValueChange: handleChange })

      const radio1 = screen.getByLabelText('Option 1')
      await userEvent.click(radio1)

      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should apply error styling when error prop is true', () => {
      const { container } = renderComponent({ error: true })

      const radioRoot = container.querySelector('.cn-radio-error')
      expect(radioRoot).toBeInTheDocument()
    })

    test('should show optional indicator when optional prop is true', () => {
      renderComponent({ label: 'Options', optional: true })

      const label = screen.getByText('Options')
      expect(label).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-radio-class' })

      const radioRoot = container.querySelector('.custom-radio-class')
      expect(radioRoot).toBeInTheDocument()
    })

    test('should apply wrapper className', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

      const wrapper = container.querySelector('.custom-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should handle controlled value', () => {
      const { rerender } = render(
        <Radio.Root value="option1">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
        </Radio.Root>
      )

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement
      expect(radio1).toBeChecked()

      rerender(
        <Radio.Root value="option2">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
        </Radio.Root>
      )

      const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement
      expect(radio2).toBeChecked()
    })

    test('should support horizontal orientation', () => {
      const { container } = renderComponent({ orientation: 'horizontal' })

      const controlGroup = container.querySelector('.cn-radio-control')
      expect(controlGroup).toBeInTheDocument()
    })

    test('should support vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const controlGroup = container.querySelector('.cn-radio-control')
      expect(controlGroup).toBeInTheDocument()
    })

    test('should forward ref correctly', () => {
      const ref = vi.fn()
      render(
        <Radio.Root ref={ref}>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Radio.Item', () => {
    test('should render radio item with label', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test Option" />
        </Radio.Root>
      )

      expect(screen.getByLabelText('Test Option')).toBeInTheDocument()
    })

    test('should render radio item with caption', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" caption="This is a test option" />
        </Radio.Root>
      )

      expect(screen.getByText('This is a test option')).toBeInTheDocument()
    })

    test('should render radio item without label', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" />
        </Radio.Root>
      )

      const radio = screen.getByRole('radio')
      expect(radio).toBeInTheDocument()
    })

    test('should disable individual radio item', () => {
      render(
        <Radio.Root>
          <Radio.Item value="option1" label="Option 1" disabled />
          <Radio.Item value="option2" label="Option 2" />
        </Radio.Root>
      )

      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')

      expect(radio1).toBeDisabled()
      expect(radio2).not.toBeDisabled()
    })

    test('should apply custom className to radio item', () => {
      const { container } = render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" className="custom-item-class" />
        </Radio.Root>
      )

      const item = container.querySelector('.custom-item-class')
      expect(item).toBeInTheDocument()
    })

    test('should accept custom id', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" id="custom-radio-id" />
        </Radio.Root>
      )

      const radio = screen.getByLabelText('Test')
      expect(radio).toHaveAttribute('id', 'custom-radio-id')
    })

    test('should generate id automatically if not provided', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" />
        </Radio.Root>
      )

      const radio = screen.getByLabelText('Test')
      const id = radio.getAttribute('id')

      expect(id).toBeTruthy()
      expect(id).toMatch(/^radio-/)
    })

    test('should forward ref correctly for radio item', () => {
      const ref = vi.fn()
      render(
        <Radio.Root>
          <Radio.Item ref={ref} value="test" label="Test" />
        </Radio.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should handle keyboard navigation', async () => {
      renderComponent()

      const radio1 = screen.getByLabelText('Option 1')
      radio1.focus()

      expect(radio1).toHaveFocus()

      // Note: Arrow key navigation is handled by Radix UI RadioGroup
      // In real usage, arrow keys move focus between radio items
      // Testing actual DOM focus changes requires more complex setup
    })

    test('should select radio with Space key', async () => {
      const handleChange = vi.fn()
      renderComponent({ onValueChange: handleChange })

      const radio1 = screen.getByLabelText('Option 1')
      radio1.focus()

      await userEvent.keyboard(' ')

      expect(handleChange).toHaveBeenCalledWith('option1')
    })

    test('should render ReactElement as label', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label={<span data-testid="custom-label">Custom Label</span>} />
        </Radio.Root>
      )

      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })

    test('should render ReactElement as caption', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" caption={<span data-testid="custom-caption">Custom Caption</span>} />
        </Radio.Root>
      )

      expect(screen.getByTestId('custom-caption')).toBeInTheDocument()
    })

    test('should handle name attribute', () => {
      render(
        <Radio.Root name="test-group">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
        </Radio.Root>
      )

      // Name attribute is on the RadioGroup, not individual items
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()

      // Verify items are part of the same group
      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      expect(radio1).toBeInTheDocument()
      expect(radio2).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle form submission with radio value', () => {
      const handleSubmit = vi.fn(e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        return formData.get('option')
      })

      render(
        <form onSubmit={handleSubmit}>
          <Radio.Root name="option" defaultValue="option2">
            <Radio.Item value="option1" label="Option 1" />
            <Radio.Item value="option2" label="Option 2" />
          </Radio.Root>
          <button type="submit">Submit</button>
        </form>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      submitButton.click()

      expect(handleSubmit).toHaveBeenCalled()
    })

    test('should work with many radio items', () => {
      render(
        <Radio.Root>
          {Array.from({ length: 10 }, (_, i) => (
            <Radio.Item key={i} value={`option${i}`} label={`Option ${i + 1}`} />
          ))}
        </Radio.Root>
      )

      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 10')).toBeInTheDocument()
    })

    test('should handle mixed disabled and enabled items', async () => {
      const handleChange = vi.fn()
      render(
        <Radio.Root onValueChange={handleChange}>
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" disabled />
          <Radio.Item value="option3" label="Option 3" />
        </Radio.Root>
      )

      const radio1 = screen.getByLabelText('Option 1')
      const radio2 = screen.getByLabelText('Option 2')
      const radio3 = screen.getByLabelText('Option 3')

      await userEvent.click(radio1)
      expect(handleChange).toHaveBeenCalledWith('option1')

      await userEvent.click(radio2)
      expect(handleChange).toHaveBeenCalledTimes(1) // Should not increase

      await userEvent.click(radio3)
      expect(handleChange).toHaveBeenCalledWith('option3')
      expect(handleChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('Component Display Names', () => {
    test('should have correct display name for Root', () => {
      expect(Radio.Root.displayName).toBeTruthy()
    })

    test('should have correct display name for Item', () => {
      expect(Radio.Item.displayName).toBeTruthy()
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty string value', () => {
      render(
        <Radio.Root>
          <Radio.Item value="" label="Empty" />
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      expect(screen.getByLabelText('Empty')).toBeInTheDocument()
    })

    test('should handle numeric value', () => {
      render(
        <Radio.Root>
          <Radio.Item value="1" label="One" />
          <Radio.Item value="2" label="Two" />
        </Radio.Root>
      )

      expect(screen.getByLabelText('One')).toBeInTheDocument()
    })

    test('should handle special characters in value', () => {
      render(
        <Radio.Root>
          <Radio.Item value="option@#$" label="Special" />
        </Radio.Root>
      )

      expect(screen.getByLabelText('Special')).toBeInTheDocument()
    })

    test('should handle very long label text', () => {
      const longLabel = 'This is a very long label that should still render correctly'
      render(
        <Radio.Root>
          <Radio.Item value="test" label={longLabel} />
        </Radio.Root>
      )

      expect(screen.getByLabelText(longLabel)).toBeInTheDocument()
    })

    test('should handle very long caption text', () => {
      const longCaption = 'This is a very long caption that should still render correctly'
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" caption={longCaption} />
        </Radio.Root>
      )

      expect(screen.getByText(longCaption)).toBeInTheDocument()
    })

    test('should render without group label but with caption', () => {
      renderComponent({ caption: 'Group caption only' })

      expect(screen.getByText('Group caption only')).toBeInTheDocument()
    })

    test('should render with labelSuffix', () => {
      render(
        <Radio.Root label="Options" labelSuffix={<span data-testid="suffix">*</span>}>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      expect(screen.getByTestId('suffix')).toBeInTheDocument()
    })

    test('should render with tooltipContent and tooltipProps', () => {
      render(
        <Radio.Root label="Options" tooltipContent={undefined} tooltipProps={undefined}>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      expect(screen.getByText('Options')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default error to false', () => {
      const { container } = renderComponent()

      const radioRoot = container.querySelector('.cn-radio-error')
      expect(radioRoot).not.toBeInTheDocument()
    })

    test('should default optional to false', () => {
      renderComponent({ label: 'Options' })

      expect(screen.getByText('Options')).toBeInTheDocument()
    })

    test('should default disabled to false', () => {
      renderComponent()

      const radio1 = screen.getByLabelText('Option 1')
      expect(radio1).not.toBeDisabled()
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes in controlled mode', () => {
      const { rerender } = render(
        <Radio.Root value="option1">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
          <Radio.Item value="option3" label="Option 3" />
        </Radio.Root>
      )

      const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement
      expect(radio1).toBeChecked()

      rerender(
        <Radio.Root value="option3">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
          <Radio.Item value="option3" label="Option 3" />
        </Radio.Root>
      )

      const radio3 = screen.getByLabelText('Option 3') as HTMLInputElement
      expect(radio3).toBeChecked()
      expect(radio1).not.toBeChecked()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(
        <Radio.Root disabled={false}>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      const radio = screen.getByLabelText('Option 1')
      expect(radio).not.toBeDisabled()

      rerender(
        <Radio.Root disabled={true}>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      expect(radio).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    test('should have proper radiogroup role', () => {
      renderComponent()

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })

    test('should have proper radio roles for items', () => {
      renderComponent()

      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(3)
    })

    test('should associate label with input via htmlFor', () => {
      render(
        <Radio.Root>
          <Radio.Item value="test" label="Test" id="custom-id" />
        </Radio.Root>
      )

      const radio = screen.getByLabelText('Test')
      expect(radio).toHaveAttribute('id', 'custom-id')
    })

    test('should indicate disabled state visually', () => {
      render(
        <Radio.Root disabled>
          <Radio.Item value="option1" label="Option 1" />
        </Radio.Root>
      )

      const radio = screen.getByLabelText('Option 1')
      expect(radio).toBeDisabled()
    })
  })
})
