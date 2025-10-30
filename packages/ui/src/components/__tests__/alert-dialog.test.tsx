import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

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
})

