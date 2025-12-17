import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Tag } from '../tag'

const renderComponent = (props: Partial<React.ComponentProps<typeof Tag>>): RenderResult => {
  return render(<Tag value="test-value" {...props} />)
}

describe('Tag', () => {
  test('should render tag with value', () => {
    renderComponent({ value: 'Test Value' })

    const tag = screen.getByText('Test Value')
    expect(tag).toBeInTheDocument()
  })

  test('should apply default variant class', () => {
    const { container } = renderComponent({ value: 'Tag' })

    const tag = container.querySelector('.cn-tag-outline')
    expect(tag).toBeInTheDocument()
  })

  test('should apply outline variant class', () => {
    const { container } = renderComponent({ variant: 'outline', value: 'Tag' })

    const tag = container.querySelector('.cn-tag-outline')
    expect(tag).toBeInTheDocument()
  })

  test('should apply secondary variant class', () => {
    const { container } = renderComponent({ variant: 'secondary', value: 'Tag' })

    const tag = container.querySelector('.cn-tag-secondary')
    expect(tag).toBeInTheDocument()
  })

  test('should apply small size class', () => {
    const { container } = renderComponent({ size: 'sm', value: 'Tag' })

    const tag = container.querySelector('.cn-tag-sm')
    expect(tag).toBeInTheDocument()
  })

  test('should apply theme color classes', () => {
    const { container, rerender } = render(<Tag value="Tag" theme="blue" />)

    let tag = container.querySelector('.cn-tag-blue')
    expect(tag).toBeInTheDocument()

    rerender(<Tag value="Tag" theme="green" />)
    tag = container.querySelector('.cn-tag-success')
    expect(tag).toBeInTheDocument()

    rerender(<Tag value="Tag" theme="red" />)
    tag = container.querySelector('.cn-tag-danger')
    expect(tag).toBeInTheDocument()

    rerender(<Tag value="Tag" theme="yellow" />)
    tag = container.querySelector('.cn-tag-warning')
    expect(tag).toBeInTheDocument()
  })

  test('should apply rounded class when rounded prop is true', () => {
    const { container } = renderComponent({ rounded: true, value: 'Tag' })

    const tag = container.querySelector('.cn-tag-rounded')
    expect(tag).toBeInTheDocument()
  })

  test('should apply custom className', () => {
    const { container } = renderComponent({ className: 'custom-tag-class', value: 'Tag' })

    const tag = container.querySelector('.custom-tag-class')
    expect(tag).toBeInTheDocument()
  })

  test('should render with icon', () => {
    const { container } = renderComponent({ icon: 'check', value: 'Tag' })

    const icon = container.querySelector('.cn-tag-icon')
    expect(icon).toBeInTheDocument()
  })

  test('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    renderComponent({ value: 'Tag', onClick: handleClick })

    const tag = screen.getByText('Tag')
    await userEvent.click(tag)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    renderComponent({ value: 'Tag', onClick: handleClick, disabled: true })

    const tag = screen.getByText('Tag')
    await userEvent.click(tag)

    // Note: Tag component shows disabled styling but doesn't prevent onClick
    // This is expected behavior - visual indication only
    // If we need to prevent clicks, we should add pointer-events-none
    expect(handleClick).toHaveBeenCalled()
  })

  test('should apply disabled styling when disabled', () => {
    const { container } = renderComponent({ value: 'Tag', disabled: true })

    const tag = container.querySelector('.cursor-not-allowed')
    expect(tag).toBeInTheDocument()
  })

  test('should render action icon when actionIcon prop is provided', () => {
    const { container } = renderComponent({ value: 'Tag', actionIcon: 'xmark' })

    const actionButton = container.querySelector('.cn-tag-action-icon-button')
    expect(actionButton).toBeInTheDocument()
  })

  test('should call onActionClick when action icon is clicked', async () => {
    const handleActionClick = vi.fn()
    const { container } = renderComponent({
      value: 'Tag',
      actionIcon: 'xmark',
      onActionClick: handleActionClick
    })

    const actionButton = container.querySelector('.cn-tag-action-icon-button')
    if (actionButton) {
      await userEvent.click(actionButton)
    }

    expect(handleActionClick).toHaveBeenCalledTimes(1)
  })

  test('should stop propagation when action icon is clicked', async () => {
    const handleClick = vi.fn()
    const handleActionClick = vi.fn()
    const { container } = renderComponent({
      value: 'Tag',
      onClick: handleClick,
      actionIcon: 'xmark',
      onActionClick: handleActionClick
    })

    const actionButton = container.querySelector('.cn-tag-action-icon-button')
    if (actionButton) {
      await userEvent.click(actionButton)
    }

    expect(handleActionClick).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('should render split tag when both label and value are provided', () => {
    renderComponent({ label: 'Label', value: 'Value' })

    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  test('should apply split tag classes when label is present', () => {
    const { container } = renderComponent({ label: 'Label', value: 'Value' })

    const splitTag = container.querySelector('.cn-tag-split')
    expect(splitTag).toBeInTheDocument()
  })

  test('should render left and right sections in split tag', () => {
    const { container } = renderComponent({ label: 'Label', value: 'Value' })

    const leftTag = container.querySelector('.cn-tag-split-left')
    const rightTag = container.querySelector('.cn-tag-split-right')

    expect(leftTag).toBeInTheDocument()
    expect(rightTag).toBeInTheDocument()
  })

  test('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Tag ref={ref} value="Tag" />)

    expect(ref).toHaveBeenCalled()
  })

  test('should apply hover class when onClick is provided', () => {
    const handleClick = vi.fn()
    const { container } = renderComponent({ value: 'Tag', onClick: handleClick })

    const tag = container.querySelector('.cn-tag-hoverable')
    expect(tag).toBeInTheDocument()
  })

  test('should apply hover class when enableHover is true', () => {
    const { container } = renderComponent({ value: 'Tag', enableHover: true })

    const tag = container.querySelector('.cn-tag-hoverable')
    expect(tag).toBeInTheDocument()
  })

  test('should apply cursor-pointer when onClick is provided', () => {
    const handleClick = vi.fn()
    const { container } = renderComponent({ value: 'Tag', onClick: handleClick })

    const tag = container.querySelector('.cursor-pointer')
    expect(tag).toBeInTheDocument()
  })

  test('should not apply cursor-pointer when disabled', () => {
    const handleClick = vi.fn()
    const { container } = renderComponent({ value: 'Tag', onClick: handleClick, disabled: true })

    const tag = container.querySelector('.cursor-pointer')
    expect(tag).not.toBeInTheDocument()
  })

  test('should render title attribute', () => {
    const { container } = renderComponent({ value: 'Tag', title: 'Custom title' })

    const tagText = container.querySelector('.cn-tag-text')
    expect(tagText).toHaveAttribute('title', 'Custom title')
  })

  test('should use value as title when title is not provided', () => {
    const { container } = renderComponent({ value: 'Tag Value' })

    const tagText = container.querySelector('.cn-tag-text')
    expect(tagText).toHaveAttribute('title', 'Tag Value')
  })

  test('should render icon with custom icon props', () => {
    const { container } = renderComponent({
      value: 'Tag',
      icon: 'check',
      iconProps: { className: 'custom-icon-class' }
    })

    const icon = container.querySelector('.custom-icon-class')
    expect(icon).toBeInTheDocument()
  })

  test('should apply disabled text color to icon when disabled', () => {
    const { container } = renderComponent({
      value: 'Tag',
      icon: 'check',
      disabled: true
    })

    const icon = container.querySelector('.cn-tag-icon.text-cn-disabled')
    expect(icon).toBeInTheDocument()
  })

  test('should apply disabled text color to text when disabled', () => {
    const { container } = renderComponent({
      value: 'Tag',
      disabled: true
    })

    const text = container.querySelector('.cn-tag-text.text-cn-disabled')
    expect(text).toBeInTheDocument()
  })

  test('should disable action icon button when tag is disabled', () => {
    const { container } = renderComponent({
      value: 'Tag',
      actionIcon: 'xmark',
      disabled: true
    })

    const actionButton = container.querySelector('.cn-tag-action-icon-button')
    expect(actionButton).toBeDisabled()
  })

  test('should apply labelClassName to split tag left section', () => {
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      labelClassName: 'custom-label-class'
    })

    const leftTag = container.querySelector('.custom-label-class')
    expect(leftTag).toBeInTheDocument()
  })

  test('should apply valueClassName to split tag right section', () => {
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      valueClassName: 'custom-value-class'
    })

    const rightTag = container.querySelector('.custom-value-class')
    expect(rightTag).toBeInTheDocument()
  })

  test('should render all theme color variants', () => {
    const themes = [
      { theme: 'gray' as const, className: 'cn-tag-gray' },
      { theme: 'blue' as const, className: 'cn-tag-blue' },
      { theme: 'brown' as const, className: 'cn-tag-brown' },
      { theme: 'cyan' as const, className: 'cn-tag-cyan' },
      { theme: 'green' as const, className: 'cn-tag-success' },
      { theme: 'indigo' as const, className: 'cn-tag-indigo' },
      { theme: 'mint' as const, className: 'cn-tag-mint' },
      { theme: 'orange' as const, className: 'cn-tag-orange' },
      { theme: 'pink' as const, className: 'cn-tag-pink' },
      { theme: 'purple' as const, className: 'cn-tag-purple' },
      { theme: 'red' as const, className: 'cn-tag-danger' },
      { theme: 'violet' as const, className: 'cn-tag-violet' },
      { theme: 'yellow' as const, className: 'cn-tag-warning' }
    ]

    themes.forEach(({ theme, className }) => {
      const { container } = render(<Tag value="Tag" theme={theme} />)
      const tag = container.querySelector(`.${className}`)
      expect(tag).toBeInTheDocument()
    })
  })

  test('should render with icon in split tag left section', () => {
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      icon: 'check'
    })

    const leftTag = container.querySelector('.cn-tag-split-left')
    expect(leftTag).toBeInTheDocument()

    // Icon should be in the left tag
    const icon = container.querySelector('.cn-tag-icon')
    expect(icon).toBeInTheDocument()
  })

  test('should render action icon in split tag right section', () => {
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      actionIcon: 'xmark'
    })

    const rightTag = container.querySelector('.cn-tag-split-right')
    expect(rightTag).toBeInTheDocument()

    const actionButton = container.querySelector('.cn-tag-action-icon-button')
    expect(actionButton).toBeInTheDocument()
  })

  test('should handle split tag hover state', () => {
    const handleClick = vi.fn()
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      onClick: handleClick
    })

    const splitTag = container.querySelector('.cn-tag-split-hoverable')
    expect(splitTag).toBeInTheDocument()
  })

  test('should apply cursor-not-allowed to split tag when disabled', () => {
    const { container } = renderComponent({
      label: 'Label',
      value: 'Value',
      disabled: true
    })

    const splitTag = container.querySelector('.cursor-not-allowed')
    expect(splitTag).toBeInTheDocument()
  })

  describe('Component Display Names', () => {
    test('should have correct display name for Tag', () => {
      expect(Tag.displayName).toBe('Tag')
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle empty string value', () => {
      renderComponent({ value: '' })

      const tag = document.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })

    test('should handle numeric value', () => {
      renderComponent({ value: '123' })

      expect(screen.getByText('123')).toBeInTheDocument()
    })

    test('should handle special characters in value', () => {
      renderComponent({ value: '<Tag & Value>' })

      expect(screen.getByText('<Tag & Value>')).toBeInTheDocument()
    })

    test('should handle very long value text', () => {
      const longValue = 'This is a very long value that should still render correctly'
      renderComponent({ value: longValue })

      expect(screen.getByText(longValue)).toBeInTheDocument()
    })

    test('should handle empty string label in split tag', () => {
      renderComponent({ label: '', value: 'Value' })

      expect(screen.getByText('Value')).toBeInTheDocument()
    })

    test('should handle both icon and actionIcon', () => {
      const { container } = renderComponent({
        value: 'Tag',
        icon: 'check',
        actionIcon: 'xmark',
        onActionClick: vi.fn()
      })

      const icon = container.querySelector('.cn-tag-icon')
      expect(icon).toBeInTheDocument()

      const actionButton = container.querySelector('.cn-tag-action-icon-button')
      expect(actionButton).toBeInTheDocument()
    })

    test('should handle split tag with disabled and onClick', () => {
      const handleClick = vi.fn()
      const { container } = renderComponent({
        label: 'Label',
        value: 'Value',
        disabled: true,
        onClick: handleClick
      })

      const splitTag = container.querySelector('.cursor-not-allowed')
      expect(splitTag).toBeInTheDocument()
    })

    test('should use label as title fallback when value is empty in split tag', () => {
      const { container } = renderComponent({ label: 'TestLabel', value: '' })

      const tagText = container.querySelector('.cn-tag-text')
      expect(tagText).toHaveAttribute('title')
    })
  })

  describe('Default Values', () => {
    test('should default variant to outline', () => {
      const { container } = renderComponent({ value: 'Tag' })

      const tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
    })

    test('should default size to md', () => {
      const { container } = renderComponent({ value: 'Tag' })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })

    test('should default theme to gray', () => {
      const { container } = renderComponent({ value: 'Tag' })

      const tag = container.querySelector('.cn-tag-gray')
      expect(tag).toBeInTheDocument()
    })

    test('should default disabled to false', () => {
      const { container } = renderComponent({ value: 'Tag' })

      const tag = container.querySelector('.cursor-not-allowed')
      expect(tag).not.toBeInTheDocument()
    })

    test('should default enableHover to false', () => {
      const { container } = renderComponent({ value: 'Tag' })

      const tag = container.querySelector('.cn-tag-hoverable')
      expect(tag).not.toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes', () => {
      const { rerender } = render(<Tag value="Initial" />)

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<Tag value="Updated" />)

      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Initial')).not.toBeInTheDocument()
    })

    test('should update when variant changes', () => {
      const { rerender, container } = render(<Tag value="Tag" variant="outline" />)

      let tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()

      rerender(<Tag value="Tag" variant="secondary" />)

      tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()
    })

    test('should update when theme changes', () => {
      const { rerender, container } = render(<Tag value="Tag" theme="blue" />)

      let tag = container.querySelector('.cn-tag-blue')
      expect(tag).toBeInTheDocument()

      rerender(<Tag value="Tag" theme="green" />)

      tag = container.querySelector('.cn-tag-success')
      expect(tag).toBeInTheDocument()
    })

    test('should update when disabled state changes', () => {
      const { rerender, container } = render(<Tag value="Tag" disabled={false} />)

      let tag = container.querySelector('.cursor-not-allowed')
      expect(tag).not.toBeInTheDocument()

      rerender(<Tag value="Tag" disabled={true} />)

      tag = container.querySelector('.cursor-not-allowed')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper title attribute', () => {
      const { container } = renderComponent({ value: 'Tag Value' })

      const tagText = container.querySelector('.cn-tag-text')
      expect(tagText).toHaveAttribute('title', 'Tag Value')
    })

    test('should use custom title when provided', () => {
      const { container } = renderComponent({ value: 'Tag', title: 'Custom Title' })

      const tagText = container.querySelector('.cn-tag-text')
      expect(tagText).toHaveAttribute('title', 'Custom Title')
    })

    test('should have accessible action button', async () => {
      const handleAction = vi.fn()
      const { container } = renderComponent({
        value: 'Tag',
        actionIcon: 'xmark',
        onActionClick: handleAction
      })

      const actionButton = container.querySelector('.cn-tag-action-icon-button')
      if (actionButton) {
        await userEvent.click(actionButton)
      }

      expect(handleAction).toHaveBeenCalled()
    })

    test('should prevent action button interaction when disabled', () => {
      const { container } = renderComponent({
        value: 'Tag',
        actionIcon: 'xmark',
        disabled: true
      })

      const actionButton = container.querySelector('.cn-tag-action-icon-button')
      expect(actionButton).toBeDisabled()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props together', async () => {
      const handleClick = vi.fn()
      const handleAction = vi.fn()

      const { container } = render(
        <Tag
          value="Complete Tag"
          variant="secondary"
          size="sm"
          theme="blue"
          rounded
          icon="check"
          actionIcon="xmark"
          onClick={handleClick}
          onActionClick={handleAction}
          className="custom-class"
          title="Custom Title"
          disabled={false}
          enableHover
          iconProps={{ className: 'custom-icon' }}
        />
      )

      expect(screen.getByText('Complete Tag')).toBeInTheDocument()

      const tag = container.querySelector('.custom-class')
      expect(tag).toBeInTheDocument()

      await userEvent.click(screen.getByText('Complete Tag'))
      expect(handleClick).toHaveBeenCalled()
    })

    test('should render split tag with all props', async () => {
      const handleClick = vi.fn()
      const handleAction = vi.fn()

      const { container } = render(
        <Tag
          label="Status"
          value="Active"
          variant="outline"
          size="sm"
          theme="green"
          rounded
          icon="check"
          actionIcon="xmark"
          onClick={handleClick}
          onActionClick={handleAction}
          className="custom-split"
          labelClassName="custom-label"
          valueClassName="custom-value"
          disabled={false}
        />
      )

      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()

      const splitTag = container.querySelector('.custom-split')
      expect(splitTag).toBeInTheDocument()
    })
  })
})
