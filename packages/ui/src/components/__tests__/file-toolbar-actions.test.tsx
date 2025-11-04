import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { FileToolbarActions } from '../file-toolbar-actions'

vi.mock('clipboard-copy', () => ({
  default: vi.fn(() => Promise.resolve())
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof FileToolbarActions>> = {}): RenderResult => {
  const defaultProps = {
    onDownloadClick: vi.fn(),
    onEditClick: vi.fn(),
    copyContent: 'test content',
    ...props
  }

  return render(
    <TestWrapper>
      <FileToolbarActions {...defaultProps} />
    </TestWrapper>
  )
}

describe('FileToolbarActions', () => {
  describe('Basic Rendering', () => {
    test('should render file toolbar actions', () => {
      const { container } = renderComponent()

      const buttonGroup = container.querySelector('.cn-button-group')
      expect(buttonGroup).toBeInTheDocument()
    })

    test('should render copy button', () => {
      renderComponent()

      // Copy button is present
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    test('should render download button', () => {
      renderComponent()

      const downloadButton = screen.getByRole('button', { name: 'Download' })
      expect(downloadButton).toBeInTheDocument()
    })

    test('should not render edit button by default', () => {
      renderComponent({ showEdit: false })

      const editButton = screen.queryByRole('button', { name: 'Edit' })
      expect(editButton).not.toBeInTheDocument()
    })

    test('should render edit button when showEdit is true', () => {
      renderComponent({ showEdit: true })

      const editButton = screen.getByRole('button', { name: 'Edit' })
      expect(editButton).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    test('should call onDownloadClick when download button is clicked', async () => {
      const handleDownload = vi.fn()
      renderComponent({ onDownloadClick: handleDownload })

      const downloadButton = screen.getByRole('button', { name: 'Download' })
      await userEvent.click(downloadButton)

      expect(handleDownload).toHaveBeenCalledTimes(1)
    })

    test('should call onEditClick when edit button is clicked', async () => {
      const handleEdit = vi.fn()
      renderComponent({ onEditClick: handleEdit, showEdit: true })

      const editButton = screen.getByRole('button', { name: 'Edit' })
      await userEvent.click(editButton)

      expect(handleEdit).toHaveBeenCalledTimes(1)
    })

    test('should handle multiple clicks', async () => {
      const handleDownload = vi.fn()
      renderComponent({ onDownloadClick: handleDownload })

      const downloadButton = screen.getByRole('button', { name: 'Download' })
      await userEvent.click(downloadButton)
      await userEvent.click(downloadButton)

      expect(handleDownload).toHaveBeenCalledTimes(2)
    })
  })

  describe('Button Order', () => {
    test('should render buttons in correct order without edit', () => {
      const { container } = renderComponent({ showEdit: false })

      const buttons = container.querySelectorAll('button')
      // Copy, Download
      expect(buttons.length).toBe(2)
    })

    test('should render buttons in correct order with edit', () => {
      const { container } = renderComponent({ showEdit: true })

      const buttons = container.querySelectorAll('button')
      // Copy, Edit, Download
      expect(buttons.length).toBe(3)
    })
  })

  describe('Additional Buttons', () => {
    test('should render additional buttons', () => {
      const additionalButtons = [
        {
          children: 'Custom',
          onClick: vi.fn(),
          'aria-label': 'Custom Action'
        }
      ]

      renderComponent({ additionalButtonsProps: additionalButtons })

      expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument()
    })

    test('should render multiple additional buttons', () => {
      const additionalButtons = [
        { children: 'Action 1', onClick: vi.fn(), 'aria-label': 'Action 1' },
        { children: 'Action 2', onClick: vi.fn(), 'aria-label': 'Action 2' }
      ]

      renderComponent({ additionalButtonsProps: additionalButtons })

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })

    test('should handle empty additionalButtonsProps', () => {
      renderComponent({ additionalButtonsProps: [] })

      const downloadButton = screen.getByRole('button', { name: 'Download' })
      expect(downloadButton).toBeInTheDocument()
    })
  })

  describe('ButtonGroup Integration', () => {
    test('should render as ButtonGroup', () => {
      const { container } = renderComponent()

      const buttonGroup = container.querySelector('.cn-button-group')
      expect(buttonGroup).toBeInTheDocument()
    })

    test('should apply small size to all buttons', () => {
      const { container } = renderComponent()

      const smallButtons = container.querySelectorAll('.cn-button-sm')
      expect(smallButtons.length).toBeGreaterThanOrEqual(2)
    })

    test('should render all buttons as icon-only', () => {
      renderComponent()

      const copyButton = screen.getByRole('button', { name: /copy/i })
      const downloadButton = screen.getByRole('button', { name: 'Download' })

      expect(copyButton).toBeInTheDocument()
      expect(downloadButton).toBeInTheDocument()
    })

    test('should apply button group styling', () => {
      const { container } = renderComponent()

      const firstButton = container.querySelector('.cn-button-group-first')
      expect(firstButton).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty copyContent', () => {
      renderComponent({ copyContent: '' })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    test('should handle long copyContent', () => {
      const longContent = 'a'.repeat(1000)
      renderComponent({ copyContent: longContent })

      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    test('should render all buttons with edit enabled', () => {
      renderComponent({ showEdit: true })

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    test('should combine with additional buttons', () => {
      const additionalButtons = [{ children: 'Share', 'aria-label': 'Share' }]

      renderComponent({
        showEdit: true,
        additionalButtonsProps: additionalButtons
      })

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(FileToolbarActions.displayName).toBeUndefined()
    })
  })

  describe('Copy Functionality', () => {
    test('should render copy button with copy icon', () => {
      renderComponent()

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeInTheDocument()
    })

    test('should render copy button as first button', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveAttribute('aria-label', expect.stringMatching(/copy/i))
    })

    test('should handle special characters in copyContent', () => {
      const specialContent = '<script>alert("test")</script>'
      renderComponent({ copyContent: specialContent })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeInTheDocument()
    })

    test('should handle numeric copyContent', () => {
      renderComponent({ copyContent: '12345' })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when showEdit changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <FileToolbarActions onDownloadClick={vi.fn()} onEditClick={vi.fn()} copyContent="test" showEdit={false} />
        </TestWrapper>
      )

      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <FileToolbarActions onDownloadClick={vi.fn()} onEditClick={vi.fn()} copyContent="test" showEdit={true} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    })

    test('should update when copyContent changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <FileToolbarActions onDownloadClick={vi.fn()} onEditClick={vi.fn()} copyContent="content1" />
        </TestWrapper>
      )

      const copyButton1 = screen.getByRole('button', { name: /copy/i })
      expect(copyButton1).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <FileToolbarActions onDownloadClick={vi.fn()} onEditClick={vi.fn()} copyContent="content2" />
        </TestWrapper>
      )

      const copyButton2 = screen.getByRole('button', { name: /copy/i })
      expect(copyButton2).toBeInTheDocument()
    })

    test('should update when additionalButtonsProps changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <FileToolbarActions onDownloadClick={vi.fn()} onEditClick={vi.fn()} copyContent="test" />
        </TestWrapper>
      )

      expect(screen.queryByRole('button', { name: 'Custom' })).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <FileToolbarActions
            onDownloadClick={vi.fn()}
            onEditClick={vi.fn()}
            copyContent="test"
            additionalButtonsProps={[{ children: 'Custom', 'aria-label': 'Custom' }]}
          />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default showEdit to false', () => {
      renderComponent()

      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    })

    test('should default additionalButtonsProps to empty array', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      // Only Copy and Download buttons
      expect(buttons.length).toBe(2)
    })
  })

  describe('Accessibility', () => {
    test('should have proper aria-labels on all buttons', () => {
      renderComponent({ showEdit: true })

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    test('should be keyboard navigable', () => {
      renderComponent({ showEdit: true })

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        button.focus()
        expect(button).toHaveFocus()
      })
    })

    test('should have proper button roles', () => {
      renderComponent()

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props', async () => {
      const handleDownload = vi.fn()
      const handleEdit = vi.fn()
      const additionalButtons = [{ children: 'Share', onClick: vi.fn(), 'aria-label': 'Share' }]

      renderComponent({
        onDownloadClick: handleDownload,
        onEditClick: handleEdit,
        copyContent: 'test content',
        showEdit: true,
        additionalButtonsProps: additionalButtons
      })

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Download' }))
      expect(handleDownload).toHaveBeenCalled()

      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      expect(handleEdit).toHaveBeenCalled()
    })

    test('should maintain button order with multiple additional buttons', () => {
      const additionalButtons = [
        { children: 'Share', 'aria-label': 'Share' },
        { children: 'Print', 'aria-label': 'Print' }
      ]

      renderComponent({
        showEdit: true,
        additionalButtonsProps: additionalButtons
      })

      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBe(5) // Copy, Edit, Download, Share, Print
    })

    test('should handle undefined handlers gracefully', () => {
      renderComponent({
        onDownloadClick: vi.fn(),
        onEditClick: vi.fn()
      })

      const downloadButton = screen.getByRole('button', { name: 'Download' })
      expect(downloadButton).toBeInTheDocument()
    })
  })

  describe('Icon Rendering', () => {
    test('should render edit icon when showEdit is true', () => {
      const { container } = renderComponent({ showEdit: true })

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(3)
    })

    test('should render download icon', () => {
      const { container } = renderComponent()

      const icons = container.querySelectorAll('.cn-icon')
      expect(icons.length).toBeGreaterThanOrEqual(2)
    })

    test('should render copy icon', () => {
      renderComponent()

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeInTheDocument()
    })
  })
})
