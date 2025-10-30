import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Switch } from '../switch'

const renderComponent = (props: Partial<React.ComponentProps<typeof Switch>> = {}): RenderResult => {
  return render(<Switch {...props} />)
}

describe('Switch', () => {
  test('should render switch element', () => {
    renderComponent()

    // Switch is rendered as a button with role="switch"
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  test('should render with label', () => {
    renderComponent({ label: 'Enable notifications' })

    const label = screen.getByText('Enable notifications')
    expect(label).toBeInTheDocument()
  })

  test('should associate label with switch', () => {
    renderComponent({ label: 'Dark mode', id: 'dark-mode' })

    const label = screen.getByText('Dark mode')
    const switchElement = screen.getByRole('switch')

    expect(label).toHaveAttribute('for', 'dark-mode')
    expect(switchElement).toHaveAttribute('id', 'dark-mode')
  })

  test('should render with caption', () => {
    renderComponent({
      label: 'Notifications',
      caption: 'Receive push notifications'
    })

    const caption = screen.getByText('Receive push notifications')
    expect(caption).toBeInTheDocument()
  })

  test('should be unchecked by default', () => {
    renderComponent()

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  test('should be checked when checked prop is true', () => {
    renderComponent({ checked: true })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  test('should call onCheckedChange when clicked', async () => {
    const handleChange = vi.fn()
    renderComponent({ onCheckedChange: handleChange })

    const switchElement = screen.getByRole('switch')
    await userEvent.click(switchElement)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test('should toggle between checked and unchecked', async () => {
    const handleChange = vi.fn()
    const { rerender } = render(<Switch checked={false} onCheckedChange={handleChange} />)

    let switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')

    await userEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledWith(true)

    rerender(<Switch checked={true} onCheckedChange={handleChange} />)

    switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  test('should be disabled when disabled prop is true', () => {
    renderComponent({ disabled: true })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  test('should not call onCheckedChange when disabled', async () => {
    const handleChange = vi.fn()
    renderComponent({ disabled: true, onCheckedChange: handleChange })

    const switchElement = screen.getByRole('switch')
    await userEvent.click(switchElement)

    expect(handleChange).not.toHaveBeenCalled()
  })

  test('should apply custom className', () => {
    renderComponent({ className: 'custom-switch-class' })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-switch-class')
  })

  test('should show optional label when showOptionalLabel is true', () => {
    renderComponent({
      label: 'Optional feature',
      showOptionalLabel: true
    })

    const label = screen.getByText('Optional feature')
    expect(label).toBeInTheDocument()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Switch ref={ref} />)

    expect(ref).toHaveBeenCalled()
  })

  test('should handle label click to toggle switch', async () => {
    const handleChange = vi.fn()
    renderComponent({
      label: 'Toggle me',
      onCheckedChange: handleChange
    })

    const label = screen.getByText('Toggle me')
    await userEvent.click(label)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('should generate random id when no id is provided', () => {
    renderComponent()

    const switchElement = screen.getByRole('switch')
    const id = switchElement.getAttribute('id')

    expect(id).toBeTruthy()
    expect(id).toMatch(/^switch-/)
  })

  test('should use provided id instead of generating one', () => {
    renderComponent({ id: 'custom-switch-id' })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('id', 'custom-switch-id')
  })

  test('should handle defaultChecked for uncontrolled component', () => {
    renderComponent({ defaultChecked: true })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  test('should handle name attribute', () => {
    renderComponent({ name: 'notifications' })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('name', 'notifications')
  })

  test('should handle value attribute', () => {
    renderComponent({ value: 'enabled' })

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('value', 'enabled')
  })

  test('should render with both label and caption', () => {
    renderComponent({
      label: 'Enable feature',
      caption: 'This will activate the feature'
    })

    expect(screen.getByText('Enable feature')).toBeInTheDocument()
    expect(screen.getByText('This will activate the feature')).toBeInTheDocument()
  })

  test('should show caption tooltip when provided', () => {
    renderComponent({
      label: 'Feature',
      caption: 'Short text',
      captionTooltip: 'Full tooltip text that is longer'
    })

    const caption = screen.getByText('Short text')
    expect(caption).toHaveAttribute('title', 'Full tooltip text that is longer')
  })

  test('should have correct wrapper classes', () => {
    const { container } = renderComponent()

    const wrapper = container.querySelector('.cn-switch-wrapper')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have correct root classes', () => {
    renderComponent()

    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('cn-switch-root')
  })

  test('should render thumb element', () => {
    const { container } = renderComponent()

    const thumb = container.querySelector('.cn-switch-thumb')
    expect(thumb).toBeInTheDocument()
  })

  test('should handle multiple rapid clicks', async () => {
    const handleChange = vi.fn()
    renderComponent({ onCheckedChange: handleChange })

    const switchElement = screen.getByRole('switch')

    await userEvent.click(switchElement)
    await userEvent.click(switchElement)
    await userEvent.click(switchElement)

    expect(handleChange).toHaveBeenCalledTimes(3)
  })

  test('should render label wrapper when label is provided', () => {
    const { container } = renderComponent({ label: 'Test label' })

    const labelWrapper = container.querySelector('.cn-switch-label-wrapper')
    expect(labelWrapper).toBeInTheDocument()
  })

  test('should render label wrapper when caption is provided', () => {
    const { container } = renderComponent({ caption: 'Test caption' })

    const labelWrapper = container.querySelector('.cn-switch-label-wrapper')
    expect(labelWrapper).toBeInTheDocument()
  })

  test('should not render label wrapper when neither label nor caption is provided', () => {
    const { container } = renderComponent()

    const labelWrapper = container.querySelector('.cn-switch-label-wrapper')
    expect(labelWrapper).not.toBeInTheDocument()
  })

  test('should truncate caption text', () => {
    const { container } = renderComponent({
      caption: 'Very long caption text that should be truncated when it exceeds the available space'
    })

    const caption = container.querySelector('.truncate')
    expect(caption).toBeInTheDocument()
  })

  test('should handle keyboard navigation', async () => {
    const handleChange = vi.fn()
    renderComponent({ onCheckedChange: handleChange })

    const switchElement = screen.getByRole('switch')
    switchElement.focus()

    await userEvent.keyboard(' ')

    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})

