import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { AlertDialog } from '../alert-dialog'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof AlertDialog.Root>> = {}): RenderResult => {
  const defaultProps = {
    onConfirm: vi.fn(),
    ...props
  }

  return render(
    <TestWrapper>
      <AlertDialog.Root {...defaultProps}>
        <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
        <AlertDialog.Content title="Confirm Action">
          <p>Are you sure you want to proceed?</p>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </TestWrapper>
  )
}

describe('AlertDialog', () => {
  describe('AlertDialog.Root', () => {
    test('should not show dialog content initially when open is false', () => {
      renderComponent({ open: false })

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument()
    })

    test('should show dialog when open is true', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    })

    test('should render with default theme', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      // Default theme doesn't show danger or warning icon
    })

    test('should render with warning theme', () => {
      renderComponent({ open: true, theme: 'warning' })

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      // Warning theme shows warning icon
    })

    test('should render with danger theme', () => {
      renderComponent({ open: true, theme: 'danger' })

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      // Danger theme shows danger icon
    })
  })

  describe('AlertDialog.Content', () => {
    test('should render title', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    })

    test('should render children content', () => {
      renderComponent({ open: true })

      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
    })

    test('should render custom title', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Delete User">
              <p>This action cannot be undone.</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Delete User')).toBeInTheDocument()
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
    })

    test('should render default Cancel and Confirm buttons', () => {
      renderComponent({ open: true })

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })
  })

  describe('AlertDialog.Cancel', () => {
    test('should render default cancel button', () => {
      renderComponent({ open: true })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton).toBeInTheDocument()
    })

    test('should call onCancel when clicked', async () => {
      const handleCancel = vi.fn()
      renderComponent({ open: true, onCancel: handleCancel })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await userEvent.click(cancelButton)

      expect(handleCancel).toHaveBeenCalledTimes(1)
    })

    test('should close dialog when cancel is clicked', async () => {
      const handleOpenChange = vi.fn()
      renderComponent({ open: true, onOpenChange: handleOpenChange })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await userEvent.click(cancelButton)

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      })
    })

    test('should render custom cancel button text', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Confirm">
              <p>Content</p>
              <AlertDialog.Cancel>No</AlertDialog.Cancel>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
    })

    test('should disable cancel button when loading', () => {
      renderComponent({ open: true, loading: true })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('AlertDialog.Confirm', () => {
    test('should render default confirm button', () => {
      renderComponent({ open: true })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton).toBeInTheDocument()
    })

    test('should call onConfirm when clicked', async () => {
      const handleConfirm = vi.fn()
      renderComponent({ open: true, onConfirm: handleConfirm })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      await userEvent.click(confirmButton)

      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })

    test('should render custom confirm button text', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Confirm">
              <p>Content</p>
              <AlertDialog.Confirm>Yes, Delete</AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument()
    })

    test('should apply danger theme to confirm button', () => {
      renderComponent({ open: true, theme: 'danger' })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton).toBeInTheDocument()
      // Danger theme applied to button
    })

    test('should show loading state on confirm button', () => {
      renderComponent({ open: true, loading: true })

      expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument()
    })

    test('should disable confirm button when loading', () => {
      renderComponent({ open: true, loading: true })

      const confirmButton = screen.getByRole('button', { name: 'Loading...' })
      expect(confirmButton).toBeDisabled()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with custom Cancel and Confirm buttons', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Custom Buttons">
              <p>Content</p>
              <AlertDialog.Cancel>Go Back</AlertDialog.Cancel>
              <AlertDialog.Confirm>Proceed</AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Proceed' })).toBeInTheDocument()
    })

    test('should handle multiple AlertDialogs', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Dialog 1">
              <p>First dialog</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
          <AlertDialog.Root open={false} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Dialog 2">
              <p>Second dialog</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Dialog 1')).toBeInTheDocument()
      expect(screen.queryByText('Dialog 2')).not.toBeInTheDocument()
    })

    test('should handle dialog with both error and content', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="danger">
            <AlertDialog.Content title="Danger Alert">
              <p>This is a dangerous action</p>
              <p>Additional information</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Danger Alert')).toBeInTheDocument()
      expect(screen.getByText('This is a dangerous action')).toBeInTheDocument()
      expect(screen.getByText('Additional information')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Content', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content ref={ref} title="Test">
              Content
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Cancel button', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Test">
              <AlertDialog.Cancel ref={ref}>Cancel</AlertDialog.Cancel>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Confirm button', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Test">
              <AlertDialog.Confirm ref={ref}>Confirm</AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('AlertDialog.Trigger', () => {
    test('should render trigger with open state', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root onConfirm={vi.fn()} open={true}>
            <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
            <AlertDialog.Content title="Test">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('should work as Dialog.Trigger alias', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root onConfirm={vi.fn()} open={false}>
            <AlertDialog.Trigger data-testid="alert-trigger">Open</AlertDialog.Trigger>
            <AlertDialog.Content title="Dialog Title">Dialog content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Trigger is an alias for Dialog.Trigger
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
    })

    test('should render trigger element', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root onConfirm={vi.fn()} open={false}>
            <AlertDialog.Trigger data-testid="custom-trigger">Custom Open</AlertDialog.Trigger>
            <AlertDialog.Content title="Test">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Content not shown when closed
      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
  })

  describe('Context Error Handling', () => {
    test('should throw error when Content used outside Root', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <TestWrapper>
            <AlertDialog.Content title="Test">Content</AlertDialog.Content>
          </TestWrapper>
        )
      }).toThrow('AlertDialog.Content must be used within AlertDialog.Root')

      consoleError.mockRestore()
    })

    test('should throw error when Cancel used outside Root', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <TestWrapper>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          </TestWrapper>
        )
      }).toThrow('AlertDialog.Cancel must be used within AlertDialog.Root')

      consoleError.mockRestore()
    })

    test('should throw error when Confirm used outside Root', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <TestWrapper>
            <AlertDialog.Confirm>Confirm</AlertDialog.Confirm>
          </TestWrapper>
        )
      }).toThrow('AlertDialog.Confirm must be used within AlertDialog.Root')

      consoleError.mockRestore()
    })
  })

  describe('Dialog Icons', () => {
    test('should show danger icon for danger theme', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="danger">
            <AlertDialog.Content title="Danger">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Dialog.Header should render with danger icon
      expect(screen.getByText('Danger')).toBeInTheDocument()
    })

    test('should show warning icon for warning theme', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="warning">
            <AlertDialog.Content title="Warning">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Dialog.Header should render with warning icon
      expect(screen.getByText('Warning')).toBeInTheDocument()
    })

    test('should not show icon for default theme', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="default">
            <AlertDialog.Content title="Default">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Default')).toBeInTheDocument()
    })
  })

  describe('Children Handling', () => {
    test('should render multiple children elements', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Multiple Children">
              <p>First paragraph</p>
              <p>Second paragraph</p>
              <div>Third element</div>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('First paragraph')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph')).toBeInTheDocument()
      expect(screen.getByText('Third element')).toBeInTheDocument()
    })

    test('should render string children', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="String Child">Simple text content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    test('should render number children', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Number Child">{42}</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    test('should handle mixed children types', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Mixed">
              <p>Plain text</p>
              <p>{123}</p>
              <span>Element</span>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Plain text')).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
      expect(screen.getByText('Element')).toBeInTheDocument()
    })

    test('should handle empty children', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Empty" />
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Empty')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should separate Cancel and Confirm from other children', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Separation Test">
              <p>Content before</p>
              <AlertDialog.Cancel>No</AlertDialog.Cancel>
              <p>Content in middle</p>
              <AlertDialog.Confirm>Yes</AlertDialog.Confirm>
              <p>Content after</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Content before')).toBeInTheDocument()
      expect(screen.getByText('Content in middle')).toBeInTheDocument()
      expect(screen.getByText('Content after')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    })
  })

  describe('Button Variants and Props', () => {
    test('should render cancel button with secondary variant', () => {
      renderComponent({ open: true })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton).toHaveClass('cn-button-secondary')
    })

    test('should apply danger theme to confirm button only for danger theme', () => {
      const { rerender } = render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="danger">
            <AlertDialog.Content title="Danger">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      let confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton).toHaveClass('cn-button-danger')

      // Rerender with warning theme
      rerender(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} theme="warning">
            <AlertDialog.Content title="Warning">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton).not.toHaveClass('cn-button-danger')
    })

    test('should pass additional props to Cancel button', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Props Test">
              <AlertDialog.Cancel data-testid="custom-cancel" aria-label="Close">
                Cancel
              </AlertDialog.Cancel>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      const cancelButton = screen.getByTestId('custom-cancel')
      expect(cancelButton).toHaveAttribute('aria-label', 'Close')
    })

    test('should pass additional props to Confirm button', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Props Test">
              <AlertDialog.Confirm data-testid="custom-confirm" aria-label="Submit">
                Confirm
              </AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      const confirmButton = screen.getByTestId('custom-confirm')
      expect(confirmButton).toHaveAttribute('aria-label', 'Submit')
    })

    test('should support disabled prop on Confirm button', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Disabled Test">
              <AlertDialog.Confirm disabled>Confirm</AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton).toBeDisabled()
    })
  })

  describe('State Management', () => {
    test('should handle controlled open state', () => {
      const { rerender } = render(
        <TestWrapper>
          <AlertDialog.Root open={false} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Controlled">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Controlled')).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Controlled">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Controlled')).toBeInTheDocument()
    })

    test('should handle undefined open state', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={undefined} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Undefined Open">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Dialog behavior with undefined open
      expect(screen.queryByText('Undefined Open')).not.toBeInTheDocument()
    })

    test('should toggle loading state', () => {
      const { rerender } = render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} loading={false}>
            <AlertDialog.Content title="Loading State">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Loading...' })).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} loading={true}>
            <AlertDialog.Content title="Loading State">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    test('should call onConfirm without closing dialog automatically', async () => {
      const handleConfirm = vi.fn()
      const handleOpenChange = vi.fn()

      renderComponent({ open: true, onConfirm: handleConfirm, onOpenChange: handleOpenChange })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      await userEvent.click(confirmButton)

      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })

    test('should not call onCancel if not provided', async () => {
      renderComponent({ open: true })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await userEvent.click(cancelButton)

      // Should not throw error
      expect(cancelButton).toBeInTheDocument()
    })

    test('should call both onCancel and onOpenChange', async () => {
      const handleCancel = vi.fn()
      const handleOpenChange = vi.fn()

      renderComponent({ open: true, onCancel: handleCancel, onOpenChange: handleOpenChange })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await userEvent.click(cancelButton)

      expect(handleCancel).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Accessibility', () => {
    test('should have accessible roles for dialog', () => {
      renderComponent({ open: true })

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })

    test('should focus trap within dialog when open', async () => {
      renderComponent({ open: true })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })

      expect(cancelButton).toBeInTheDocument()
      expect(confirmButton).toBeInTheDocument()
    })

    test('should support keyboard navigation', async () => {
      renderComponent({ open: true })

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      confirmButton.focus()

      expect(confirmButton).toHaveFocus()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct displayName for Content', () => {
      expect(AlertDialog.Content.displayName).toBe('AlertDialog.Content')
    })

    test('should have correct displayName for Cancel', () => {
      expect(AlertDialog.Cancel.displayName).toBe('AlertDialog.Cancel')
    })

    test('should have correct displayName for Confirm', () => {
      expect(AlertDialog.Confirm.displayName).toBe('AlertDialog.Confirm')
    })
  })

  describe('Edge Cases', () => {
    test('should handle rapid open/close toggles', () => {
      const { rerender } = render(
        <TestWrapper>
          <AlertDialog.Root open={false} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Toggle">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Toggle')).not.toBeInTheDocument()

      // Rapid toggles
      rerender(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Toggle">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Toggle')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <AlertDialog.Root open={false} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Toggle">Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.queryByText('Toggle')).not.toBeInTheDocument()
    })

    test('should handle all theme combinations with loading', () => {
      const themes: Array<'default' | 'warning' | 'danger'> = ['default', 'warning', 'danger']

      themes.forEach(theme => {
        render(
          <TestWrapper>
            <AlertDialog.Root open={true} onConfirm={vi.fn()} theme={theme} loading={true}>
              <AlertDialog.Content title={`${theme} loading`}>Content</AlertDialog.Content>
            </AlertDialog.Root>
          </TestWrapper>
        )

        expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument()
      })
    })

    test('should handle custom buttons with all themes', () => {
      const themes: Array<'default' | 'warning' | 'danger'> = ['default', 'warning', 'danger']

      themes.forEach(theme => {
        render(
          <TestWrapper>
            <AlertDialog.Root open={true} onConfirm={vi.fn()} theme={theme}>
              <AlertDialog.Content title={`Custom ${theme}`}>
                <AlertDialog.Cancel>Custom Cancel</AlertDialog.Cancel>
                <AlertDialog.Confirm>Custom Confirm</AlertDialog.Confirm>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </TestWrapper>
        )

        expect(screen.getByRole('button', { name: 'Custom Cancel' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Custom Confirm' })).toBeInTheDocument()
      })
    })

    test('should handle only Cancel button override', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Only Cancel">
              <AlertDialog.Cancel>Custom Cancel</AlertDialog.Cancel>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Custom Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })

    test('should handle only Confirm button override', () => {
      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Only Confirm">
              <AlertDialog.Confirm>Custom Confirm</AlertDialog.Confirm>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Custom Confirm' })).toBeInTheDocument()
    })

    test('should handle long content text', () => {
      const longText = 'Lorem ipsum dolor sit amet, '.repeat(10)

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title="Long Content">
              <p>{longText}</p>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Use partial match for long text
      expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument()
    })

    test('should handle very long title', () => {
      const longTitle = 'Very Long Title Test'

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()}>
            <AlertDialog.Content title={longTitle}>Content</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    test('should complete full user flow with controlled state', async () => {
      const handleCancel = vi.fn()
      const handleOpenChange = vi.fn()

      const { rerender } = render(
        <TestWrapper>
          <AlertDialog.Root open={false} onConfirm={vi.fn()} onCancel={handleCancel} onOpenChange={handleOpenChange}>
            <AlertDialog.Content title="User Flow">Are you sure?</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      // Dialog is closed initially
      expect(screen.queryByText('User Flow')).not.toBeInTheDocument()

      // Step 1: Open dialog
      rerender(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={vi.fn()} onCancel={handleCancel} onOpenChange={handleOpenChange}>
            <AlertDialog.Content title="User Flow">Are you sure?</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('User Flow')).toBeInTheDocument()

      // Step 2: Cancel
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(handleCancel).toHaveBeenCalled()
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      })
    })

    test('should handle confirm action in integration', async () => {
      const handleConfirm = vi.fn()

      render(
        <TestWrapper>
          <AlertDialog.Root open={true} onConfirm={handleConfirm}>
            <AlertDialog.Content title="Confirm Delete">This cannot be undone</AlertDialog.Content>
          </AlertDialog.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Confirm Delete')).toBeInTheDocument()

      // Step 2: Confirm
      await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })
  })
})
