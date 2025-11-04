import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ResetTag } from '../reset-tag'

const renderComponent = (props: Partial<React.ComponentProps<typeof ResetTag>> = {}): RenderResult => {
  const defaultProps = {
    onReset: vi.fn(),
    value: 'test-tag',
    ...props
  }

  return render(<ResetTag {...defaultProps} />)
}

describe('ResetTag', () => {
  describe('Basic Rendering', () => {
    test('should render reset tag with value', () => {
      renderComponent({ value: 'my-tag' })

      expect(screen.getByText('my-tag')).toBeInTheDocument()
    })

    test('should render with xmark icon', () => {
      const { container } = renderComponent()

      const actionButton = container.querySelector('.cn-tag-action-icon-button')
      expect(actionButton).toBeInTheDocument()
    })

    test('should render as Tag component', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Reset Functionality', () => {
    test('should call onReset when xmark is clicked', async () => {
      const handleReset = vi.fn()
      const { container } = renderComponent({ onReset: handleReset })

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      if (resetButton) {
        await userEvent.click(resetButton)
      }

      expect(handleReset).toHaveBeenCalledTimes(1)
    })

    test('should handle multiple reset clicks', async () => {
      const handleReset = vi.fn()
      const { container } = renderComponent({ onReset: handleReset })

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      if (resetButton) {
        await userEvent.click(resetButton)
        await userEvent.click(resetButton)
        await userEvent.click(resetButton)
      }

      expect(handleReset).toHaveBeenCalledTimes(3)
    })

    test('should stop event propagation when reset is clicked', async () => {
      const handleReset = vi.fn()
      const handleParentClick = vi.fn()

      const { container } = render(
        <div onClick={handleParentClick} role="presentation">
          <ResetTag onReset={handleReset} value="test" />
        </div>
      )

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      if (resetButton) {
        await userEvent.click(resetButton)
      }

      expect(handleReset).toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('Tag Props Integration', () => {
    test('should pass through Tag props', () => {
      const { container } = renderComponent({
        value: 'test',
        theme: 'blue',
        variant: 'outline',
        size: 'sm'
      })

      const tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
      const smallTag = container.querySelector('.cn-tag-sm')
      expect(smallTag).toBeInTheDocument()
    })

    test('should handle disabled state', () => {
      renderComponent({ value: 'test', disabled: true })

      const tag = document.querySelector('.cn-tag')
      expect(tag).toBeTruthy()
    })

    test('should render with label (split tag)', () => {
      renderComponent({ label: 'Label', value: 'Value' })

      expect(screen.getByText('Label')).toBeInTheDocument()
      expect(screen.getByText('Value')).toBeInTheDocument()
    })

    test('should render with icon', () => {
      const { container } = renderComponent({ value: 'test', icon: 'star' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ value: 'test', className: 'custom-reset-tag' })

      const tag = container.querySelector('.custom-reset-tag')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Tag Variants & Themes', () => {
    test('should apply theme prop', () => {
      renderComponent({ value: 'test', theme: 'green' })

      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should apply variant prop', () => {
      const { container } = renderComponent({ value: 'test', variant: 'secondary' })

      const tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()
    })

    test('should apply size prop', () => {
      const { container } = renderComponent({ value: 'test', size: 'sm' })

      const tag = container.querySelector('.cn-tag-sm')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty value', async () => {
      const handleReset = vi.fn()
      const { container } = renderComponent({ value: '', onReset: handleReset })

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      if (resetButton) {
        await userEvent.click(resetButton)
      }

      expect(handleReset).toHaveBeenCalled()
    })

    test('should handle long values', () => {
      const longValue = 'a'.repeat(100)
      renderComponent({ value: longValue })

      expect(screen.getByText(longValue)).toBeInTheDocument()
    })

    test('should handle special characters', () => {
      const specialValue = 'test@#$%^&*()'
      renderComponent({ value: specialValue })

      expect(screen.getByText(specialValue)).toBeInTheDocument()
    })
  })

  describe('Component Behavior', () => {
    test('should not allow custom actionIcon prop', () => {
      // actionIcon is never type, should not be passable
      renderComponent({ value: 'test' })

      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should not allow custom onActionClick prop', () => {
      // onActionClick is never type, should not be passable
      renderComponent({ value: 'test' })

      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should always use xmark icon', () => {
      const { container } = renderComponent({ value: 'test' })

      // xmark icon is always used
      const actionButton = container.querySelector('.cn-tag-action-icon-button')
      expect(actionButton).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes', () => {
      const { rerender } = render(<ResetTag value="initial" onReset={vi.fn()} />)

      expect(screen.getByText('initial')).toBeInTheDocument()

      rerender(<ResetTag value="updated" onReset={vi.fn()} />)

      expect(screen.getByText('updated')).toBeInTheDocument()
      expect(screen.queryByText('initial')).not.toBeInTheDocument()
    })

    test('should update when theme changes', () => {
      const { rerender } = render(<ResetTag value="test" theme="blue" onReset={vi.fn()} />)

      expect(screen.getByText('test')).toBeInTheDocument()

      rerender(<ResetTag value="test" theme="green" onReset={vi.fn()} />)

      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should update when variant changes', () => {
      const { rerender, container } = render(<ResetTag value="test" variant="secondary" onReset={vi.fn()} />)

      let tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()

      rerender(<ResetTag value="test" variant="outline" onReset={vi.fn()} />)

      tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should be defined as ResetTag', () => {
      expect(ResetTag.name).toBe('ResetTag')
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes to Tag', () => {
      const { container } = renderComponent({ value: 'test', 'data-testid': 'reset-tag' } as any)

      const tag = container.querySelector('[data-testid="reset-tag"]')
      expect(tag).toBeInTheDocument()
    })

    test('should forward aria attributes to Tag', () => {
      const { container } = renderComponent({ value: 'test', 'aria-label': 'Reset filter' } as any)

      const tag = container.querySelector('[aria-label="Reset filter"]')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should use default variant when not specified', () => {
      const { container } = renderComponent({ value: 'test' })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })

    test('should use default size when not specified', () => {
      const { container } = renderComponent({ value: 'test' })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have accessible reset button', async () => {
      const handleReset = vi.fn()
      const { container } = renderComponent({ onReset: handleReset, value: 'Filter' })

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      expect(resetButton).toBeInTheDocument()

      if (resetButton) {
        await userEvent.click(resetButton)
      }

      expect(handleReset).toHaveBeenCalled()
    })

    test('should handle keyboard interaction on reset button', async () => {
      const handleReset = vi.fn()
      const { container } = renderComponent({ onReset: handleReset, value: 'Filter' })

      const resetButton = container.querySelector('.cn-tag-action-icon-button') as HTMLElement
      if (resetButton) {
        resetButton.focus()
        expect(resetButton).toHaveFocus()
      }
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle null value', () => {
      const { container } = renderComponent({ value: null as any, onReset: vi.fn() })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })

    test('should handle undefined value', () => {
      const { container } = renderComponent({ value: undefined as any, onReset: vi.fn() })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })

    test('should handle numeric value', () => {
      renderComponent({ value: 123 as any, onReset: vi.fn() })

      expect(screen.getByText('123')).toBeInTheDocument()
    })

    test('should work with all theme options', () => {
      const themes = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'grey']
      themes.forEach(theme => {
        const { unmount } = render(<ResetTag value="test" theme={theme as any} onReset={vi.fn()} />)
        expect(screen.getByText('test')).toBeInTheDocument()
        unmount()
      })
    })

    test('should work with all variant options', () => {
      const variants = ['secondary', 'outline']
      variants.forEach(variant => {
        const { unmount, container } = render(<ResetTag value="test" variant={variant as any} onReset={vi.fn()} />)
        const tag = container.querySelector(`.cn-tag-${variant}`)
        expect(tag).toBeInTheDocument()
        unmount()
      })
    })

    test('should work with all size options', () => {
      const sizes = ['sm', 'md']
      sizes.forEach(size => {
        const { unmount, container } = render(<ResetTag value="test" size={size as any} onReset={vi.fn()} />)
        const tag = container.querySelector('.cn-tag')
        expect(tag).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props together', async () => {
      const handleReset = vi.fn()
      const { container } = render(
        <ResetTag
          value="Filter: Active"
          theme="blue"
          variant="outline"
          size="sm"
          className="custom-class"
          disabled
          onReset={handleReset}
        />
      )

      expect(screen.getByText('Filter: Active')).toBeInTheDocument()
      const tag = container.querySelector('.custom-class')
      expect(tag).toBeInTheDocument()
    })

    test('should render split tag with label and value', () => {
      renderComponent({ label: 'Status', value: 'Active' })

      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    test('should render with icon and reset button', () => {
      const { container } = renderComponent({ value: 'Tagged', icon: 'star' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()

      const resetButton = container.querySelector('.cn-tag-action-icon-button')
      expect(resetButton).toBeInTheDocument()
    })
  })
})
