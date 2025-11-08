import React, { ReactNode, useContext } from 'react'

import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DeleteAlertDialog } from '../dialogs/delete-alert-dialog'
import { ExitConfirmDialog } from '../dialogs/exit-confirm-dialog'

const alertDialogContext = React.createContext<{
  onConfirm?: () => void
  onOpenChange?: (open: boolean) => void
  loading?: boolean
} | null>(null)

vi.mock('@/components', () => ({
  Alert: {
    Root: ({ children, theme }: { children: ReactNode; theme?: string }) => (
      <div data-testid={`alert-root-${theme ?? 'default'}`}>{children}</div>
    ),
    Title: ({ children }: { children: ReactNode }) => <h4 data-testid="alert-title">{children}</h4>,
    Description: ({ children }: { children: ReactNode }) => <p data-testid="alert-description">{children}</p>
  },
  AlertDialog: {
    Root: ({ children, onConfirm, onOpenChange, loading, open }: any) => (
      <alertDialogContext.Provider value={{ onConfirm, onOpenChange, loading }}>
        <div data-testid="alert-dialog-root" data-open={open}>
          {children}
        </div>
      </alertDialogContext.Provider>
    ),
    Content: ({ children, title }: { children: ReactNode; title?: string }) => (
      <section>
        {title && <h3>{title}</h3>}
        {children}
      </section>
    ),
    Cancel: ({ children }: { children?: ReactNode }) => {
      const ctx = useContext(alertDialogContext)!
      return (
        <button data-testid="alert-cancel" onClick={() => ctx.onOpenChange?.(false)}>
          {children ?? 'Cancel'}
        </button>
      )
    },
    Confirm: ({ children, disabled }: { children: ReactNode; disabled?: boolean }) => {
      const ctx = useContext(alertDialogContext)!
      return (
        <button data-testid="alert-confirm" disabled={disabled || ctx.loading} onClick={() => ctx.onConfirm?.()}>
          {children}
        </button>
      )
    }
  },
  Button: ({ children, onClick, disabled }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      data-testid={`button-${typeof children === 'string' ? children : 'custom'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  ButtonLayout: ({ children }: { children: ReactNode }) => <div data-testid="button-layout">{children}</div>,
  Dialog: {
    Root: ({ children, open, onOpenChange }: any) => (
      <div data-testid="dialog-root" data-open={open} data-onchange-handler="true">
        <button
          data-testid="dialog-root-trigger-false"
          onClick={() => onOpenChange?.(false)}
          style={{ display: 'none' }}
        >
          Trigger onOpenChange false
        </button>
        <button data-testid="dialog-root-trigger-true" onClick={() => onOpenChange?.(true)} style={{ display: 'none' }}>
          Trigger onOpenChange true
        </button>
        {React.Children.map(children, child =>
          React.isValidElement(child) ? React.cloneElement(child as any, { __onOpenChange: onOpenChange }) : child
        )}
      </div>
    ),
    Content: ({ children, className }: { children: ReactNode; className?: string }) => (
      <div data-testid="dialog-content" className={className}>
        {children}
      </div>
    ),
    Header: ({ children }: { children: ReactNode }) => <header>{children}</header>,
    Footer: ({ children }: { children: ReactNode }) => <footer>{children}</footer>,
    Title: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    Description: ({ children }: { children: ReactNode }) => <p>{children}</p>,
    Close: ({ children, onClick, disabled, __onOpenChange }: any) => (
      <button
        data-testid="dialog-close"
        disabled={disabled}
        onClick={() => {
          onClick?.()
          __onOpenChange?.(false)
        }}
      >
        {children}
      </button>
    )
  },
  Message: ({ children, theme }: { children: ReactNode; theme?: string }) => (
    <div data-testid={`message-${theme}`}>{children}</div>
  ),
  MessageTheme: {
    ERROR: 'error'
  },
  Text: ({ children }: { children: ReactNode }) => <span data-testid="text-content">{children}</span>,
  TextInput: ({ value, onChange, label, error, disabled }: any) => (
    <label>
      <span>{label}</span>
      <input data-testid="verification-input" value={value} onChange={onChange} disabled={disabled} />
      {error && <div data-testid="input-error">{error}</div>}
    </label>
  )
}))

vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback
  })
}))

vi.mock('@utils/utils', () => ({
  getErrorMessage: (error: Error | { message?: string }, defaultMsg: string) => error.message || defaultMsg
}))

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('DeleteAlertDialog', () => {
  const createProps = () => ({
    open: true,
    onClose: vi.fn(),
    deleteFn: vi.fn(),
    identifier: 'project-123'
  })

  test('renders default description when type is not provided', () => {
    render(<DeleteAlertDialog {...createProps()} />)

    expect(screen.getByText(/This will permanently remove all data/)).toBeInTheDocument()
    expect(screen.getByTestId('alert-confirm')).not.toBeDisabled()
  })

  test('renders contextual message with type and deletion item', () => {
    render(<DeleteAlertDialog {...createProps()} type="repository" deletionItemName="docs-service" />)

    expect(screen.getByText(/permanently delete your repository/)).toBeInTheDocument()
    expect(screen.getByText('docs-service')).toBeInTheDocument()
  })

  test('deletes when verification matches and resets on close', async () => {
    const props = createProps()
    const { rerender } = render(<DeleteAlertDialog {...props} withForm deletionKeyword="DELETE" />)

    const input = screen.getByTestId('verification-input') as HTMLInputElement
    await userEvent.click(screen.getByTestId('alert-confirm'))
    expect(screen.getByTestId('input-error')).toHaveTextContent('Please type "DELETE" to confirm')

    fireEvent.change(input, { target: { value: 'DELETE' } })
    expect(screen.queryByTestId('input-error')).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('alert-confirm'))
    expect(props.deleteFn).toHaveBeenCalledWith('project-123')

    await act(async () => {
      screen.getByTestId('alert-cancel').click()
      vi.advanceTimersByTime(300)
    })

    expect(props.onClose).toHaveBeenCalled()
    expect((screen.getByTestId('verification-input') as HTMLInputElement).value).toBe('')

    rerender(<DeleteAlertDialog {...props} withForm deletionKeyword="DELETE" isLoading />)
    expect(screen.getByTestId('alert-confirm')).toBeDisabled()
  })

  test('displays violation messages and disables confirm when bypass not allowed', () => {
    const props = createProps()
    const { rerender } = render(<DeleteAlertDialog {...props} type="file" violation />)

    expect(screen.getByTestId('message-error')).toHaveTextContent("Some rules don't allow you to delete")
    expect(screen.getByTestId('alert-confirm')).toBeDisabled()

    rerender(<DeleteAlertDialog {...props} type="file" violation bypassable />)
    expect(screen.getByTestId('message-error')).toHaveTextContent('Some rules will be bypassed while deleting')
    expect(screen.getByTestId('alert-confirm')).not.toBeDisabled()
    expect(screen.getByTestId('alert-confirm')).toHaveTextContent('Bypass rules and delete')
  })

  test('renders error banner when request fails', () => {
    render(<DeleteAlertDialog {...createProps()} error={{ message: 'Network failure' }} />)

    expect(screen.getByTestId('alert-title')).toHaveTextContent('Failed to perform delete operation')
    expect(screen.getByTestId('alert-description')).toHaveTextContent('Network failure')
  })

  test('renders with custom message instead of default description', () => {
    render(<DeleteAlertDialog {...createProps()} message="Custom deletion message" />)

    expect(screen.getByText('Custom deletion message')).toBeInTheDocument()
    expect(screen.queryByText(/This will permanently remove all data/)).not.toBeInTheDocument()
  })

  test('handles deletion without identifier when deletionItemName is not provided', () => {
    render(<DeleteAlertDialog {...createProps()} type="branch" identifier={undefined} />)

    expect(screen.getByText(/permanently delete your branch/)).toBeInTheDocument()
  })

  test('displays deletionItemName when provided with type', () => {
    render(<DeleteAlertDialog {...createProps()} type="pipeline" deletionItemName="my-pipeline" identifier="id-123" />)

    expect(screen.getByText(/permanently delete your pipeline/)).toBeInTheDocument()
    expect(screen.getByText('my-pipeline')).toBeInTheDocument()
  })

  test('handles typing in verification input without validation error', async () => {
    const props = createProps()
    render(<DeleteAlertDialog {...props} withForm deletionKeyword="DELETE" />)

    const input = screen.getByTestId('verification-input') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'D' } })
    expect(input.value).toBe('D')

    fireEvent.change(input, { target: { value: 'DE' } })
    expect(input.value).toBe('DE')

    expect(screen.queryByTestId('input-error')).not.toBeInTheDocument()
  })
})

describe('ExitConfirmDialog', () => {
  const onCancel = vi.fn()
  const onConfirm = vi.fn()

  const renderDialog = (props = {}) =>
    render(<ExitConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} error="" isLoading={false} {...props} />)

  beforeEach(() => {
    onCancel.mockClear()
    onConfirm.mockClear()
  })

  test('shows default content and error message', () => {
    renderDialog({ error: 'Save failed' })

    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to leave this page without saving?')).toBeInTheDocument()
    expect(screen.getByText('Save failed')).toBeInTheDocument()
  })

  test('invokes cancel handlers on close actions', async () => {
    renderDialog()

    await userEvent.click(screen.getByTestId('dialog-close'))
    expect(onCancel).toHaveBeenCalled()
  })

  test('calls confirm handler and respects loading state', async () => {
    const { rerender } = renderDialog()

    await userEvent.click(screen.getByTestId('button-Leave'))
    expect(onConfirm).toHaveBeenCalled()

    rerender(<ExitConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} error="" isLoading />)
    expect(screen.getByTestId('button-Loading...')).toBeDisabled()
    expect(screen.getByTestId('dialog-close')).toBeDisabled()
  })

  test('renders with custom title, subtitle, and button text', () => {
    renderDialog({
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      confirmText: 'Proceed',
      cancelText: 'Cancel'
    })

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Proceed')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('handles onOpenChange when dialog is closed', async () => {
    const { rerender } = renderDialog()

    const dialogRoot = screen.getByTestId('dialog-root')
    const closeButton = screen.getByTestId('dialog-close')

    await userEvent.click(closeButton)

    rerender(<ExitConfirmDialog open={false} onCancel={onCancel} onConfirm={onConfirm} error="" isLoading={false} />)

    expect(dialogRoot).toHaveAttribute('data-open', 'false')
  })

  test('renders without error when error prop is not provided', () => {
    renderDialog()

    expect(screen.queryByTestId('alert-root-default')).not.toBeInTheDocument()
  })

  test('invokes onCancel when dialog close button is clicked', async () => {
    renderDialog()

    await userEvent.click(screen.getByTestId('dialog-close'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('does not invoke onCancel when onCancel is not provided', () => {
    render(<ExitConfirmDialog open onConfirm={onConfirm} error="" isLoading={false} />)

    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument()
  })

  test('handles onOpenChange callback when open changes to false', async () => {
    const onCancelMock = vi.fn()
    const { rerender } = render(
      <ExitConfirmDialog open onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />
    )

    const dialogRoot = screen.getByTestId('dialog-root')
    expect(dialogRoot).toHaveAttribute('data-open', 'true')

    rerender(
      <ExitConfirmDialog open={false} onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />
    )

    expect(dialogRoot).toHaveAttribute('data-open', 'false')
  })

  test('invokes onCancel through Dialog.Root onOpenChange when dialog is closed', async () => {
    const onCancelMock = vi.fn()

    render(<ExitConfirmDialog open onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />)

    const trigger = screen.getByTestId('dialog-root-trigger-false')
    await userEvent.click(trigger)

    expect(onCancelMock).toHaveBeenCalled()
  })

  test('does not invoke onCancel when Dialog.Root onOpenChange is called with true', async () => {
    const onCancelMock = vi.fn()

    render(<ExitConfirmDialog open onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />)

    const trigger = screen.getByTestId('dialog-root-trigger-true')
    await userEvent.click(trigger)

    expect(onCancelMock).not.toHaveBeenCalled()
  })

  test('does not disable buttons when isLoading is false', () => {
    renderDialog({ isLoading: false })

    expect(screen.getByTestId('button-Leave')).not.toBeDisabled()
    expect(screen.getByTestId('dialog-close')).not.toBeDisabled()
  })

  test('uses default isLoading value when not provided', () => {
    render(<ExitConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} error="" />)

    expect(screen.getByTestId('button-Leave')).not.toBeDisabled()
    expect(screen.getByTestId('dialog-close')).not.toBeDisabled()
  })

  test('does not invoke onCancel when onOpenChange is called with true', async () => {
    const onCancelMock = vi.fn()

    const { rerender } = render(
      <ExitConfirmDialog open={false} onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />
    )

    rerender(<ExitConfirmDialog open={true} onCancel={onCancelMock} onConfirm={onConfirm} error="" isLoading={false} />)

    expect(onCancelMock).not.toHaveBeenCalled()
  })
})
