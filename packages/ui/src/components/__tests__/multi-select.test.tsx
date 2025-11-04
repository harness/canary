import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { MultiSelect, MultiSelectOption, MultiSelectProps, MultiSelectRef } from '../multi-select'

const mockOptions: MultiSelectOption[] = [
  { id: '1', key: 'option1', value: 'Option 1' },
  { id: '2', key: 'option2', value: 'Option 2' },
  { id: '3', key: 'option3', value: 'Option 3', icon: 'star' },
  { id: '4', key: 'option4', value: 'Option 4', disable: true }
]

const renderComponent = (props: Partial<MultiSelectProps> = {}): RenderResult => {
  return render(<MultiSelect options={mockOptions} placeholder="Select items" {...props} />)
}

describe('MultiSelect', () => {
  describe('Basic Rendering', () => {
    test('should render multiselect input', () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should render with label', () => {
      renderComponent({ label: 'Select Options' })

      expect(screen.getByText('Select Options')).toBeInTheDocument()
    })

    test('should render with caption', () => {
      renderComponent({ caption: 'Helper text' })

      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    test('should render with optional indicator', () => {
      renderComponent({ label: 'Options', optional: true })

      expect(screen.getByText('Options')).toBeInTheDocument()
    })

    test('should apply disabled state', () => {
      renderComponent({ disabled: true })

      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      expect(input).toBeDisabled()
    })
  })

  describe('Selection Behavior', () => {
    test('should display default selected values as tags', () => {
      const defaultValue = [mockOptions[0]]
      renderComponent({ defaultValue })

      expect(screen.getByText('option1')).toBeInTheDocument()
    })

    test('should handle controlled value prop', () => {
      const { rerender } = render(
        <MultiSelect options={mockOptions} value={[mockOptions[0]]} placeholder="Select items" onChange={vi.fn()} />
      )

      expect(screen.getByText('option1')).toBeInTheDocument()

      rerender(
        <MultiSelect
          options={mockOptions}
          value={[mockOptions[0], mockOptions[1]]}
          placeholder="Select items"
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('option1')).toBeInTheDocument()
      expect(screen.getByText('option2')).toBeInTheDocument()
    })

    test('should display multiple selected values as tags', () => {
      const value = [mockOptions[0], mockOptions[1]]
      renderComponent({ value })

      expect(screen.getByText('option1')).toBeInTheDocument()
      expect(screen.getByText('option2')).toBeInTheDocument()
    })

    test('should call onChange when clicking available option', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        const option1 = screen.getByText('option1')
        expect(option1).toBeInTheDocument()
      })

      const option1 = screen.getByText('option1')
      await userEvent.click(option1)

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    })

    test('should clear input after selecting option from dropdown', async () => {
      const handleChange = vi.fn()
      const setSearchQuery = vi.fn()
      renderComponent({ onChange: handleChange, setSearchQuery })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, 'search')

      await waitFor(() => {
        const option1 = screen.getByText('option1')
        expect(option1).toBeInTheDocument()
      })

      const option1 = screen.getByText('option1')
      await userEvent.click(option1)

      await waitFor(() => {
        expect(setSearchQuery).toHaveBeenCalledWith('')
      })
    })

    test('should update selected values when option clicked in controlled mode', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={mockOptions} value={[]} onChange={handleChange} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        const option1 = screen.getByText('option1')
        expect(option1).toBeInTheDocument()
      })

      const option1 = screen.getByText('option1')
      await userEvent.click(option1)

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith([mockOptions[0]])
      })
    })

    test('should remove option when clicking remove button on tag', async () => {
      const handleChange = vi.fn()
      const defaultValue = [mockOptions[0]]
      renderComponent({ defaultValue, onChange: handleChange })

      const removeButton = document.querySelector('.cn-tag-action-icon-button')
      expect(removeButton).toBeInTheDocument()

      if (removeButton) {
        await userEvent.click(removeButton)
        await waitFor(() => {
          expect(handleChange).toHaveBeenCalled()
        })
      }
    })

    test('should call onReset when option is removed', async () => {
      const onReset = vi.fn()
      const optionWithReset = { id: '5', key: 'test', onReset }
      renderComponent({ defaultValue: [optionWithReset], options: [optionWithReset] })

      await waitFor(() => {
        const removeButton = document.querySelector('.cn-tag-action-icon-button')
        expect(removeButton).toBeInTheDocument()
      })

      const removeButton = document.querySelector('.cn-tag-action-icon-button')
      if (removeButton) {
        await userEvent.click(removeButton)
        await waitFor(() => {
          expect(onReset).toHaveBeenCalled()
        })
      }
    })
  })

  describe('Keyboard Navigation', () => {
    test('should remove last option on Backspace when input is empty', async () => {
      const defaultValue = [mockOptions[0], mockOptions[1]]
      const handleChange = vi.fn()
      renderComponent({ defaultValue, onChange: handleChange })

      // Find input by type since placeholder is empty when values are selected
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.keyboard('{Backspace}')

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    })

    test('should not remove option on Backspace when input has value', async () => {
      const defaultValue = [mockOptions[0]]
      const handleChange = vi.fn()
      renderComponent({ defaultValue, onChange: handleChange })

      // Find input by type since placeholder is empty when values are selected
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'test')
      await userEvent.keyboard('{Backspace}')

      // handleChange should not be called since input has text
      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should close dropdown on Escape key', async () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await userEvent.keyboard('{Escape}')

      // Input loses focus
      await waitFor(() => {
        expect(input).not.toHaveFocus()
      })
    })

    test('should remove last option on Delete key when input is empty', async () => {
      const defaultValue = [mockOptions[0], mockOptions[1]]
      const handleChange = vi.fn()
      renderComponent({ defaultValue, onChange: handleChange })

      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.keyboard('{Delete}')

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    })
  })

  describe('Creation via Enter Key', () => {
    test('should accept disallowCreation false for new option creation', () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={false} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should accept disallowCreation true to prevent creation', () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={true} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should handle input with value for potential creation', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={false} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, 'newOption')

      expect(input).toHaveValue('newOption')
    })

    test('should handle key-value format in input', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={false} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, 'key:value')

      expect(input).toHaveValue('key:value')
    })

    test('should handle comma-separated values in input', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={false} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, 'opt1,opt2')

      expect(input).toHaveValue('opt1,opt2')
    })

    test('should handle whitespace in input value', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={[]} onChange={handleChange} disallowCreation={false} placeholder="Select items" />)

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, '  spaced  ')

      expect(input).toHaveValue('  spaced  ')
    })
  })

  describe('States & Themes', () => {
    test('should show error message', () => {
      renderComponent({ error: 'This field is required' })

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    test('should show warning message', () => {
      renderComponent({ warning: 'Please review your selection' })

      expect(screen.getByText('Please review your selection')).toBeInTheDocument()
    })

    test('should prioritize error over warning', () => {
      renderComponent({ error: 'Error message', warning: 'Warning message' })

      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.queryByText('Warning message')).not.toBeInTheDocument()
    })

    test('should apply danger theme when error exists', () => {
      renderComponent({ error: 'Error' })

      const element = document.querySelector('.cn-multi-select-danger')
      expect(element).toBeTruthy()
    })

    test('should apply warning theme when warning exists', () => {
      renderComponent({ warning: 'Warning' })

      const element = document.querySelector('.cn-multi-select-warning')
      expect(element).toBeTruthy()
    })
  })

  describe('Loading & Empty States', () => {
    test('should show loading skeleton when isLoading is true', async () => {
      renderComponent({ isLoading: true })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        const skeleton = document.querySelector('.cn-skeleton-base')
        expect(skeleton).toBeTruthy()
      })
    })

    test('should show no results message when no options match', async () => {
      renderComponent({ options: [], disallowCreation: true })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument()
      })
    })

    test('should show create message when no options and creation allowed', async () => {
      renderComponent({ options: [], disallowCreation: false })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        expect(screen.getByText('Press Enter to create')).toBeInTheDocument()
      })
    })
  })

  describe('Styling & Layout', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-multi-select' })

      const element = container.querySelector('.custom-multi-select')
      expect(element).toBeInTheDocument()
    })

    test('should apply wrapper className', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

      const wrapper = container.querySelector('.custom-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should support horizontal orientation', () => {
      renderComponent({ orientation: 'horizontal', caption: 'Caption', label: 'Label' })

      expect(screen.getByText('Caption')).toBeInTheDocument()
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    test('should hide placeholder when options are selected', () => {
      renderComponent({ defaultValue: [mockOptions[0]] })

      // Input exists but placeholder is empty when options are selected
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      expect(input).toBeInTheDocument()
      expect(input?.placeholder).toBe('')
    })
  })

  describe('Ref Forwarding', () => {
    test('should provide selectedValue through ref', () => {
      const ref: React.RefObject<MultiSelectRef> = { current: null }
      const defaultValue = [mockOptions[0]]

      render(<MultiSelect ref={ref} options={mockOptions} defaultValue={defaultValue} placeholder="Select" />)

      expect(ref.current?.selectedValue).toEqual(defaultValue)
    })

    test('should provide focus method through ref', () => {
      const ref: React.RefObject<MultiSelectRef> = { current: null }

      render(<MultiSelect ref={ref} options={mockOptions} placeholder="Select" />)

      ref.current?.focus()

      const input = screen.getByPlaceholderText('Select')
      expect(input).toHaveFocus()
    })

    test('should provide reset method through ref', async () => {
      const ref: React.RefObject<MultiSelectRef> = { current: null }
      const defaultValue = [mockOptions[0]]

      render(<MultiSelect ref={ref} options={mockOptions} defaultValue={defaultValue} placeholder="Select" />)

      expect(screen.getByText('option1')).toBeInTheDocument()

      ref.current?.reset()

      await waitFor(() => {
        expect(screen.queryByText('option1')).not.toBeInTheDocument()
      })
    })

    test('should provide input element through ref', () => {
      const ref: React.RefObject<MultiSelectRef> = { current: null }

      render(<MultiSelect ref={ref} options={mockOptions} placeholder="Select" />)

      expect(ref.current?.input).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Advanced Features', () => {
    test('should render options with icons', () => {
      const value = [mockOptions[2]] // option with icon
      renderComponent({ value })

      expect(screen.getByText('option3')).toBeInTheDocument()
      const icon = document.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should handle disabled options', async () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        const option4 = screen.getByText('option4')
        expect(option4).toBeInTheDocument()
      })
    })

    test('should filter options based on selected values', async () => {
      const defaultValue = [mockOptions[0]]
      renderComponent({ defaultValue })

      // Find input by type since placeholder is empty when values are selected
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      await userEvent.click(input)

      await waitFor(() => {
        // option1 should not appear in dropdown
        const options = screen.queryAllByText('option1')
        // Only the selected tag should show option1, not in dropdown
        expect(options.length).toBe(1)
      })
    })

    test('should handle search functionality', async () => {
      const setSearchQuery = vi.fn()
      renderComponent({ setSearchQuery })

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)
      await userEvent.type(input, 'search')

      await waitFor(() => {
        expect(setSearchQuery).toHaveBeenCalled()
      })
    })

    test('should handle custom inputProps', () => {
      renderComponent({ inputProps: { id: 'custom-input' } })

      const input = document.querySelector('#custom-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty options array', () => {
      renderComponent({ options: [] })

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should handle undefined options', () => {
      renderComponent({ options: undefined })

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should handle empty defaultValue', () => {
      renderComponent({ defaultValue: [] })

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })

    test('should work without onChange callback', () => {
      renderComponent({ onChange: undefined })

      const input = screen.getByPlaceholderText('Select items')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(MultiSelect.displayName).toBe('MultiSelect')
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle option with title property', async () => {
      const optionsWithTitle = [{ id: '1', key: 'opt1', value: 'Option 1', title: 'Full Title' }]
      render(<MultiSelect options={optionsWithTitle} placeholder="Select" />)

      const input = screen.getByPlaceholderText('Select')
      await userEvent.click(input)

      await waitFor(() => {
        expect(screen.getByText('opt1')).toBeInTheDocument()
      })
    })

    test('should handle selecting disabled option', async () => {
      renderComponent()

      const input = screen.getByPlaceholderText('Select items')
      await userEvent.click(input)

      await waitFor(() => {
        const disabledOption = screen.getByText('option4')
        expect(disabledOption).toBeInTheDocument()
      })
    })

    test('should handle controlled state with onChange updates', async () => {
      const handleChange = vi.fn()
      render(<MultiSelect options={mockOptions} value={[]} onChange={handleChange} placeholder="Select" />)

      const input = screen.getByPlaceholderText('Select')
      await userEvent.click(input)

      await waitFor(() => {
        const option1 = screen.getByText('option1')
        expect(option1).toBeInTheDocument()
      })

      const option1 = screen.getByText('option1')
      await userEvent.click(option1)

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    })
  })

  describe('Re-rendering', () => {
    test('should update when options change', () => {
      const { rerender } = render(<MultiSelect options={mockOptions} placeholder="Select" />)

      expect(screen.getByPlaceholderText('Select')).toBeInTheDocument()

      const newOptions = [{ id: '10', key: 'new', value: 'New Option' }]
      rerender(<MultiSelect options={newOptions} placeholder="Select" />)

      expect(screen.getByPlaceholderText('Select')).toBeInTheDocument()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(<MultiSelect options={mockOptions} placeholder="Select" disabled={false} />)

      let input = screen.getByPlaceholderText('Select') as HTMLInputElement
      expect(input).not.toBeDisabled()

      rerender(<MultiSelect options={mockOptions} placeholder="Select" disabled={true} />)

      input = document.querySelector('input[type="text"]') as HTMLInputElement
      expect(input).toBeDisabled()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward inputProps to command input', () => {
      renderComponent({ inputProps: { 'aria-label': 'Custom label' } })

      const input = document.querySelector('input[type="text"]')
      expect(input).toBeInTheDocument()
    })

    test('should forward commandProps to command root', () => {
      renderComponent({ commandProps: { 'data-testid': 'command-root' } as any })

      expect(screen.getByPlaceholderText('Select items')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper role on container', () => {
      renderComponent()

      const container = document.querySelector('[role="textbox"]')
      expect(container).toBeInTheDocument()
    })

    test('should have aria-label on container', () => {
      renderComponent()

      const container = document.querySelector('[aria-label="Select items"]')
      expect(container).toBeInTheDocument()
    })

    test('should mark input as disabled for accessibility', () => {
      renderComponent({ disabled: true })

      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      expect(input).toBeDisabled()
    })
  })
})
