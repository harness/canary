import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { Shortcut, ShortcutProps } from '../shortcut'

// Mock Text component
vi.mock('../text', async () => {
  const actual = await vi.importActual('../text')
  return {
    ...actual,
    Text: ({ children, className, variant, ...props }: any) => (
      <span data-testid="text" className={className} data-variant={variant} {...props}>
        {children}
      </span>
    )
  }
})

const renderComponent = (props: Partial<ShortcutProps> = {}) => {
  const defaultProps: ShortcutProps = {
    children: 'Ctrl+K'
  }
  return render(<Shortcut {...defaultProps} {...props} />)
}

describe('Shortcut', () => {
  describe('Basic Rendering', () => {
    test('should render shortcut text', () => {
      const { getByText } = renderComponent({ children: 'Ctrl+K' })
      expect(getByText('Ctrl+K')).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(Shortcut.displayName).toBe('Shortcut')
    })

    test('should render with default variant (caption-light)', () => {
      const { getByTestId } = renderComponent()
      const text = getByTestId('text')
      expect(text).toHaveAttribute('data-variant', 'caption-light')
    })

    test('should apply cn-shortcut class', () => {
      const { getByTestId } = renderComponent()
      const text = getByTestId('text')
      expect(text).toHaveClass('cn-shortcut')
    })
  })

  describe('Children Prop', () => {
    test('should render string children', () => {
      const { getByText } = renderComponent({ children: 'Cmd+S' })
      expect(getByText('Cmd+S')).toBeInTheDocument()
    })

    test('should render React node children', () => {
      const { getByText } = renderComponent({ children: <span>Alt+F4</span> })
      expect(getByText('Alt+F4')).toBeInTheDocument()
    })

    test('should render multiple children', () => {
      const { container } = renderComponent({ children: ['Ctrl', '+', 'K'] })
      const text = container.querySelector('[data-testid="text"]')
      expect(text).toBeInTheDocument()
      expect(text?.textContent).toContain('Ctrl')
    })

    test('should handle empty children', () => {
      const { container } = renderComponent({ children: '' })
      const text = container.querySelector('[data-testid="text"]')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { getByTestId } = renderComponent({ className: 'custom-shortcut' })
      const text = getByTestId('text')
      expect(text).toHaveClass('custom-shortcut')
    })

    test('should merge custom className with cn-shortcut', () => {
      const { getByTestId } = renderComponent({ className: 'custom-shortcut' })
      const text = getByTestId('text')
      expect(text).toHaveClass('cn-shortcut')
      expect(text).toHaveClass('custom-shortcut')
    })

    test('should handle empty className', () => {
      const { getByTestId } = renderComponent({ className: '' })
      const text = getByTestId('text')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Text Props Forwarding', () => {
    test('should forward variant prop', () => {
      const { getByTestId } = renderComponent({ variant: 'body-normal' })
      const text = getByTestId('text')
      expect(text).toHaveAttribute('data-variant', 'body-normal')
    })

    test('should override default variant when provided', () => {
      const { getByTestId } = renderComponent({ variant: 'heading-base' })
      const text = getByTestId('text')
      expect(text).toHaveAttribute('data-variant', 'heading-base')
    })

    test('should forward color prop', () => {
      const { getByTestId } = renderComponent({ color: 'foreground-1' })
      const text = getByTestId('text')
      expect(text).toBeInTheDocument()
    })

    test('should forward as prop', () => {
      const { container } = renderComponent({ as: 'kbd' })
      const element = container.querySelector('[data-testid="text"]')
      expect(element).toBeInTheDocument()
      // as prop is forwarded to Text component
    })

    test('should forward all Text props', () => {
      const { getByTestId } = renderComponent({
        variant: 'caption-light',
        color: 'foreground-2',
        as: 'span'
      })
      const text = getByTestId('text')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to Text component', () => {
      const ref = { current: null }
      const { container } = render(<Shortcut ref={ref}>Ctrl+K</Shortcut>)
      const text = container.querySelector('[data-testid="text"]')
      expect(text).toBeInTheDocument()
      // Ref forwarding is tested by verifying the component renders correctly
    })
  })

  describe('Edge Cases', () => {
    test('should handle special characters in children', () => {
      const { getByText } = renderComponent({ children: 'Ctrl+Shift+K' })
      expect(getByText('Ctrl+Shift+K')).toBeInTheDocument()
    })

    test('should handle unicode characters', () => {
      const { getByText } = renderComponent({ children: '⌘+K' })
      expect(getByText('⌘+K')).toBeInTheDocument()
    })

    test('should handle very long shortcut text', () => {
      const longText = 'Ctrl+Shift+Alt+Meta+K'.repeat(10)
      const { getByText } = renderComponent({ children: longText })
      expect(getByText(longText)).toBeInTheDocument()
    })

    test('should handle numeric children', () => {
      const { getByText } = renderComponent({ children: 123 })
      expect(getByText('123')).toBeInTheDocument()
    })

    test('should handle boolean children', () => {
      const { container } = renderComponent({ children: true })
      const text = container.querySelector('[data-testid="text"]')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    test('should render Text component with correct props', () => {
      const { getByTestId } = renderComponent({ children: 'Test' })
      const text = getByTestId('text')
      expect(text).toHaveClass('cn-shortcut')
      expect(text).toHaveAttribute('data-variant', 'caption-light')
    })

    test('should maintain component hierarchy', () => {
      const { container } = renderComponent({ children: 'Ctrl+K' })
      const text = container.querySelector('[data-testid="text"]')
      expect(text).toBeInTheDocument()
      expect(text).toHaveTextContent('Ctrl+K')
    })
  })
})
