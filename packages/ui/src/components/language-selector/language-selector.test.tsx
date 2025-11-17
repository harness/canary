import React from 'react'

import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { LanguageDialog, languages } from './language-dialog'
import { Language, LanguageCode } from './types'

// Mock dependencies
vi.mock('@components/avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar" data-name={name} />
}))

vi.mock('../card-select', () => ({
  CardSelect: {
    Root: ({ children, type, value, onValueChange }: any) => (
      <div data-testid="card-select-root" data-type={type} data-value={value}>
        <button data-testid="card-select-change-fr" onClick={() => onValueChange && onValueChange('fr')}>
          Change to FR
        </button>
        <button data-testid="card-select-change-en" onClick={() => onValueChange && onValueChange('en')}>
          Change to EN
        </button>
        <button data-testid="card-select-change-invalid" onClick={() => onValueChange && onValueChange('invalid')}>
          Change to Invalid
        </button>
        {children}
      </div>
    ),
    Item: ({ children, value }: any) => (
      <div data-testid="card-select-item" data-value={value}>
        {children}
      </div>
    ),
    Title: ({ children }: any) => <div data-testid="card-select-title">{children}</div>
  }
}))

vi.mock('../dialog', () => ({
  Dialog: {
    Root: ({ children, open, onOpenChange }: any) => (
      <div data-testid="dialog-root" data-open={open}>
        <button data-testid="dialog-trigger-open" onClick={() => onOpenChange?.(true)}>
          Open
        </button>
        <button data-testid="dialog-trigger-close" onClick={() => onOpenChange?.(false)}>
          Close
        </button>
        {children}
      </div>
    ),
    Trigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
    Content: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
    Header: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
    Title: ({ children, className }: any) => (
      <h2 data-testid="dialog-title" className={className}>
        {children}
      </h2>
    ),
    Body: ({ children }: any) => <div data-testid="dialog-body">{children}</div>
  }
}))

describe('LanguageDialog', () => {
  const mockOnChange = vi.fn()
  const mockOnOpenChange = vi.fn()

  const supportedLanguages = [
    { code: LanguageCode.EN, name: Language.English },
    { code: LanguageCode.FR, name: Language.French }
  ]

  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultProps = {
    supportedLanguages,
    open: true,
    onOpenChange: mockOnOpenChange,
    onChange: mockOnChange,
    onSave: mockOnSave,
    onCancel: mockOnCancel
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders dialog with correct title', () => {
    render(<LanguageDialog {...defaultProps} />)

    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Language')
    expect(screen.getByTestId('dialog-title')).toHaveClass('text-cn-size-5 font-medium')
  })

  test('renders all supported languages', () => {
    render(<LanguageDialog {...defaultProps} />)

    const items = screen.getAllByTestId('card-select-item')
    expect(items).toHaveLength(2)

    expect(items[0]).toHaveAttribute('data-value', 'en')
    expect(items[1]).toHaveAttribute('data-value', 'fr')
  })

  test('displays language names correctly', () => {
    render(<LanguageDialog {...defaultProps} />)

    const titles = screen.getAllByTestId('card-select-title')
    expect(titles[0]).toHaveTextContent('English')
    expect(titles[1]).toHaveTextContent('French')
  })

  test('renders avatars for each language', () => {
    render(<LanguageDialog {...defaultProps} />)

    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(2)
    expect(avatars[0]).toHaveAttribute('data-name', 'e n')
    expect(avatars[1]).toHaveAttribute('data-name', 'f r')
  })

  test('uses default language when no language prop is provided', () => {
    render(<LanguageDialog {...defaultProps} defaultLanguage={LanguageCode.EN} />)

    const root = screen.getByTestId('card-select-root')
    expect(root).toHaveAttribute('data-value', 'en')
  })

  test('uses language prop over default language', () => {
    render(<LanguageDialog {...defaultProps} language={LanguageCode.FR} defaultLanguage={LanguageCode.EN} />)

    const root = screen.getByTestId('card-select-root')
    expect(root).toHaveAttribute('data-value', 'fr')
  })

  test('calls onChange with selected language when value changes', async () => {
    render(<LanguageDialog {...defaultProps} />)

    const changeFrButton = screen.getByTestId('card-select-change-fr')
    await userEvent.click(changeFrButton)

    expect(mockOnChange).toHaveBeenCalledWith({
      code: LanguageCode.FR,
      name: Language.French
    })
  })

  test('updates selected language state when onChange is called', async () => {
    const { rerender } = render(<LanguageDialog {...defaultProps} language={LanguageCode.EN} />)

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'en')

    rerender(<LanguageDialog {...defaultProps} language={LanguageCode.FR} />)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'fr')
  })

  test('renders dialog trigger when children are provided', () => {
    render(
      <LanguageDialog {...defaultProps}>
        <button>Select Language</button>
      </LanguageDialog>
    )

    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument()
    expect(screen.getByText('Select Language')).toBeInTheDocument()
  })

  test('does not render dialog trigger when children are not provided', () => {
    render(<LanguageDialog {...defaultProps} />)

    expect(screen.queryByTestId('dialog-trigger')).not.toBeInTheDocument()
  })

  test('respects open prop', () => {
    const { rerender } = render(<LanguageDialog {...defaultProps} open={true} />)

    expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'true')

    rerender(<LanguageDialog {...defaultProps} open={false} />)

    expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'false')
  })

  test('calls onOpenChange when dialog state changes', async () => {
    render(<LanguageDialog {...defaultProps} />)

    await userEvent.click(screen.getByTestId('dialog-trigger-open'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)

    await userEvent.click(screen.getByTestId('dialog-trigger-close'))
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  test('uses EN as default language when no default is specified', () => {
    render(<LanguageDialog {...defaultProps} />)

    const root = screen.getByTestId('card-select-root')
    expect(root).toHaveAttribute('data-value', 'en')
  })

  test('handles language change with defaultLanguage fallback', () => {
    const { rerender } = render(<LanguageDialog {...defaultProps} defaultLanguage={LanguageCode.FR} />)

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'fr')

    rerender(<LanguageDialog {...defaultProps} defaultLanguage={LanguageCode.EN} />)

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'en')
  })

  test('renders with single language option', () => {
    const singleLanguage = [{ code: LanguageCode.EN, name: Language.English }]

    render(<LanguageDialog {...defaultProps} supportedLanguages={singleLanguage} />)

    const items = screen.getAllByTestId('card-select-item')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveAttribute('data-value', 'en')
  })

  test('CardSelect has correct type prop', () => {
    render(<LanguageDialog {...defaultProps} />)

    const root = screen.getByTestId('card-select-root')
    expect(root).toHaveAttribute('data-type', 'single')
  })

  test('handles empty children prop', () => {
    render(<LanguageDialog {...defaultProps}>{null}</LanguageDialog>)

    expect(screen.queryByTestId('dialog-trigger')).not.toBeInTheDocument()
  })

  test('updates state when language prop changes from undefined to defined', () => {
    const { rerender } = render(<LanguageDialog {...defaultProps} language={undefined} />)

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'en')

    rerender(<LanguageDialog {...defaultProps} language={LanguageCode.FR} />)

    expect(screen.getByTestId('card-select-root')).toHaveAttribute('data-value', 'fr')
  })

  test('handles case when both language and defaultLanguage are undefined', () => {
    const propsWithoutDefaults = {
      ...defaultProps,
      language: undefined,
      defaultLanguage: undefined
    }
    render(<LanguageDialog {...propsWithoutDefaults} />)

    // Should still default to EN based on the component's default parameter
    const root = screen.getByTestId('card-select-root')
    expect(root).toHaveAttribute('data-value', 'en')
  })

  test('handles case when language is null and defaultLanguage is null', () => {
    const propsWithNulls = {
      ...defaultProps,
      language: null as any,
      defaultLanguage: null as any
    }
    render(<LanguageDialog {...propsWithNulls} />)

    // When both are null, neither condition in useEffect is true
    const root = screen.getByTestId('card-select-root')
    // The state should remain as null since setSelectedLanguage is never called
    // When value is null, the attribute won't be set
    expect(root.getAttribute('data-value')).toBeNull()
  })

  test('does not call onChange when invalid language code is selected', async () => {
    render(<LanguageDialog {...defaultProps} />)

    const changeInvalidButton = screen.getByTestId('card-select-change-invalid')
    await userEvent.click(changeInvalidButton)

    // onChange should not be called because 'invalid' is not in supportedLanguages
    expect(mockOnChange).not.toHaveBeenCalled()
  })
})

describe('languages constant', () => {
  test('exports correct language configurations', () => {
    expect(languages).toHaveLength(2)
    expect(languages[0]).toEqual({ code: LanguageCode.EN, name: Language.English })
    expect(languages[1]).toEqual({ code: LanguageCode.FR, name: Language.French })
  })

  test('language codes are lowercase', () => {
    languages.forEach(lang => {
      expect(lang.code).toBe(lang.code.toLowerCase())
    })
  })

  test('language names are capitalized', () => {
    languages.forEach(lang => {
      expect(lang.name[0]).toBe(lang.name[0].toUpperCase())
    })
  })
})
