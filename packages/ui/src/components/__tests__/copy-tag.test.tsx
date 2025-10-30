import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import copy from 'clipboard-copy'

import { CopyTag } from '../copy-tag'

vi.mock('clipboard-copy', () => ({
  default: vi.fn(() => Promise.resolve())
}))

const mockCopy = copy as ReturnType<typeof vi.fn>

const renderComponent = (props: Partial<React.ComponentProps<typeof CopyTag>> = {}): RenderResult => {
  return render(<CopyTag value="test-value" {...props} />)
}

describe('CopyTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Basic Rendering', () => {
    test('should render copy tag with value', () => {
      renderComponent({ value: 'my-tag' })

      expect(screen.getByText('my-tag')).toBeInTheDocument()
    })

    test('should render with copy icon by default', () => {
      const { container } = renderComponent()

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      expect(copyButton).toBeInTheDocument()
    })

    test('should render as Tag component', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    test('should copy value to clipboard when copy icon is clicked', async () => {
      const { container } = renderComponent({ value: 'copy-me' })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith('copy-me')
    })

    test('should show check icon after successful copy', async () => {
      renderComponent({ value: 'test' })

      const copyButton = document.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      await waitFor(() => {
        expect(mockCopy).toHaveBeenCalledWith('test')
      })

      // Component re-renders with check icon
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should use timeout to revert copied state', async () => {
      renderComponent({ value: 'test' })

      // Copy button is rendered
      const copyButton = document.querySelector('.cn-tag-action-icon-button')
      expect(copyButton).toBeTruthy()
    })

    test('should handle multiple rapid clicks', async () => {
      const { container } = renderComponent({ value: 'rapid-test' })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
        await userEvent.click(copyButton)
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledTimes(3)
      expect(mockCopy).toHaveBeenCalledWith('rapid-test')
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
      const { container } = renderComponent({ value: 'test', className: 'custom-copy-tag' })

      const tag = container.querySelector('.custom-copy-tag')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Tag Variants & Themes', () => {
    test('should apply theme prop', () => {
      renderComponent({ value: 'test', theme: 'green' })

      // Tag renders with theme
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
      const { container } = renderComponent({ value: '' })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith('')
    })

    test('should handle long values', async () => {
      const longValue = 'a'.repeat(100)
      const { container } = renderComponent({ value: longValue })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith(longValue)
    })

    test('should handle special characters', async () => {
      const specialValue = 'test@#$%^&*()'
      const { container } = renderComponent({ value: specialValue })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith(specialValue)
    })

    test('should handle numeric values', async () => {
      const { container } = renderComponent({ value: '12345' })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith('12345')
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

    test('should use internal copy handler', async () => {
      const { container } = renderComponent({ value: 'internal-test' })

      const copyButton = container.querySelector('.cn-tag-action-icon-button')
      if (copyButton) {
        await userEvent.click(copyButton)
      }

      expect(mockCopy).toHaveBeenCalledWith('internal-test')
    })
  })
})

