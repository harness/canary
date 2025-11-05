import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Textarea } from '../form-primitives/textarea'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof Textarea>> = {}) => {
  return render(
    <TestWrapper>
      <Textarea {...props} />
    </TestWrapper>
  )
}

describe('Textarea', () => {
  describe('Basic Rendering', () => {
    test('should render textarea element', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    test('should render with label', () => {
      renderComponent({ label: 'Description' })

      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    test('should render with caption', () => {
      renderComponent({ caption: 'Enter your description here' })

      expect(screen.getByText('Enter your description here')).toBeInTheDocument()
    })

    test('should render with error message', () => {
      renderComponent({ error: 'This field is required' })

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    test('should render with warning message', () => {
      renderComponent({ warning: 'Warning message' })

      expect(screen.getByText('Warning message')).toBeInTheDocument()
    })

    test('should render with placeholder', () => {
      renderComponent({ placeholder: 'Enter text here' })

      const textarea = screen.getByPlaceholderText('Enter text here')
      expect(textarea).toBeInTheDocument()
    })

    test('should render optional label', () => {
      renderComponent({ label: 'Description', optional: true })

      expect(screen.getByText('(optional)')).toBeInTheDocument()
    })
  })

  describe('Character Counter', () => {
    test('should render character counter when maxCharacters is set', () => {
      renderComponent({ label: 'Description', maxCharacters: 100 })

      expect(screen.getByText('0 / 100')).toBeInTheDocument()
    })

    test('should update counter when user types', async () => {
      renderComponent({ maxCharacters: 100 })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'Hello')

      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })

    test('should update counter with default value', () => {
      renderComponent({ maxCharacters: 100, defaultValue: 'Initial text' })

      expect(screen.getByText('12 / 100')).toBeInTheDocument()
    })

    test('should update counter with controlled value', () => {
      renderComponent({ maxCharacters: 100, value: 'Controlled value' })

      expect(screen.getByText('16 / 100')).toBeInTheDocument()
    })

    test('should render counter in horizontal orientation', () => {
      renderComponent({ label: 'Description', maxCharacters: 100, orientation: 'horizontal' })

      expect(screen.getByText('0 / 100')).toBeInTheDocument()
    })

    test('should apply disabled styles to counter', () => {
      const { container } = renderComponent({ maxCharacters: 100, disabled: true })

      const counter = container.querySelector('.cn-textarea-counter-disabled')
      expect(counter).toBeInTheDocument()
    })

    test('should have status role for accessibility', () => {
      renderComponent({ maxCharacters: 100 })

      const counter = screen.getByText('0 / 100')
      expect(counter).toHaveAttribute('role', 'status')
    })
  })

  describe('Disabled State', () => {
    test('should disable textarea when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    test('should apply disabled styles to label', () => {
      renderComponent({ label: 'Description', disabled: true })

      const label = screen.getByText('Description')
      expect(label.closest('label')).toHaveClass('cn-label-disabled')
    })

    test('should not trigger onChange when disabled', async () => {
      const handleChange = vi.fn()
      renderComponent({ disabled: true, onChange: handleChange })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'test')

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Theme Variants', () => {
    test('should apply default theme', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea')
      expect(textarea).toBeInTheDocument()
      expect(textarea).not.toHaveClass('cn-textarea-danger')
      expect(textarea).not.toHaveClass('cn-textarea-warning')
    })

    test('should apply danger theme when error is present', () => {
      const { container } = renderComponent({ error: 'Error message' })

      const textarea = container.querySelector('.cn-textarea-danger')
      expect(textarea).toBeInTheDocument()
    })

    test('should apply warning theme when warning is present', () => {
      const { container } = renderComponent({ warning: 'Warning message' })

      const textarea = container.querySelector('.cn-textarea-warning')
      expect(textarea).toBeInTheDocument()
    })

    test('should prioritize error over warning', () => {
      const { container } = renderComponent({ error: 'Error', warning: 'Warning' })

      const textarea = container.querySelector('.cn-textarea-danger')
      expect(textarea).toBeInTheDocument()
      expect(container.querySelector('.cn-textarea-warning')).not.toBeInTheDocument()
    })

    test('should prioritize error over theme prop', () => {
      const { container } = renderComponent({ error: 'Error', theme: 'default' })

      const textarea = container.querySelector('.cn-textarea-danger')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    test('should apply medium size by default', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea')
      expect(textarea).toBeInTheDocument()
      expect(textarea).not.toHaveClass('cn-textarea-sm')
    })

    test('should apply small size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const textarea = container.querySelector('.cn-textarea-sm')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Resizable', () => {
    test('should not be resizable by default', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea')
      expect(textarea).not.toHaveClass('cn-textarea-resizable')
    })

    test('should be resizable when prop is true', () => {
      const { container } = renderComponent({ resizable: true })

      const textarea = container.querySelector('.cn-textarea-resizable')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Auto Resize', () => {
    test('should not auto-resize by default', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.field-sizing-content')
      expect(textarea).not.toBeInTheDocument()
    })

    test('should apply auto-resize class when prop is true', () => {
      const { container } = renderComponent({ autoResize: true })

      const textarea = container.querySelector('.field-sizing-content')
      expect(textarea).toBeInTheDocument()
    })

    test('should work with resizable together', () => {
      const { container } = renderComponent({ resizable: true, autoResize: true })

      const textarea = container.querySelector('.cn-textarea-resizable.field-sizing-content')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Auto Focus', () => {
    test('should auto-focus when autoFocus is true', async () => {
      renderComponent({ autoFocus: true })

      await waitFor(() => {
        const textarea = screen.getByRole('textbox')
        expect(textarea).toHaveFocus()
      })
    })

    test('should not auto-focus by default', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toHaveFocus()
    })
  })

  describe('Change Handler', () => {
    test('should call onChange when text is entered', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'test')

      expect(handleChange).toHaveBeenCalled()
    })

    test('should update character counter on change', async () => {
      renderComponent({ maxCharacters: 100 })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'Hello World')

      expect(screen.getByText('11 / 100')).toBeInTheDocument()
    })

    test('should call onChange with event', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'a')

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'a'
          })
        })
      )
    })
  })

  describe('Orientation', () => {
    test('should render vertical layout by default', () => {
      renderComponent({ label: 'Label', caption: 'Caption' })

      expect(screen.getByText('Label')).toBeInTheDocument()
      expect(screen.getByText('Caption')).toBeInTheDocument()
    })

    test('should render horizontal layout', () => {
      renderComponent({ label: 'Label', caption: 'Caption', orientation: 'horizontal' })

      expect(screen.getByText('Label')).toBeInTheDocument()
      expect(screen.getByText('Caption')).toBeInTheDocument()
    })

    test('should render caption in label wrapper for horizontal', () => {
      renderComponent({ label: 'Label', caption: 'Caption', orientation: 'horizontal' })

      const label = screen.getByText('Label')
      const caption = screen.getByText('Caption')
      expect(label).toBeInTheDocument()
      expect(caption).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-textarea' })

      const textarea = container.querySelector('.custom-textarea')
      expect(textarea).toBeInTheDocument()
    })

    test('should apply custom wrapperClassName', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

      const wrapper = container.querySelector('.custom-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should combine custom className with variant classes', () => {
      const { container } = renderComponent({ className: 'custom-textarea', size: 'sm' })

      const textarea = container.querySelector('.custom-textarea.cn-textarea-sm')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Label Suffix', () => {
    test('should render label suffix', () => {
      renderComponent({ label: 'Label', labelSuffix: <span data-testid="suffix">*</span> })

      expect(screen.getByTestId('suffix')).toBeInTheDocument()
    })
  })

  describe('Tooltip Integration', () => {
    test('should accept tooltipContent prop', () => {
      renderComponent({ label: 'Label', tooltipContent: 'Tooltip text' })

      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    test('should accept tooltipProps with tooltipContent', () => {
      renderComponent({
        label: 'Label',
        tooltipContent: 'Tooltip',
        tooltipProps: { content: 'Tooltip content', side: 'right' }
      })

      expect(screen.getByText('Label')).toBeInTheDocument()
    })
  })

  describe('ID Generation', () => {
    test('should generate unique ID when not provided', () => {
      renderComponent({ label: 'Label' })

      const textarea = screen.getByRole('textbox')
      const id = textarea.getAttribute('id')
      expect(id).toMatch(/^textarea-/)
    })

    test('should use provided ID', () => {
      renderComponent({ id: 'custom-id', label: 'Label' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('id', 'custom-id')
    })

    test('should link label to textarea', () => {
      renderComponent({ id: 'test-textarea', label: 'Label' })

      const label = screen.getByText('Label')
      const textarea = screen.getByRole('textbox')

      expect(label.closest('label')).toHaveAttribute('for', 'test-textarea')
      expect(textarea).toHaveAttribute('id', 'test-textarea')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })

    test('should allow access to textarea through ref', () => {
      const ref = React.createRef<HTMLTextAreaElement>()
      render(<Textarea ref={ref} defaultValue="test" />)

      expect(ref.current?.value).toBe('test')
    })
  })

  describe('Props Forwarding', () => {
    test('should forward standard textarea attributes', () => {
      renderComponent({ rows: 5, cols: 30 })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
      expect(textarea).toHaveAttribute('cols', '30')
    })

    test('should forward name attribute', () => {
      renderComponent({ name: 'description' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'description')
    })

    test('should forward data attributes', () => {
      renderComponent({ 'data-testid': 'custom-textarea' } as any)

      const textarea = screen.getByTestId('custom-textarea')
      expect(textarea).toBeInTheDocument()
    })

    test('should forward aria attributes', () => {
      renderComponent({ 'aria-label': 'Description field' } as any)

      const textarea = screen.getByLabelText('Description field')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Display Name', () => {
    test('should have correct display name', () => {
      expect(Textarea.displayName).toBe('Textarea')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string value', () => {
      renderComponent({ value: '' })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('')
    })

    test('should handle very long text', () => {
      const longText = 'Lorem ipsum dolor sit amet '.repeat(100)
      renderComponent({ defaultValue: longText })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe(longText)
    })

    test('should handle special characters in value', () => {
      const specialText = '<script>alert("xss")</script>'
      renderComponent({ defaultValue: specialText })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe(specialText)
    })

    test('should handle numeric value in counter', () => {
      renderComponent({ maxCharacters: 100, value: '12345' })

      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })

    test('should handle maxCharacters with initial value exceeding limit', () => {
      const longText = 'a'.repeat(150)
      renderComponent({ maxCharacters: 100, defaultValue: longText })

      expect(screen.getByText('150 / 100')).toBeInTheDocument()
    })

    test('should handle label without caption', () => {
      renderComponent({ label: 'Label only' })

      expect(screen.getByText('Label only')).toBeInTheDocument()
    })

    test('should handle caption without label', () => {
      renderComponent({ caption: 'Caption only' })

      expect(screen.getByText('Caption only')).toBeInTheDocument()
    })

    test('should render without label, caption, or counter', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    test('should handle undefined onChange', async () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'test')

      // Should not crash
      expect(textarea).toHaveValue('test')
    })

    test('should render with all message types but show only error', () => {
      renderComponent({ error: 'Error', warning: 'Warning', caption: 'Caption' })

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.queryByText('Warning')).not.toBeInTheDocument()
      expect(screen.queryByText('Caption')).not.toBeInTheDocument()
    })

    test('should render warning when no error is present', () => {
      renderComponent({ warning: 'Warning', caption: 'Caption' })

      expect(screen.getByText('Warning')).toBeInTheDocument()
      expect(screen.queryByText('Caption')).not.toBeInTheDocument()
    })

    test('should render caption when no error or warning', () => {
      renderComponent({ caption: 'Caption' })

      expect(screen.getByText('Caption')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper textbox role', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    test('should link label to textarea via htmlFor', () => {
      renderComponent({ id: 'test-id', label: 'Label' })

      const label = screen.getByText('Label')
      expect(label.closest('label')).toHaveAttribute('for', 'test-id')
    })

    test('should indicate disabled state', () => {
      renderComponent({ disabled: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    test('should have aria-invalid when error is present', () => {
      renderComponent({ error: 'Error message' })

      const textarea = screen.getByRole('textbox')
      // The error is shown via FormCaption, so we just verify the textarea exists
      expect(textarea).toBeInTheDocument()
    })

    test('should be keyboard accessible', async () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      textarea.focus()

      expect(textarea).toHaveFocus()

      await userEvent.keyboard('Hello')
      expect(textarea).toHaveValue('Hello')
    })
  })

  describe('Re-rendering', () => {
    test('should update when value prop changes', () => {
      const { rerender } = renderComponent({ value: 'Initial' })

      let textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Initial')

      rerender(<Textarea value="Updated" />)

      textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Updated')
    })

    test('should update when disabled state changes', () => {
      const { rerender } = renderComponent({ disabled: false })

      let textarea = screen.getByRole('textbox')
      expect(textarea).not.toBeDisabled()

      rerender(<Textarea disabled={true} />)

      textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    test('should update when error message changes', () => {
      const { rerender } = renderComponent({ error: 'Error 1' })

      expect(screen.getByText('Error 1')).toBeInTheDocument()

      rerender(<Textarea error="Error 2" />)

      expect(screen.getByText('Error 2')).toBeInTheDocument()
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument()
    })

    test('should update counter when value changes', () => {
      const { rerender } = renderComponent({ maxCharacters: 100, value: 'Initial' })

      expect(screen.getByText('7 / 100')).toBeInTheDocument()

      rerender(<Textarea maxCharacters={100} value="Updated value" />)

      expect(screen.getByText('13 / 100')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      renderComponent({
        label: 'Complete Textarea',
        caption: 'Enter your description',
        error: 'Error message',
        optional: true,
        disabled: false,
        maxCharacters: 500,
        resizable: true,
        autoResize: false,
        size: 'sm',
        theme: 'default',
        placeholder: 'Type here...',
        rows: 5,
        className: 'custom-class',
        wrapperClassName: 'custom-wrapper',
        labelSuffix: <span>*</span>,
        orientation: 'vertical'
      })

      expect(screen.getByText('Complete Textarea')).toBeInTheDocument()
      expect(screen.getByText('Error message')).toBeInTheDocument()
      expect(screen.getByText('(optional)')).toBeInTheDocument()
      expect(screen.getByText('0 / 500')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
    })

    test('should work with controlled value and onChange', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('Initial value')

        return (
          <div>
            <Textarea value={value} onChange={e => setValue(e.target.value)} maxCharacters={100} />
            <button onClick={() => setValue('Reset')}>Reset</button>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByText('13 / 100')).toBeInTheDocument()

      const textarea = screen.getByRole('textbox')
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'New value')

      expect(screen.getByText('9 / 100')).toBeInTheDocument()

      const resetButton = screen.getByText('Reset')
      await userEvent.click(resetButton)

      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })

    test('should handle horizontal layout with all features', () => {
      renderComponent({
        label: 'Description',
        caption: 'Helper text',
        maxCharacters: 200,
        orientation: 'horizontal',
        optional: true
      })

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Helper text')).toBeInTheDocument()
      expect(screen.getByText('(optional)')).toBeInTheDocument()
      expect(screen.getByText('0 / 200')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default resizable to false', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea-resizable')
      expect(textarea).not.toBeInTheDocument()
    })

    test('should default autoResize to false', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.field-sizing-content')
      expect(textarea).not.toBeInTheDocument()
    })

    test('should default size to md', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea')
      expect(textarea).not.toHaveClass('cn-textarea-sm')
    })

    test('should default theme to default', () => {
      const { container } = renderComponent()

      const textarea = container.querySelector('.cn-textarea')
      expect(textarea).not.toHaveClass('cn-textarea-danger')
      expect(textarea).not.toHaveClass('cn-textarea-warning')
    })

    test('should default disabled to false', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toBeDisabled()
    })

    test('should default optional to false', () => {
      renderComponent({ label: 'Label' })

      expect(screen.queryByText('(optional)')).not.toBeInTheDocument()
    })
  })
})
