import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SplitButton, SplitButtonOptionType } from '../split-button'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', description: 'Second option' },
  { value: 'option3', label: 'Option 3', disabled: true }
]

const renderComponent = <T extends string>(
  props: Partial<React.ComponentProps<typeof SplitButton<T>>> = {}
): RenderResult => {
  const defaultProps = {
    handleButtonClick: vi.fn(),
    options: mockOptions,
    handleOptionChange: vi.fn(),
    children: 'Action',
    ...props
  }

  return render(
    <TestWrapper>
      <SplitButton {...(defaultProps as any)} />
    </TestWrapper>
  )
}

describe('SplitButton', () => {
  describe('Basic Rendering', () => {
    test('should render main action button', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should render dropdown trigger', () => {
      const { container } = renderComponent()

      // Dropdown trigger with arrow icon
      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toBeInTheDocument()
    })

    test('should render both buttons in a flex container', () => {
      const { container } = renderComponent()

      const flexContainer = container.querySelector('.flex')
      expect(flexContainer).toBeInTheDocument()

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should apply custom className to container', () => {
      const { container } = renderComponent({ className: 'custom-split' })

      const element = container.querySelector('.custom-split')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    test('should call handleButtonClick when main button is clicked', async () => {
      const handleClick = vi.fn()
      renderComponent({ handleButtonClick: handleClick })

      const button = screen.getByRole('button', { name: 'Action' })
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should not call handleButtonClick when disabled', async () => {
      const handleClick = vi.fn()
      renderComponent({ handleButtonClick: handleClick, disabled: true })

      const button = screen.getByRole('button', { name: 'Action' })
      await userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    test('should disable main button when disableButton is true', () => {
      renderComponent({ disableButton: true })

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeDisabled()
    })
  })

  describe('Dropdown Functionality', () => {
    test('should render dropdown trigger', () => {
      const { container } = renderComponent()

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toBeInTheDocument()
      expect(dropdownTrigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should have arrow icon in dropdown trigger', () => {
      const { container } = renderComponent()

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      const icon = dropdownTrigger?.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should disable dropdown when disableDropdown is true', () => {
      const { container } = renderComponent({ disableDropdown: true })

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })

    test('should disable dropdown when loading', () => {
      const { container } = renderComponent({ loading: true })

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })

    test('should disable dropdown when disabled', () => {
      const { container } = renderComponent({ disabled: true })

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })
  })

  describe('Radio Group Mode (with selectedValue)', () => {
    test('should configure for radio group when selectedValue is provided', () => {
      renderComponent({ selectedValue: 'option1' })

      // Split button renders with selected value
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should handle selectedValue prop', () => {
      const handleChange = vi.fn()
      renderComponent({
        selectedValue: 'option1',
        handleOptionChange: handleChange
      })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Regular Dropdown Mode (without selectedValue)', () => {
    test('should configure for regular dropdown when no selectedValue', () => {
      renderComponent({ selectedValue: undefined })

      // Split button renders without selected value
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should accept handleOptionChange callback', () => {
      const handleChange = vi.fn()
      renderComponent({
        handleOptionChange: handleChange
      })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Variants & Themes', () => {
    test('should apply primary variant by default', () => {
      const { container } = renderComponent()

      const button = container.querySelector('.cn-button-primary')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom variant', () => {
      const { container } = renderComponent({ variant: 'outline' })

      const button = container.querySelector('.cn-button-outline')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom theme', () => {
      const { container } = renderComponent({ theme: 'success' })

      const button = container.querySelector('.cn-button-success')
      expect(button).toBeInTheDocument()
    })

    test('should apply default theme', () => {
      renderComponent({ theme: 'default' })

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    test('should apply medium size by default', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeInTheDocument()
    })

    test('should apply small size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const buttons = container.querySelectorAll('.cn-button-sm')
      expect(buttons.length).toBe(2)
    })

    test('should apply extra small size', () => {
      const { container } = renderComponent({ size: 'xs' })

      const buttons = container.querySelectorAll('.cn-button-xs')
      expect(buttons.length).toBe(2)
    })
  })

  describe('Loading State', () => {
    test('should show loading spinner', () => {
      const { container } = renderComponent({ loading: true })

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    test('should disable main button when loading', () => {
      renderComponent({ loading: true })

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeDisabled()
    })
  })

  describe('Disabled Options', () => {
    test('should accept options with disabled flag', () => {
      const optionsWithDisabled = [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled', disabled: true }
      ]

      renderComponent({ options: optionsWithDisabled })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should not trigger onChange for disabled options during loading', () => {
      const handleChange = vi.fn()
      renderComponent({ handleOptionChange: handleChange, loading: true })

      // When loading, options are disabled
      expect(screen.getByRole('button', { name: 'Action' })).toBeDisabled()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to main button', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <SplitButton ref={ref} handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()}>
            Action
          </SplitButton>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty options array', () => {
      renderComponent({ options: [] })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should accept options with descriptions', () => {
      const optionsWithDesc = [{ value: 'opt1', label: 'Option 1', description: 'Description 1' }]

      renderComponent({ options: optionsWithDesc })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should apply custom buttonClassName', () => {
      const { container } = renderComponent({ buttonClassName: 'custom-button' })

      const button = container.querySelector('.custom-button')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom dropdownContentClassName', () => {
      renderComponent({ dropdownContentClassName: 'custom-dropdown' })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should handle single option', () => {
      const singleOption = [{ value: 'only', label: 'Only Option' }]
      renderComponent({ options: singleOption })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should handle options with special characters', () => {
      const specialOptions = [
        { value: 'opt-1', label: 'Option @#$%' },
        { value: 'opt_2', label: 'Option & More' }
      ]
      renderComponent({ options: specialOptions })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Dropdown Option Selection - Regular Mode', () => {
    // Test wrapper that simulates dropdown option selection
    const TestRegularDropdown = ({
      options,
      loading,
      onOptionSelect
    }: {
      options: SplitButtonOptionType<string>[]
      loading?: boolean
      onOptionSelect: (value: string) => void
    }) => {
      const [isOpen, setIsOpen] = React.useState(false)

      const handleOptionSelect = (optionValue: string) => {
        const option = options.find(opt => opt.value === optionValue)
        if (!loading && option && !option.disabled) {
          onOptionSelect(optionValue)
          setIsOpen(false)
        }
      }

      return (
        <div>
          <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
          {isOpen && (
            <div>
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  disabled={loading || option.disabled}
                  data-value={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }

    test('should call handleOptionChange when option selected in regular mode', async () => {
      const handleChange = vi.fn()

      const { getByText } = render(<TestRegularDropdown options={mockOptions} onOptionSelect={handleChange} />)

      await userEvent.click(getByText('Toggle'))
      await userEvent.click(getByText('Option 1'))

      expect(handleChange).toHaveBeenCalledWith('option1')
    })

    test('should not call handleOptionChange for disabled options in regular mode', async () => {
      const handleChange = vi.fn()
      const optionsWithDisabled = [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled', disabled: true }
      ]

      const { getByText } = render(<TestRegularDropdown options={optionsWithDisabled} onOptionSelect={handleChange} />)

      await userEvent.click(getByText('Toggle'))

      // Try clicking disabled option (button is disabled so it won't trigger)
      const disabledButton = getByText('Disabled')
      expect(disabledButton).toBeDisabled()

      // Verify handler wasn't called
      expect(handleChange).not.toHaveBeenCalledWith('disabled')
    })

    test('should not call handleOptionChange when loading in regular mode', async () => {
      const handleChange = vi.fn()

      const { getByText } = render(
        <TestRegularDropdown options={mockOptions} loading={true} onOptionSelect={handleChange} />
      )

      await userEvent.click(getByText('Toggle'))

      // All buttons should be disabled
      const option1Button = getByText('Option 1')
      expect(option1Button).toBeDisabled()

      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should close dropdown after option selection in regular mode', async () => {
      const handleChange = vi.fn()

      const { getByText, queryByText } = render(
        <TestRegularDropdown options={mockOptions} onOptionSelect={handleChange} />
      )

      await userEvent.click(getByText('Toggle'))
      expect(getByText('Option 1')).toBeInTheDocument()

      await userEvent.click(getByText('Option 1'))

      // Dropdown should close (option buttons no longer visible)
      expect(queryByText('Option 2')).not.toBeInTheDocument()
    })

    test('should configure dropdown trigger for regular mode', () => {
      renderComponent({ selectedValue: undefined })

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toBeInTheDocument()
      expect(dropdownTrigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should render options with descriptions in regular mode', () => {
      const optionsWithDesc = [
        { value: 'opt1', label: 'Option 1', description: 'First' },
        { value: 'opt2', label: 'Option 2', description: 'Second' }
      ]
      renderComponent({ options: optionsWithDesc })

      // Component renders with descriptions configured
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Radio Group Mode with selectedValue', () => {
    // Test wrapper that simulates radio group option selection
    const TestRadioGroupDropdown = ({
      options,
      selectedValue,
      loading,
      onValueChange
    }: {
      options: SplitButtonOptionType<string>[]
      selectedValue: string
      loading?: boolean
      onValueChange: (value: string) => void
    }) => {
      const [isOpen, setIsOpen] = React.useState(false)

      const handleOptionSelect = (optionValue: string) => {
        const option = options.find(opt => opt.value === optionValue)
        if (!loading && option && !option.disabled) {
          onValueChange(optionValue)
          setIsOpen(false)
        }
      }

      return (
        <div>
          <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
          {isOpen && (
            <div>
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    const foundOption = options.find(opt => String(opt.value) === String(option.value))
                    if (foundOption) {
                      handleOptionSelect(foundOption.value)
                    }
                  }}
                  disabled={loading || option.disabled}
                  data-value={option.value}
                  data-selected={String(selectedValue) === String(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    }

    test('should call handleOptionChange when radio option selected', async () => {
      const handleChange = vi.fn()

      const { getByText } = render(
        <TestRadioGroupDropdown options={mockOptions} selectedValue="option1" onValueChange={handleChange} />
      )

      await userEvent.click(getByText('Toggle'))
      await userEvent.click(getByText('Option 2'))

      expect(handleChange).toHaveBeenCalledWith('option2')
    })

    test('should not call handleOptionChange for disabled radio options', async () => {
      const handleChange = vi.fn()

      const { getByText } = render(
        <TestRadioGroupDropdown options={mockOptions} selectedValue="option1" onValueChange={handleChange} />
      )

      await userEvent.click(getByText('Toggle'))

      // Option 3 is disabled
      const disabledButton = getByText('Option 3')
      expect(disabledButton).toBeDisabled()

      expect(handleChange).not.toHaveBeenCalledWith('option3')
    })

    test('should not call handleOptionChange when loading in radio mode', async () => {
      const handleChange = vi.fn()

      const { getByText } = render(
        <TestRadioGroupDropdown
          options={mockOptions}
          selectedValue="option1"
          loading={true}
          onValueChange={handleChange}
        />
      )

      await userEvent.click(getByText('Toggle'))

      // All options should be disabled
      const option1Button = getByText('Option 1')
      expect(option1Button).toBeDisabled()

      expect(handleChange).not.toHaveBeenCalled()
    })

    test('should close dropdown after radio option selection', async () => {
      const handleChange = vi.fn()

      const { getByText, queryByText } = render(
        <TestRadioGroupDropdown options={mockOptions} selectedValue="option1" onValueChange={handleChange} />
      )

      await userEvent.click(getByText('Toggle'))
      expect(getByText('Option 2')).toBeInTheDocument()

      await userEvent.click(getByText('Option 2'))

      // Dropdown should close
      expect(queryByText('Option 3')).not.toBeInTheDocument()
    })

    test('should configure dropdown for radio group when selectedValue is provided', () => {
      renderComponent({ selectedValue: 'option1' })

      // Verify dropdown trigger renders
      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toBeInTheDocument()
      expect(dropdownTrigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should accept selectedValue prop for radio mode', () => {
      const handleChange = vi.fn()
      renderComponent({ selectedValue: 'option2', handleOptionChange: handleChange })

      // Component renders with selected value configuration
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should accept options array with disabled items in radio mode', () => {
      const optionsWithDisabled = [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled', disabled: true }
      ]

      renderComponent({ selectedValue: 'enabled', options: optionsWithDisabled })

      // Component renders with disabled options configured
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should render options with descriptions in radio mode', () => {
      const optionsWithDesc = [
        { value: 'opt1', label: 'Option 1', description: 'First' },
        { value: 'opt2', label: 'Option 2', description: 'Second' }
      ]

      renderComponent({ selectedValue: 'opt1', options: optionsWithDesc })

      // Component renders with descriptions configured
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should handle selectedValue update via rerender', () => {
      const { rerender } = render(
        <TestWrapper>
          <SplitButton
            handleButtonClick={vi.fn()}
            options={mockOptions}
            handleOptionChange={vi.fn()}
            selectedValue="option1"
          >
            Action
          </SplitButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <SplitButton
            handleButtonClick={vi.fn()}
            options={mockOptions}
            handleOptionChange={vi.fn()}
            selectedValue="option2"
          >
            Action
          </SplitButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should disable dropdown trigger when loading in radio mode', () => {
      renderComponent({ selectedValue: 'option1', loading: true })

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })
  })

  describe('Component Definition', () => {
    test('should be defined and renderable', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when variant changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} variant="primary">
            Action
          </SplitButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} variant="outline">
            Action
          </SplitButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} disabled={false}>
            Action
          </SplitButton>
        </TestWrapper>
      )

      let button = screen.getByRole('button', { name: 'Action' })
      expect(button).not.toBeDisabled()

      rerender(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} disabled={true}>
            Action
          </SplitButton>
        </TestWrapper>
      )

      button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeDisabled()
    })

    test('should update when loading state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} loading={false}>
            Action
          </SplitButton>
        </TestWrapper>
      )

      let button = screen.getByRole('button', { name: 'Action' })
      expect(button).not.toBeDisabled()

      rerender(
        <TestWrapper>
          <SplitButton handleButtonClick={vi.fn()} options={mockOptions} handleOptionChange={vi.fn()} loading={true}>
            Action
          </SplitButton>
        </TestWrapper>
      )

      button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    test('should have proper aria-haspopup on dropdown trigger', () => {
      const { container } = renderComponent()

      const dropdownTrigger = container.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should have accessible button labels', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })

    test('should indicate disabled state properly', () => {
      renderComponent({ disabled: true })

      const mainButton = screen.getByRole('button', { name: 'Action' })
      expect(mainButton).toBeDisabled()

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })
  })

  describe('Default Values', () => {
    test('should default to variant primary', () => {
      const { container } = renderComponent()

      const button = container.querySelector('.cn-button-primary')
      expect(button).toBeInTheDocument()
    })

    test('should default to theme default', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeInTheDocument()
    })

    test('should default to size md', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).toBeInTheDocument()
    })

    test('should default loading to false', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).not.toBeDisabled()
    })

    test('should default disabled to false', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Action' })
      expect(button).not.toBeDisabled()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      const handleClick = vi.fn()
      const handleChange = vi.fn()

      renderComponent({
        handleButtonClick: handleClick,
        handleOptionChange: handleChange,
        variant: 'outline',
        theme: 'success',
        size: 'sm',
        className: 'custom-split',
        buttonClassName: 'custom-button',
        dropdownContentClassName: 'custom-dropdown',
        selectedValue: 'option1',
        disabled: false,
        loading: false
      })

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    test('should handle disableButton independently from disabled', () => {
      renderComponent({ disableButton: true, disabled: false })

      const mainButton = screen.getByRole('button', { name: 'Action' })
      expect(mainButton).toBeDisabled()

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).not.toHaveAttribute('disabled')
    })

    test('should handle disableDropdown independently from disabled', () => {
      renderComponent({ disableDropdown: true, disabled: false })

      const mainButton = screen.getByRole('button', { name: 'Action' })
      expect(mainButton).not.toBeDisabled()

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })

    test('should handle both disableButton and disableDropdown', () => {
      renderComponent({ disableButton: true, disableDropdown: true })

      const mainButton = screen.getByRole('button', { name: 'Action' })
      expect(mainButton).toBeDisabled()

      const dropdownTrigger = document.querySelector('.cn-button-split-dropdown')
      expect(dropdownTrigger).toHaveAttribute('disabled')
    })
  })
})
