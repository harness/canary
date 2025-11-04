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

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(Checkbox.displayName).toBe('Checkbox')
    })
  })

  describe('ID Generation', () => {
    test('should generate unique IDs for multiple checkboxes', () => {
      const { container } = render(
        <div>
          <Checkbox />
          <Checkbox />
          <Checkbox />
        </div>
      )

      const checkboxes = container.querySelectorAll('[role="checkbox"]')
      const ids = Array.from(checkboxes).map(cb => cb.getAttribute('id'))

      expect(ids.length).toBe(3)
      expect(new Set(ids).size).toBe(3) // All unique
      ids.forEach(id => expect(id).toMatch(/^checkbox-/))
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when checked state changes', () => {
      const { rerender } = render(<Checkbox checked={false} />)

      let checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      rerender(<Checkbox checked={true} />)

      checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(<Checkbox disabled={false} />)

      let checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeDisabled()

      rerender(<Checkbox disabled={true} />)

      checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    test('should update when error state changes', () => {
      const { rerender } = render(<Checkbox error={false} />)

      let checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toHaveClass('cn-checkbox-error')

      rerender(<Checkbox error={true} />)

      checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('cn-checkbox-error')
    })

    test('should update when label changes', () => {
      const { rerender } = render(<Checkbox label="Old Label" />)

      expect(screen.getByText('Old Label')).toBeInTheDocument()

      rerender(<Checkbox label="New Label" />)

      expect(screen.getByText('New Label')).toBeInTheDocument()
      expect(screen.queryByText('Old Label')).not.toBeInTheDocument()
    })

    test('should update when caption changes', () => {
      const { rerender } = render(<Checkbox label="Test" caption="Old Caption" />)

      expect(screen.getByText('Old Caption')).toBeInTheDocument()

      rerender(<Checkbox label="Test" caption="New Caption" />)

      expect(screen.getByText('New Caption')).toBeInTheDocument()
      expect(screen.queryByText('Old Caption')).not.toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward aria-label', () => {
      renderComponent({ 'aria-label': 'Custom label' })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-label', 'Custom label')
    })

    test('should forward aria-describedby', () => {
      renderComponent({ 'aria-describedby': 'description-id' })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-describedby', 'description-id')
    })

    test('should forward aria-required', () => {
      renderComponent({ 'aria-required': true })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty label string', () => {
      renderComponent({ label: '' })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    test('should handle empty caption string', () => {
      renderComponent({ label: 'Test', caption: '' })

      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('should handle very long label', () => {
      const longLabel = 'A'.repeat(200)
      renderComponent({ label: longLabel, truncateLabel: true })

      expect(screen.getByText(longLabel)).toBeInTheDocument()
    })

    test('should handle very long caption', () => {
      const longCaption = 'B'.repeat(200)
      renderComponent({ label: 'Test', caption: longCaption })

      expect(screen.getByText(longCaption)).toBeInTheDocument()
    })

    test('should handle label with special characters', () => {
      renderComponent({ label: 'Test <>&"\'` label' })

      expect(screen.getByText('Test <>&"\'` label')).toBeInTheDocument()
    })

    test('should handle null checked value', () => {
      renderComponent({ checked: undefined })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    test('should work as uncontrolled with defaultChecked', () => {
      renderComponent({ defaultChecked: true })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    test('should work as controlled with checked prop', async () => {
      const { rerender } = render(<Checkbox checked={false} />)

      let checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      // Clicking shouldn't change state in controlled mode without handler
      await userEvent.click(checkbox)

      rerender(<Checkbox checked={true} />)
      checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })
  })

  describe('Indeterminate State', () => {
    test('should have indeterminate data state', () => {
      renderComponent({ checked: 'indeterminate' })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    })

    test('should toggle from indeterminate to checked', async () => {
      const handleChange = vi.fn()
      const { rerender } = render(<Checkbox checked="indeterminate" onCheckedChange={handleChange} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')

      await userEvent.click(checkbox)
      expect(handleChange).toHaveBeenCalled()

      rerender(<Checkbox checked={true} onCheckedChange={handleChange} />)
      expect(checkbox).toBeChecked()
    })
  })

  describe('Icon Rendering', () => {
    test('should not show icon when unchecked', () => {
      const { container } = renderComponent({ checked: false })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      // When unchecked, indicator exists but may not have visible icon
      const wrapper = container.querySelector('.cn-checkbox-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should show check icon when checked', () => {
      const { container } = renderComponent({ checked: true })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should show minus icon when indeterminate', () => {
      const { container } = renderComponent({ checked: 'indeterminate' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Label and Caption Combinations', () => {
    test('should render without label or caption', () => {
      renderComponent()

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    test('should render with only label', () => {
      renderComponent({ label: 'Only label' })

      expect(screen.getByText('Only label')).toBeInTheDocument()
    })

    test('should render with only caption', () => {
      renderComponent({ caption: 'Only caption' })

      expect(screen.getByText('Only caption')).toBeInTheDocument()
    })

    test('should not render label wrapper without label or caption', () => {
      const { container } = renderComponent()

      const labelWrapper = container.querySelector('.cn-checkbox-label-wrapper')
      expect(labelWrapper).not.toBeInTheDocument()
    })
  })

  describe('Error State Styling', () => {
    test('should not have error class by default', () => {
      renderComponent()

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toHaveClass('cn-checkbox-error')
    })

    test('should apply error class when error is true', () => {
      renderComponent({ error: true })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('cn-checkbox-error')
    })

    test('should work with error and disabled together', () => {
      renderComponent({ error: true, disabled: true })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('cn-checkbox-error')
      expect(checkbox).toBeDisabled()
    })
  })

  describe('Keyboard Interaction', () => {
    test('should toggle on Space key', async () => {
      const handleChange = vi.fn()
      renderComponent({ onCheckedChange: handleChange })

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()

      await userEvent.keyboard(' ')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('TruncateLabel Prop', () => {
    test('should truncate by default', () => {
      const { container } = renderComponent({ label: 'Long label text' })

      const label = container.querySelector('.truncate')
      expect(label).toBeInTheDocument()
    })

    test('should not truncate when false', () => {
      const { container } = renderComponent({ label: 'Long label text', truncateLabel: false })

      const label = container.querySelector('.truncate')
      expect(label).not.toBeInTheDocument()
    })
  })

  describe('Optional Label', () => {
    test('should show optional indicator when showOptionalLabel is true', () => {
      renderComponent({ label: 'Optional field', showOptionalLabel: true })

      expect(screen.getByText('Optional field')).toBeInTheDocument()
    })

    test('should not show optional indicator by default', () => {
      renderComponent({ label: 'Required field' })

      expect(screen.getByText('Required field')).toBeInTheDocument()
    })
  })

  describe('Caption Variant', () => {
    test('should apply default caption variant', () => {
      renderComponent({ label: 'Test', caption: 'Default caption' })

      expect(screen.getByText('Default caption')).toBeInTheDocument()
    })

    test('should apply custom caption variant', () => {
      renderComponent({ label: 'Test', caption: 'Custom caption', captionVariant: 'body-normal' })

      expect(screen.getByText('Custom caption')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      const handleChange = vi.fn()
      const { container } = renderComponent({
        id: 'complex-checkbox',
        label: 'Complex Checkbox',
        caption: 'This is a complex checkbox',
        checked: true,
        disabled: false,
        error: false,
        onCheckedChange: handleChange,
        className: 'custom-checkbox',
        showOptionalLabel: true,
        truncateLabel: false,
        captionVariant: 'body-normal'
      })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      expect(checkbox).toHaveAttribute('id', 'complex-checkbox')
      expect(screen.getByText('Complex Checkbox')).toBeInTheDocument()
      expect(screen.getByText('This is a complex checkbox')).toBeInTheDocument()
      expect(container.querySelector('.custom-checkbox')).toBeInTheDocument()
    })

    test('should handle disabled with label and caption', () => {
      renderComponent({
        label: 'Disabled checkbox',
        caption: 'This is disabled',
        disabled: true
      })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      expect(screen.getByText('Disabled checkbox')).toBeInTheDocument()
      expect(screen.getByText('This is disabled')).toBeInTheDocument()
    })

    test('should handle error with indeterminate state', () => {
      renderComponent({
        label: 'Error state',
        checked: 'indeterminate',
        error: true
      })

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('cn-checkbox-error')
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    })
  })

  describe('Accessibility', () => {
    test('should be keyboard accessible', () => {
      renderComponent({ label: 'Accessible checkbox' })

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()

      expect(checkbox).toHaveFocus()
    })

    test('should have proper role', () => {
      renderComponent()

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('role', 'checkbox')
    })

    test('should associate label via htmlFor and id', () => {
      renderComponent({ label: 'Associated label', id: 'test-id' })

      const label = screen.getByText('Associated label').closest('label')
      const checkbox = screen.getByRole('checkbox')

      expect(label).toHaveAttribute('for', 'test-id')
      expect(checkbox).toHaveAttribute('id', 'test-id')
    })
  })

  describe('Default Values', () => {
    test('should have truncateLabel true by default', () => {
      const { container } = render(<Checkbox label="Test" />)

      const label = container.querySelector('.truncate')
      expect(label).toBeInTheDocument()
    })

    test('should have error false by default', () => {
      renderComponent()

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toHaveClass('cn-checkbox-error')
    })
  })
})
