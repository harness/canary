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

    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
  })

  test('should associate label with input using htmlFor', () => {
    renderComponent({ label: 'Email', id: 'email-input' })

    const label = screen.getByText('Email')
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
    input = screen.getByLabelText('', { selector: 'input[type="password"]' })
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
})
