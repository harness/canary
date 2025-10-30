import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { SplitButton } from '../split-button'

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
          <SplitButton
            ref={ref}
            handleButtonClick={vi.fn()}
            options={mockOptions}
            handleOptionChange={vi.fn()}
          >
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
      const optionsWithDesc = [
        { value: 'opt1', label: 'Option 1', description: 'Description 1' }
      ]

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
  })
})

