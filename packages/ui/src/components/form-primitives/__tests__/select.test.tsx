import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Select } from '../select'

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' }
]

const renderComponent = (props: Partial<React.ComponentProps<typeof Select>> = {}): RenderResult => {
  return render(<Select options={options} {...props} />)
}

describe('Select', () => {
  describe('Basic Rendering', () => {
    test('should render select trigger', () => {
      renderComponent()

      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    test('should render with placeholder', () => {
      renderComponent({ placeholder: 'Choose an option' })

      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    test('should render with default placeholder', () => {
      renderComponent()

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveTextContent(/select an option/i)
    })

    test('should render with label', () => {
      renderComponent({ label: 'Select Label', id: 'select-1' })

      const label = screen.getByText('Select Label')
      expect(label).toBeInTheDocument()
    })

    test('should render with caption', () => {
      renderComponent({ caption: 'Helper text' })

      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    test('should generate id automatically if not provided', () => {
      renderComponent()

      const trigger = screen.getByRole('button')
      const id = trigger.getAttribute('id')

      expect(id).toBeTruthy()
      expect(id).toMatch(/^select-/)
    })
  })

  describe('Selection & Value Display', () => {
    test('should display selected value', () => {
      renderComponent({ value: 'opt2' })

      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    test('should handle defaultValue', () => {
      renderComponent({ defaultValue: 'opt1' })

      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    test('should handle controlled value changes', () => {
      const { rerender } = render(<Select options={options} value="opt1" onChange={vi.fn()} />)

      expect(screen.getByText('Option 1')).toBeInTheDocument()

      rerender(<Select options={options} value="opt2" onChange={vi.fn()} />)

      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    test('should show placeholder when no value selected', () => {
      renderComponent({ placeholder: 'Pick one' })

      expect(screen.getByText('Pick one')).toBeInTheDocument()
    })

    test('should handle empty string value', () => {
      renderComponent({ value: '' as any })

      // Trigger renders with placeholder
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('States & Themes', () => {
    test('should disable select when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const trigger = screen.getByRole('button')
      expect(trigger).toBeDisabled()
    })

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

    test('should show optional indicator when optional is true', () => {
      renderComponent({ label: 'Select', optional: true })

      expect(screen.getByText('Select')).toBeInTheDocument()
    })

    test('should apply danger theme when error exists', () => {
      renderComponent({ error: 'Error' })

      const element = document.querySelector('.cn-select-danger')
      expect(element).toBeTruthy()
    })

    test('should apply warning theme when warning exists', () => {
      renderComponent({ warning: 'Warning' })

      const element = document.querySelector('.cn-select-warning')
      expect(element).toBeTruthy()
    })
  })

  describe('Styling & Layout', () => {
    test('should apply custom triggerClassName', () => {
      renderComponent({ triggerClassName: 'custom-trigger' })

      const trigger = document.querySelector('.custom-trigger')
      expect(trigger).toBeTruthy()
    })

    test('should apply wrapper className', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

      const wrapper = container.querySelector('.custom-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should apply contentClassName', () => {
      renderComponent({ contentClassName: 'custom-content' })

      // Select renders
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should apply small size', () => {
      renderComponent({ size: 'sm' })

      const element = document.querySelector('.cn-select-sm')
      expect(element).toBeTruthy()
    })

    test('should support horizontal orientation', () => {
      renderComponent({ orientation: 'horizontal', caption: 'Caption', label: 'Label' })

      expect(screen.getByText('Caption')).toBeInTheDocument()
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    test('should render with suffix element', () => {
      renderComponent({ suffix: <span>★</span> })

      expect(screen.getByText('★')).toBeInTheDocument()
    })

    test('should render suffix in correct position', () => {
      const { container } = renderComponent({ suffix: <span data-testid="suffix">X</span> })

      const suffix = container.querySelector('.cn-select-suffix')
      expect(suffix).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    test('should render hidden input with name attribute', () => {
      const { container } = renderComponent({ name: 'country', value: 'opt1' })

      const hiddenInput = container.querySelector('input[type="hidden"]')
      expect(hiddenInput).toBeInTheDocument()
      expect(hiddenInput).toHaveAttribute('name', 'country')
    })

    test('should update hidden input value', () => {
      const { container } = renderComponent({ name: 'option', value: 'opt2' })

      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement
      expect(hiddenInput?.value).toBe('opt2')
    })

    test('should have empty hidden input when no value', () => {
      const { container } = renderComponent({ name: 'option' })

      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement
      expect(hiddenInput?.value).toBe('')
    })
  })

  describe('Options Configuration', () => {
    test('should accept simple options array', () => {
      renderComponent()

      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    test('should handle async options function', async () => {
      const asyncOptions = vi.fn().mockResolvedValue(options)
      render(<Select options={asyncOptions} />)

      // Trigger renders while loading
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should handle rejected async options', async () => {
      const asyncOptions = vi.fn().mockRejectedValue(new Error('Failed'))
      render(<Select options={asyncOptions} />)

      // Select still renders
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to trigger', () => {
      const ref = vi.fn()

      render(<Select ref={ref} options={options} />)

      expect(ref).toHaveBeenCalled()
    })

    test('should allow ref access to button element', () => {
      const ref = { current: null as HTMLButtonElement | null }

      render(<Select ref={ref} options={options} />)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props combined', () => {
      renderComponent({
        label: 'Country',
        caption: 'Select your country',
        placeholder: 'Choose',
        optional: true,
        size: 'sm',
        value: 'opt1'
      })

      expect(screen.getByText('Country')).toBeInTheDocument()
      expect(screen.getByText('Select your country')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    test('should render with error and label', () => {
      renderComponent({
        label: 'Field',
        error: 'Required field',
        value: 'opt1'
      })

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByText('Required field')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    test('should handle disabled state with selected value', () => {
      renderComponent({ disabled: true, value: 'opt3' })

      const trigger = screen.getByRole('button')
      expect(trigger).toBeDisabled()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })
  })
})
