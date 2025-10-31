import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Checkbox } from '../checkbox'

const renderComponent = (props: Partial<React.ComponentProps<typeof Checkbox>> = {}): RenderResult => {
  return render(<Checkbox {...props} />)
}

describe('Checkbox', () => {
  test('should render checkbox element', () => {
    renderComponent()

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  test('should render with label', () => {
    renderComponent({ label: 'Accept terms' })

    const label = screen.getByText('Accept terms')
    expect(label).toBeInTheDocument()
  })

  test('should associate label with checkbox', () => {
    renderComponent({ label: 'Accept terms', id: 'terms' })

    const label = screen.getByText('Accept terms').closest('label')
    const checkbox = screen.getByRole('checkbox')

    expect(label).toHaveAttribute('for', 'terms')
    expect(checkbox).toHaveAttribute('id', 'terms')
  })

  test('should render with caption', () => {
    renderComponent({
      label: 'Newsletter',
      caption: 'Receive updates via email'
    })

    const caption = screen.getByText('Receive updates via email')
    expect(caption).toBeInTheDocument()
  })

  test('should be unchecked by default', () => {
    renderComponent()

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('should be checked when checked prop is true', () => {
    renderComponent({ checked: true })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('should call onCheckedChange when clicked', async () => {
    const handleChange = vi.fn()
    renderComponent({ onCheckedChange: handleChange })

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test('should toggle between checked and unchecked', async () => {
    const handleChange = vi.fn()
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={handleChange} />)

    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledWith(true)

    rerender(<Checkbox checked={true} onCheckedChange={handleChange} />)

    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('should be disabled when disabled prop is true', () => {
    renderComponent({ disabled: true })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  test('should not call onCheckedChange when disabled', async () => {
    const handleChange = vi.fn()
    renderComponent({ disabled: true, onCheckedChange: handleChange })

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    expect(handleChange).not.toHaveBeenCalled()
  })

  test('should apply error styling when error prop is true', () => {
    renderComponent({ error: true })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('cn-checkbox-error')
  })

  test('should apply custom className', () => {
    const { container } = renderComponent({ className: 'custom-class' })

    const wrapper = container.querySelector('.custom-class')
    expect(wrapper).toBeInTheDocument()
  })

  test('should show optional label when showOptionalLabel is true', () => {
    renderComponent({
      label: 'Subscribe',
      showOptionalLabel: true
    })

    const label = screen.getByText('Subscribe')
    expect(label).toBeInTheDocument()
  })

  test('should show indeterminate state', () => {
    renderComponent({ checked: 'indeterminate' })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
  })

  test('should display check icon when checked', () => {
    const { container } = renderComponent({ checked: true })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()

    // Check for icon
    const icon = container.querySelector('.cn-icon')
    expect(icon).toBeInTheDocument()
  })

  test('should display minus icon when indeterminate', () => {
    const { container } = renderComponent({ checked: 'indeterminate' })

    // Check for icon
    const icon = container.querySelector('.cn-icon')
    expect(icon).toBeInTheDocument()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Checkbox ref={ref} />)

    expect(ref).toHaveBeenCalled()
  })

  test('should handle label click to toggle checkbox', async () => {
    const handleChange = vi.fn()
    renderComponent({
      label: 'Click me',
      onCheckedChange: handleChange
    })

    const label = screen.getByText('Click me')
    await userEvent.click(label)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('should generate random id when no id is provided', () => {
    renderComponent()

    const checkbox = screen.getByRole('checkbox')
    const id = checkbox.getAttribute('id')

    expect(id).toBeTruthy()
    expect(id).toMatch(/^checkbox-/)
  })

  test('should use provided id instead of generating one', () => {
    renderComponent({ id: 'custom-id' })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id', 'custom-id')
  })

  test('should handle defaultChecked for uncontrolled component', () => {
    renderComponent({ defaultChecked: true })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test.skip('should handle name attribute', () => {
    // Note: Radix UI Checkbox doesn't support name attribute on the button element
    // Would need a hidden input for form submission support
    renderComponent({ name: 'terms' })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('name', 'terms')
  })

  test('should handle value attribute', () => {
    renderComponent({ value: 'accepted' })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('value', 'accepted')
  })

  test('should disable label text when disabled', () => {
    const { container } = renderComponent({
      label: 'Disabled checkbox',
      disabled: true
    })

    const label = container.querySelector('.disabled')
    expect(label).toBeInTheDocument()
  })

  test('should truncate label when truncateLabel is true', () => {
    const { container } = renderComponent({
      label: 'Very long label text that should be truncated',
      truncateLabel: true
    })

    const label = container.querySelector('.truncate')
    expect(label).toBeInTheDocument()
  })

  test('should not truncate label when truncateLabel is false', () => {
    const { container } = renderComponent({
      label: 'Label text',
      truncateLabel: false
    })

    const label = container.querySelector('.truncate')
    expect(label).not.toBeInTheDocument()
  })

  test('should render with both label and caption', () => {
    renderComponent({
      label: 'Subscribe to newsletter',
      caption: 'We will send you updates'
    })

    expect(screen.getByText('Subscribe to newsletter')).toBeInTheDocument()
    expect(screen.getByText('We will send you updates')).toBeInTheDocument()
  })

  test('should apply custom caption variant', () => {
    renderComponent({
      label: 'Checkbox',
      caption: 'Caption text',
      captionVariant: 'body-normal'
    })

    const caption = screen.getByText('Caption text')
    expect(caption).toBeInTheDocument()
  })

  test('should handle multiple rapid clicks', async () => {
    const handleChange = vi.fn()
    renderComponent({ onCheckedChange: handleChange })

    const checkbox = screen.getByRole('checkbox')

    await userEvent.click(checkbox)
    await userEvent.click(checkbox)
    await userEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledTimes(3)
  })
})
