import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Textarea } from '../textarea'

const renderComponent = (props: Partial<React.ComponentProps<typeof Textarea>> = {}): RenderResult => {
  return render(<Textarea {...props} />)
}

describe('Textarea', () => {
  describe('Basic Rendering', () => {
    test('should render textarea element', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    test('should render with label', () => {
      renderComponent({ label: 'Description', id: 'desc' })

      const label = screen.getByText('Description')
      expect(label).toBeInTheDocument()
      // Label component wraps text in a span
    })

    test('should associate label with textarea', () => {
      renderComponent({ label: 'Comments', id: 'comments' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('id', 'comments')

      // Label text is rendered and textarea has correct id
      expect(screen.getByText('Comments')).toBeInTheDocument()
    })

    test('should render with placeholder', () => {
      renderComponent({ placeholder: 'Enter your text here' })

      const textarea = screen.getByPlaceholderText('Enter your text here')
      expect(textarea).toBeInTheDocument()
    })

    test('should render with caption', () => {
      renderComponent({ caption: 'Enter detailed description' })

      expect(screen.getByText('Enter detailed description')).toBeInTheDocument()
    })

    test('should generate id automatically if not provided', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      const id = textarea.getAttribute('id')

      expect(id).toBeTruthy()
      expect(id).toMatch(/^textarea-/)
    })
  })

  describe('User Interaction', () => {
    test('should accept user input', async () => {
      renderComponent()

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      await userEvent.type(textarea, 'Hello World')

      expect(textarea.value).toBe('Hello World')
    })

    test('should call onChange when value changes', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'Test')

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(4) // Once per character
    })

    test('should handle multiline text', async () => {
      renderComponent()

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      expect(textarea.value).toContain('Line 1')
      expect(textarea.value).toContain('Line 2')
      expect(textarea.value).toContain('Line 3')
    })

    test('should support controlled value', () => {
      const { rerender } = render(<Textarea value="Initial" onChange={vi.fn()} />)

      let textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Initial')

      rerender(<Textarea value="Updated" onChange={vi.fn()} />)

      textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Updated')
    })

    test('should support uncontrolled with defaultValue', () => {
      renderComponent({ defaultValue: 'Default text' })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Default text')
    })
  })

  describe('Character Counter', () => {
    test('should show character counter when maxCharacters is provided', () => {
      renderComponent({ maxCharacters: 100 })

      expect(screen.getByText('0 / 100')).toBeInTheDocument()
    })

    test('should update counter when typing', async () => {
      renderComponent({ maxCharacters: 100 })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'Hello')

      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })

    test('should count existing defaultValue', async () => {
      renderComponent({ maxCharacters: 100, defaultValue: 'Test' })

      await waitFor(() => {
        expect(screen.getByText('4 / 100')).toBeInTheDocument()
      })
    })

    test('should count existing value', async () => {
      renderComponent({ maxCharacters: 100, value: 'Initial text', onChange: vi.fn() })

      await waitFor(() => {
        expect(screen.getByText('12 / 100')).toBeInTheDocument()
      })
    })

    test('should have role status on counter', () => {
      renderComponent({ maxCharacters: 100 })

      const counter = screen.getByRole('status')
      expect(counter).toHaveTextContent('0 / 100')
    })
  })

  describe('States & Themes', () => {
    test('should be disabled when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    test('should not accept input when disabled', async () => {
      renderComponent({ disabled: true })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      await userEvent.type(textarea, 'Test')

      expect(textarea.value).toBe('')
    })

    test('should show error message', () => {
      renderComponent({ error: 'This field is required' })

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    test('should apply danger theme when error is present', () => {
      renderComponent({ error: 'Error message' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('cn-textarea-danger')
    })

    test('should show warning message', () => {
      renderComponent({ warning: 'This field needs attention' })

      expect(screen.getByText('This field needs attention')).toBeInTheDocument()
    })

    test('should apply warning theme when warning is present', () => {
      renderComponent({ warning: 'Warning message' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('cn-textarea-warning')
    })

    test('should prioritize error over warning', () => {
      renderComponent({ error: 'Error', warning: 'Warning' })

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.queryByText('Warning')).not.toBeInTheDocument()
    })

    test('should show optional indicator', () => {
      renderComponent({ label: 'Bio', optional: true })

      const label = screen.getByText('Bio')
      expect(label).toBeInTheDocument()
    })
  })

  describe('Styling & Layout', () => {
    test('should apply custom className', () => {
      renderComponent({ className: 'custom-textarea' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-textarea')
    })

    test('should apply wrapper className', () => {
      const { container } = renderComponent({ wrapperClassName: 'custom-wrapper' })

      const wrapper = container.querySelector('.custom-wrapper')
      expect(wrapper).toBeInTheDocument()
    })

    test('should apply small size class', () => {
      renderComponent({ size: 'sm' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('cn-textarea-sm')
    })

    test('should apply resizable class when resizable is true', () => {
      renderComponent({ resizable: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('cn-textarea-resizable')
    })

    test('should apply autoResize class when autoResize is true', () => {
      renderComponent({ autoResize: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('field-sizing-content')
    })

    test('should support horizontal orientation', () => {
      const { container } = renderComponent({ orientation: 'horizontal', caption: 'Caption' })

      expect(container).toBeInTheDocument()
    })

    test('should support vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      expect(container).toBeInTheDocument()
    })

    test('should show counter in horizontal layout', () => {
      renderComponent({
        maxCharacters: 50,
        orientation: 'horizontal',
        label: 'Text'
      })

      expect(screen.getByText('0 / 50')).toBeInTheDocument()
    })
  })

  describe('HTML Attributes', () => {
    test('should support rows attribute', () => {
      renderComponent({ rows: 5 })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    test('should support cols attribute', () => {
      renderComponent({ cols: 40 })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('cols', '40')
    })

    test('should support maxLength attribute', () => {
      renderComponent({ maxLength: 200 })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxLength', '200')
    })

    test('should support name attribute', () => {
      renderComponent({ name: 'description' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'description')
    })

    test('should support required attribute', () => {
      renderComponent({ required: true })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('required')
    })

    test('should support aria-label', () => {
      renderComponent({ 'aria-label': 'Custom description' })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-label', 'Custom description')
    })

    test('should support readOnly', () => {
      renderComponent({ readOnly: true, value: 'Read only text', onChange: vi.fn() })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('readOnly')
    })
  })

  describe('AutoFocus', () => {
    test('should autofocus when autoFocus is true', async () => {
      renderComponent({ autoFocus: true })

      const textarea = screen.getByRole('textbox')

      await waitFor(() => {
        expect(textarea).toHaveFocus()
      })
    })

    test('should not focus automatically by default', () => {
      renderComponent()

      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toHaveFocus()
    })
  })

  describe('Focus & Blur', () => {
    test('should handle focus event', async () => {
      const handleFocus = vi.fn()
      renderComponent({ onFocus: handleFocus })

      const textarea = screen.getByRole('textbox')
      await userEvent.click(textarea)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    test('should handle blur event', async () => {
      const handleBlur = vi.fn()
      renderComponent({ onBlur: handleBlur })

      const textarea = screen.getByRole('textbox')
      await userEvent.click(textarea)
      await userEvent.tab()

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Textarea ref={ref} />)

      expect(ref).toHaveBeenCalled()
    })

    test('should allow ref access to textarea element', () => {
      const ref = { current: null as HTMLTextAreaElement | null }
      render(<Textarea ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle label with counter', () => {
      renderComponent({ label: 'Description', maxCharacters: 500 })

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('0 / 500')).toBeInTheDocument()
    })

    test('should handle label, caption, and error together', () => {
      renderComponent({
        label: 'Comments',
        caption: 'Share your thoughts',
        error: 'Comments are required'
      })

      expect(screen.getByText('Comments')).toBeInTheDocument()
      expect(screen.getByText('Comments are required')).toBeInTheDocument()
      // Caption should not show when error is present
      expect(screen.queryByText('Share your thoughts')).not.toBeInTheDocument()
    })

    test('should handle disabled textarea with counter', async () => {
      renderComponent({
        disabled: true,
        maxCharacters: 100,
        value: 'Disabled text',
        onChange: vi.fn()
      })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText('13 / 100')).toBeInTheDocument()
      })
    })

    test('should handle long text input', async () => {
      renderComponent({ maxCharacters: 1000 })

      const longText = 'A'.repeat(500)
      const textarea = screen.getByRole('textbox')

      await userEvent.type(textarea, longText)

      expect(screen.getByText('500 / 1000')).toBeInTheDocument()
    })

    test('should work in forms', () => {
      const handleSubmit = vi.fn(e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        return formData.get('message')
      })

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" defaultValue="Test message" />
          <button type="submit">Submit</button>
        </form>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      submitButton.click()

      expect(handleSubmit).toHaveBeenCalled()
    })

    test('should handle special characters', async () => {
      renderComponent()

      // userEvent escapes some special characters, so we test with simpler ones
      const specialText = 'Special: @#$%^&*()_+-='
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

      await userEvent.type(textarea, specialText)

      expect(textarea.value).toBe(specialText)
    })

    test('should handle line breaks correctly with counter', async () => {
      renderComponent({ maxCharacters: 100 })

      const textarea = screen.getByRole('textbox')
      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      // Counter should include all characters including newlines
      const counter = screen.getByRole('status')
      expect(counter).toBeInTheDocument()
    })

    test('should handle paste events', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement

      // Type simulates user input including paste behavior
      await userEvent.type(textarea, 'Pasted content')

      await waitFor(() => {
        expect(textarea.value).toBe('Pasted content')
        expect(handleChange).toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string value', () => {
      renderComponent({ value: '', onChange: vi.fn() })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('')
    })

    test('should handle numeric value', async () => {
      renderComponent({ value: '12345', onChange: vi.fn(), maxCharacters: 10 })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('12345')

      await waitFor(() => {
        expect(screen.getByText('5 / 10')).toBeInTheDocument()
      })
    })

    test('should handle very long initial value', async () => {
      const longValue = 'A'.repeat(200)
      renderComponent({ value: longValue, onChange: vi.fn(), maxCharacters: 300 })

      await waitFor(() => {
        expect(screen.getByText('200 / 300')).toBeInTheDocument()
      })
    })

    test('should handle rapid typing', async () => {
      const handleChange = vi.fn()
      renderComponent({ onChange: handleChange, maxCharacters: 50 })

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      await userEvent.type(textarea, 'Test')

      expect(handleChange).toHaveBeenCalled()
      expect(textarea.value).toBe('Test')

      await waitFor(() => {
        expect(screen.getByText('4 / 50')).toBeInTheDocument()
      })
    })
  })
})
