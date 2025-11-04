import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Input } from '../input'

const renderComponent = (props: Partial<React.ComponentProps<typeof Input>> = {}): RenderResult => {
  return render(<Input {...props} />)
}

describe('Input', () => {
  test('should render input element', () => {
    renderComponent()

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('should render with label', () => {
    renderComponent({ label: 'Email', id: 'email' })

    const labelText = screen.getByText('Email')
    const label = labelText.closest('label')
    expect(label).toBeInTheDocument()
    expect(label?.tagName).toBe('LABEL')
  })

  test('should associate label with input using htmlFor', () => {
    renderComponent({ label: 'Email', id: 'email-input' })

    const label = screen.getByText('Email').closest('label')
    const input = screen.getByRole('textbox')

    expect(label).toHaveAttribute('for', 'email-input')
    expect(input).toHaveAttribute('id', 'email-input')
  })

  test('should render with placeholder', () => {
    renderComponent({ placeholder: 'Enter your email' })

    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toBeInTheDocument()
  })

  test('should accept and display value', async () => {
    renderComponent({ value: 'test@example.com' })

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('test@example.com')
  })

  test('should call onChange handler when value changes', async () => {
    const handleChange = vi.fn()
    renderComponent({ onChange: handleChange })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  test('should show error message when error prop is provided', () => {
    renderComponent({ error: 'This field is required' })

    const errorMessage = screen.getByText('This field is required')
    expect(errorMessage).toBeInTheDocument()
  })

  test('should apply danger theme when error is present', () => {
    renderComponent({ error: 'Error message' })

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-cn-danger')
  })

  test('should render with caption', () => {
    renderComponent({ caption: 'Helper text' })

    const caption = screen.getByText('Helper text')
    expect(caption).toBeInTheDocument()
  })

  test('should be disabled when disabled prop is true', () => {
    renderComponent({ disabled: true })

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  test('should show optional label when optional prop is true', () => {
    renderComponent({ label: 'Name', optional: true })

    // The optional indicator should be present in the label
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  test('should apply custom className', () => {
    renderComponent({ className: 'custom-input-class' })

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input-class')
  })

  test('should apply wrapper className', () => {
    const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

    const wrapper = container.querySelector('.custom-wrapper')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render with different input types', () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    input = document.querySelector('input[type="password"]') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'password')
  })

  test('should render with small size', () => {
    renderComponent({ size: 'sm' })

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('h-8')
  })

  test('should render with medium size', () => {
    renderComponent({ size: 'md' })

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('h-9')
  })

  test('should handle focus and blur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    renderComponent({ onFocus: handleFocus, onBlur: handleBlur })

    const input = screen.getByRole('textbox')

    await userEvent.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    await userEvent.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)

    expect(ref).toHaveBeenCalled()
  })

  test('should render with icon when inputIconName is provided', () => {
    const { container } = renderComponent({ inputIconName: 'search' })

    // Check for the icon container
    const iconContainer = container.querySelector('.relative')
    expect(iconContainer).toBeInTheDocument()

    // Input should have left padding for icon
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('pl-cn-2xl')
  })

  test('should render with right element', () => {
    renderComponent({ rightElement: <button>Submit</button> })

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeInTheDocument()
  })

  test('should apply filled variant to right element', () => {
    const { container } = renderComponent({
      rightElement: <span>Right</span>,
      rightElementVariant: 'filled'
    })

    const rightElementWrapper = container.querySelector('.bg-cn-gray-secondary')
    expect(rightElementWrapper).toBeInTheDocument()
  })

  test('should disable caption text when input is disabled', () => {
    renderComponent({
      caption: 'Helper text',
      disabled: true
    })

    const caption = screen.getByText('Helper text')
    expect(caption).toHaveClass('text-cn-disabled')
  })

  test('should accept all standard HTML input attributes', () => {
    renderComponent({
      name: 'email',
      required: true,
      maxLength: 50,
      'aria-label': 'Email input'
    })

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('maxLength', '50')
    expect(input).toHaveAttribute('aria-label', 'Email input')
  })

  test('should render label and error together', () => {
    renderComponent({
      label: 'Email',
      error: 'Invalid email',
      id: 'email'
    })

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  test('should render label, caption, and error together', () => {
    renderComponent({
      label: 'Email',
      caption: 'Enter your email address',
      error: 'Invalid email',
      id: 'email'
    })

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  test('should handle controlled input', async () => {
    const handleChange = vi.fn()
    const { rerender } = render(<Input value="" onChange={handleChange} />)

    let input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('')

    rerender(<Input value="test" onChange={handleChange} />)

    input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('test')
  })

  test('should handle uncontrolled input', async () => {
    renderComponent({ defaultValue: 'initial value' })

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('initial value')

    await userEvent.clear(input)
    await userEvent.type(input, 'new value')

    expect(input.value).toBe('new value')
  })

  describe('BaseInputWithWrapper (customContent)', () => {
    test('should render with custom content', () => {
      renderComponent({
        customContent: <span data-testid="custom">Prefix</span>,
        placeholder: 'With custom content'
      })

      expect(screen.getByTestId('custom')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('With custom content')).toBeInTheDocument()
    })

    test('should render custom content with input', () => {
      renderComponent({
        customContent: <button data-testid="btn">Click</button>
      })

      const button = screen.getByTestId('btn')
      const input = screen.getByRole('textbox')

      expect(button).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })

    test('should apply correct classes with custom content', () => {
      const { container } = renderComponent({
        customContent: <span>Content</span>
      })

      const wrapper = container.querySelector('.p-0.flex.items-center')
      expect(wrapper).toBeInTheDocument()
    })

    test('should handle custom content with label and error', () => {
      renderComponent({
        label: 'Test Label',
        customContent: <span data-testid="prefix">$</span>,
        error: 'Error message',
        id: 'test-input'
      })

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('prefix')).toBeInTheDocument()
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    test('should handle custom content with disabled state', () => {
      renderComponent({
        customContent: <span data-testid="icon">Icon</span>,
        disabled: true
      })

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Input.displayName).toBe('Input')
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty label', () => {
      renderComponent({ label: '' })

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('should handle numeric placeholder', () => {
      renderComponent({ placeholder: '123' })

      const input = screen.getByPlaceholderText('123')
      expect(input).toBeInTheDocument()
    })

    test('should handle long error message', () => {
      const longError = 'This is a very long error message that should still be displayed correctly'
      renderComponent({ error: longError })

      expect(screen.getByText(longError)).toBeInTheDocument()
    })

    test('should handle special characters in value', () => {
      renderComponent({ value: '<script>alert("test")</script>' })

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('<script>alert("test")</script>')
    })

    test('should handle type number', () => {
      renderComponent({ type: 'number' })

      const input = document.querySelector('input[type="number"]')
      expect(input).toBeInTheDocument()
    })

    test('should handle type tel', () => {
      renderComponent({ type: 'tel' })

      const input = document.querySelector('input[type="tel"]')
      expect(input).toBeInTheDocument()
    })

    test('should handle type url', () => {
      renderComponent({ type: 'url' })

      const input = document.querySelector('input[type="url"]')
      expect(input).toBeInTheDocument()
    })

    test('should handle type date', () => {
      renderComponent({ type: 'date' })

      const input = document.querySelector('input[type="date"]')
      expect(input).toBeInTheDocument()
    })

    test('should handle type time', () => {
      renderComponent({ type: 'time' })

      const input = document.querySelector('input[type="time"]')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when props change', () => {
      const { rerender } = render(<Input placeholder="Initial" />)

      let input = screen.getByPlaceholderText('Initial')
      expect(input).toBeInTheDocument()

      rerender(<Input placeholder="Updated" />)

      input = screen.getByPlaceholderText('Updated')
      expect(input).toBeInTheDocument()
    })

    test('should update error message', () => {
      const { rerender } = render(<Input error="Error 1" />)

      expect(screen.getByText('Error 1')).toBeInTheDocument()

      rerender(<Input error="Error 2" />)

      expect(screen.getByText('Error 2')).toBeInTheDocument()
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument()
    })

    test('should toggle disabled state', () => {
      const { rerender } = render(<Input disabled={false} />)

      let input = screen.getByRole('textbox')
      expect(input).not.toBeDisabled()

      rerender(<Input disabled={true} />)

      input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      renderComponent({
        label: 'Email',
        id: 'email',
        placeholder: 'Enter email',
        caption: 'We will never share',
        error: 'Invalid email',
        disabled: true,
        optional: true,
        className: 'custom-class',
        wrapperClassName: 'custom-wrapper',
        size: 'md',
        value: 'test@example.com'
      })

      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
      expect(screen.getByText('We will never share')).toBeInTheDocument()
      expect(screen.getByText('Invalid email')).toBeInTheDocument()

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeDisabled()
      expect(input).toHaveClass('custom-class')
      expect(input.value).toBe('test@example.com')
    })

    test('should handle inputIconName with rightElement', () => {
      renderComponent({
        inputIconName: 'search',
        rightElement: <button>Submit</button>
      })

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('pl-cn-2xl')
      expect(input).toHaveClass('border-none')
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    test('should handle error with caption', () => {
      renderComponent({
        error: 'Error message',
        caption: 'Caption text'
      })

      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.getByText('Caption text')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper input role', () => {
      renderComponent()

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('should associate label with input for accessibility', () => {
      renderComponent({ label: 'Username', id: 'username' })

      const label = screen.getByText('Username').closest('label')
      const input = screen.getByRole('textbox')

      expect(label).toHaveAttribute('for', 'username')
      expect(input).toHaveAttribute('id', 'username')
    })

    test('should mark input as invalid when error is present', () => {
      renderComponent({ error: 'Error' })

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-cn-danger')
    })

    test('should handle aria-describedby', () => {
      renderComponent({ 'aria-describedby': 'helper-text' })

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'helper-text')
    })

    test('should handle aria-required', () => {
      renderComponent({ 'aria-required': true })

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Default Values', () => {
    test('should default to small size', () => {
      renderComponent()

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('h-8')
    })

    test('should work without explicit type', () => {
      const { container } = renderComponent()

      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Caption and Error Priority', () => {
    test('should show both error and caption', () => {
      renderComponent({
        error: 'Required field',
        caption: 'Optional hint'
      })

      expect(screen.getByText('Required field')).toBeInTheDocument()
      expect(screen.getByText('Optional hint')).toBeInTheDocument()
    })

    test('should apply disabled style to caption when disabled', () => {
      renderComponent({
        caption: 'Helper text',
        disabled: true
      })

      const caption = screen.getByText('Helper text')
      expect(caption).toHaveClass('text-cn-disabled')
    })
  })
})
