import React from 'react'

import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  CommitSuggestionsDialog,
  CommitSuggestionsDialogProps
} from '../commit-suggestions-dialog/commit-suggestions-dialog'

const formState: Record<string, string> = {
  title: '',
  message: ''
}

let resetSpy: ReturnType<typeof vi.fn>

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(({ defaultValues }: { defaultValues?: Partial<typeof formState> }) => {
    Object.assign(formState, { title: '', message: '', ...defaultValues })

    resetSpy = vi.fn(values => {
      Object.assign(formState, { title: '', message: '', ...values })
    })

    const register = (name: keyof typeof formState) => ({
      name,
      value: formState[name],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        formState[name] = event.target.value
      }
    })

    const handleSubmit =
      (callback: (values: typeof formState) => Promise<void> | void) =>
      async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault?.()
        await callback({ ...formState })
      }

    return {
      register,
      handleSubmit,
      reset: resetSpy,
      formState: { isValid: true }
    }
  })
}))

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => vi.fn()
}))

vi.mock('@harnessio/ui/components', () => ({
  Alert: {
    Root: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="alert-root" className={className}>
        {children}
      </div>
    ),
    Title: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-title">{children}</div>
  },
  Button: ({ children, disabled, form, type }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      data-testid={`button-${typeof children === 'string' ? children : 'custom'}`}
      disabled={disabled}
      form={form}
      type={type}
    >
      {children}
    </button>
  ),
  ButtonLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="button-layout">{children}</div>,
  Dialog: {
    Root: ({
      children,
      open,
      onOpenChange
    }: {
      children: React.ReactNode
      open: boolean
      onOpenChange: (value: boolean) => void
    }) => (
      <div data-testid="dialog-root" data-open={open} data-onchange={typeof onOpenChange}>
        {children}
      </div>
    ),
    Content: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
    Header: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
    Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    Body: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-body">{children}</div>,
    Footer: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>,
    Close: ({
      children,
      onClick,
      disabled
    }: {
      children: React.ReactNode
      onClick?: () => void
      disabled?: boolean
    }) => (
      <button data-testid="dialog-close" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    )
  },
  FormWrapper: ({
    children,
    onSubmit,
    id
  }: {
    children: React.ReactNode
    onSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void> | void
    id?: string
  }) => (
    <form data-testid="commit-form" id={id} onSubmit={onSubmit}>
      {children}
    </form>
  ),
  FormInput: {
    Text: ({ label, ...props }: any) => (
      <label>
        <span>{label}</span>
        <input data-testid="commit-title" {...props} />
      </label>
    ),
    Textarea: ({ label, ...props }: any) => (
      <label>
        <span>{label}</span>
        <textarea data-testid="commit-message" {...props} />
      </label>
    )
  }
}))

beforeEach(() => {
  formState.title = ''
  formState.message = ''
})

const renderDialog = (props: Partial<CommitSuggestionsDialogProps> = {}) => {
  const defaultProps: CommitSuggestionsDialogProps = {
    isOpen: true,
    onClose: vi.fn(),
    onFormSubmit: vi.fn().mockResolvedValue(undefined),
    isSubmitting: false,
    commitTitlePlaceHolder: 'Auto commit message'
  }

  return render(<CommitSuggestionsDialog {...defaultProps} {...props} />)
}

describe('CommitSuggestionsDialog', () => {
  test('renders dialog with default placeholders and controls', () => {
    renderDialog()

    expect(screen.getByText('Commit Changes')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Auto commit message')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add an optional extended description')).toBeInTheDocument()
    expect(screen.getByText('Commit changes')).toBeInTheDocument()
    expect(screen.queryByTestId('alert-root')).not.toBeInTheDocument()
  })

  test('submits form values and respects submitting state', async () => {
    const onFormSubmit = vi.fn().mockResolvedValue(undefined)

    renderDialog({ onFormSubmit, isSubmitting: true })

    const titleInput = screen.getByTestId('commit-title') as HTMLInputElement
    const messageInput = screen.getByTestId('commit-message') as HTMLTextAreaElement

    expect(screen.getByText('Committing...')).toBeDisabled()
    expect(screen.getByTestId('dialog-close')).toBeDisabled()

    fireEvent.change(titleInput, { target: { value: 'Refine README' } })
    fireEvent.change(messageInput, { target: { value: 'Add more details to documentation' } })

    await act(async () => {
      await fireEvent.submit(screen.getByTestId('commit-form'))
    })

    expect(onFormSubmit).toHaveBeenCalledWith({ title: 'Refine README', message: 'Add more details to documentation' })
  })

  test('displays api error message and fallback message', () => {
    const { rerender } = renderDialog({ error: { message: 'Backend outage' } as any })

    expect(screen.getByTestId('alert-root')).toBeInTheDocument()
    expect(screen.getByTestId('alert-title')).toHaveTextContent('Backend outage')

    rerender(
      <CommitSuggestionsDialog
        isOpen={true}
        onClose={vi.fn()}
        onFormSubmit={vi.fn()}
        isSubmitting={false}
        commitTitlePlaceHolder="Auto commit message"
        error={{} as any}
      />
    )
    expect(screen.getByTestId('alert-title')).toHaveTextContent(
      'An error occurred while applying suggestions. Please try again.'
    )
  })

  test('resets form when dialog state or placeholder changes', () => {
    const { rerender } = renderDialog({ commitTitlePlaceHolder: 'Initial title' })

    expect(resetSpy).toHaveBeenCalledWith({ message: '', title: 'Initial title' })

    rerender(
      <CommitSuggestionsDialog
        isOpen={true}
        onClose={vi.fn()}
        onFormSubmit={vi.fn()}
        isSubmitting={false}
        commitTitlePlaceHolder="Updated default"
      />
    )

    expect(resetSpy).toHaveBeenLastCalledWith({ message: '', title: 'Updated default' })
  })

  test('invokes onClose when cancel button is clicked', async () => {
    const onClose = vi.fn()

    renderDialog({ onClose, isSubmitting: false })

    await userEvent.click(screen.getByTestId('dialog-close'))
    expect(onClose).toHaveBeenCalled()
  })

  test('displays error with fallback message when error.message is undefined', () => {
    renderDialog({ error: { message: undefined } as any })

    expect(screen.getByTestId('alert-title')).toHaveTextContent(
      'An error occurred while applying suggestions. Please try again.'
    )
  })

  test('handles form submission when not submitting', async () => {
    const onFormSubmit = vi.fn().mockResolvedValue(undefined)

    renderDialog({ onFormSubmit, isSubmitting: false })

    const titleInput = screen.getByTestId('commit-title') as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: 'Test commit' } })

    await act(async () => {
      await fireEvent.submit(screen.getByTestId('commit-form'))
    })

    expect(onFormSubmit).toHaveBeenCalledWith({ title: 'Test commit', message: '' })
  })

  test('uses default placeholder when commitTitlePlaceHolder is not provided', () => {
    render(
      <CommitSuggestionsDialog
        isOpen={true}
        onClose={vi.fn()}
        onFormSubmit={vi.fn()}
        isSubmitting={false}
        commitTitlePlaceHolder={undefined}
      />
    )

    expect(screen.getByPlaceholderText('Add a commit message')).toBeInTheDocument()
  })
})
