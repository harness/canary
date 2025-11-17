import * as React from 'react'

import { ColorType, ContrastType, ModeType } from '@/context/theme/types'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { vi, type Mock } from 'vitest'

import { ThemeDialog } from '../theme-dialog'
import { getModeColorContrastFromFullTheme } from '../utils'

type MatchMediaStub = MediaQueryList & {
  __setMatches: (value: boolean) => void
  addEventListener: Mock
  removeEventListener: Mock
}

const createMatchMedia = (matches = false): MatchMediaStub => {
  let currentMatches = matches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const addEventListener = vi.fn((_: string, listener: (event: MediaQueryListEvent) => void) => {
    listeners.add(listener)
  }) as Mock
  const removeEventListener = vi.fn((_: string, listener: (event: MediaQueryListEvent) => void) => {
    listeners.delete(listener)
  }) as Mock

  const mediaQuery = {
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    __setMatches(value: boolean) {
      currentMatches = value
      listeners.forEach(listener => listener({ matches: value } as MediaQueryListEvent))
    }
  } as Partial<MatchMediaStub>

  Object.defineProperty(mediaQuery, 'matches', {
    get: () => currentMatches,
    configurable: true
  })

  return mediaQuery as MatchMediaStub
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => createMatchMedia(query.includes('dark')))
})

vi.mock('@/svgs/theme-dark.png', () => ({ default: 'dark-image' }))
vi.mock('@/svgs/theme-light.png', () => ({ default: 'light-image' }))

vi.mock('@/components', async () => {
  const { getModeColorContrastFromFullTheme } = await vi.importActual<typeof import('../utils')>('../utils')

  const Dialog = {
    Root: ({ open, onOpenChange, children }: any) => (
      <div data-testid="dialog-root" data-open={String(open)}>
        {typeof children === 'function' ? children({ open, onOpenChange }) : children}
      </div>
    ),
    Trigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-trigger">{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
    Header: ({ children }: { children: React.ReactNode }) => <header data-testid="dialog-header">{children}</header>,
    Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    Body: ({ children }: { children: React.ReactNode }) => <section>{children}</section>
  }

  const IconV2 = ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`} data-name={name}>
      {name}
    </span>
  )

  const Select = ({
    value,
    options,
    onChange
  }: {
    value: string
    options: Array<{ label: string; value: string }>
    onChange: (value: string) => void
  }) => (
    <div data-testid={`select-${value || 'empty'}`}>
      {options.map(option => (
        <button key={option.value} data-testid={`select-option-${option.value}`} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  )

  const Separator = ({ className }: { className?: string }) => (
    <div data-testid="separator" data-class={className ?? ''} />
  )

  const Text = ({
    children,
    as: Component = 'span',
    ...props
  }: {
    children: React.ReactNode
    as?: keyof JSX.IntrinsicElements
    className?: string
    color?: string
    variant?: string
  }) => <Component {...props}>{children}</Component>

  return {
    __esModule: true,
    Dialog,
    IconV2,
    Select,
    Separator,
    Text,
    getModeColorContrastFromFullTheme
  }
})

describe('getModeColorContrastFromFullTheme', () => {
  it('returns structured theme when provided a valid full theme', () => {
    const result = getModeColorContrastFromFullTheme(`${ModeType.Dark}-${ColorType.Standard}-${ContrastType.High}`)
    expect(result).toEqual({
      mode: ModeType.Dark,
      color: ColorType.Standard,
      contrast: ContrastType.High
    })
  })

  it('falls back to defaults when theme is missing or malformed', () => {
    expect(getModeColorContrastFromFullTheme()).toEqual({
      mode: ModeType.Dark,
      color: ColorType.Standard,
      contrast: ContrastType.Standard
    })
    expect(getModeColorContrastFromFullTheme('invalid-value' as any)).toEqual({
      mode: ModeType.Dark,
      color: ColorType.Standard,
      contrast: ContrastType.Standard
    })
  })
})

describe('ThemeDialog', () => {
  const defaultProps = {
    theme: `${ModeType.Dark}-${ColorType.Standard}-${ContrastType.Standard}` as const,
    setTheme: vi.fn(),
    open: true,
    onOpenChange: vi.fn()
  }

  beforeEach(() => {
    defaultProps.setTheme.mockClear()
    defaultProps.onOpenChange.mockClear()
  })

  it('renders mode options, hides system button, and triggers setTheme on selection', () => {
    ;(window.matchMedia as unknown as Mock).mockReturnValueOnce(createMatchMedia(false))

    render(
      <ThemeDialog {...defaultProps} showSystemMode={false} showAccessibilityThemeOptions={false}>
        <button type="button">Open dialog</button>
      </ThemeDialog>
    )

    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument()
    expect(screen.queryByText('System')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Light'))
    expect(defaultProps.setTheme).toHaveBeenCalledWith('light-std-std')
    expect(screen.getByTestId('icon-check-circle-solid')).toBeInTheDocument()
  })

  it('updates system preview based on matchMedia and cleans up listener on unmount', () => {
    const matchMediaMock = createMatchMedia(true)
    ;(window.matchMedia as unknown as Mock).mockReturnValueOnce(matchMediaMock)

    const view = render(
      <ThemeDialog
        {...defaultProps}
        theme={`${ModeType.System}-${ColorType.Standard}-${ContrastType.Low}`}
        showSystemMode
      />
    )

    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    const systemButton = screen.getByRole('button', { name: /System$/ })
    const systemImage = systemButton.querySelector('img') as HTMLImageElement
    expect(systemImage.getAttribute('src')).toBe('dark-image')

    matchMediaMock.__setMatches(false)
    expect(systemImage.getAttribute('src')).toBe('light-image')

    matchMediaMock.__setMatches(true)
    expect(systemImage.getAttribute('src')).toBe('dark-image')

    view.unmount()
    const [, registeredListener] = matchMediaMock.addEventListener.mock.calls[0]
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', registeredListener)
  })

  it('renders accessibility options and allows updates to contrast, color, accent, and gray selections', () => {
    const { rerender } = render(
      <ThemeDialog
        {...defaultProps}
        theme={`${ModeType.Light}-${ColorType.Standard}-${ContrastType.Standard}`}
        showAccessibilityThemeOptions
        showAccentColor
        showGrayColor
      />
    )

    fireEvent.click(screen.getByTestId('select-option-high'))
    expect(defaultProps.setTheme).toHaveBeenCalledWith('light-std-high')

    fireEvent.click(screen.getByTestId('select-option-pnd'))
    expect(defaultProps.setTheme).toHaveBeenCalledWith('light-pnd-std')

    const accentGrid = screen.getByText('Accent color').closest('div')!.parentElement as HTMLElement
    const accentButtonsContainer = accentGrid.querySelectorAll('div')[1] as HTMLElement
    const accentButtons = within(accentButtonsContainer).getAllByRole('button')
    const whiteAccentButton = accentButtons[accentButtons.length - 1] as HTMLButtonElement

    fireEvent.click(whiteAccentButton)
    expect(whiteAccentButton.className).toContain('border-cn-brand')
    const whiteSwatch = whiteAccentButton.querySelector('span') as HTMLSpanElement
    expect(whiteSwatch.style.backgroundColor).toContain('96, 96, 108')

    rerender(
      <ThemeDialog
        {...defaultProps}
        theme={`${ModeType.Dark}-${ColorType.Standard}-${ContrastType.Standard}`}
        showAccessibilityThemeOptions
        showAccentColor
        showGrayColor
      />
    )

    const darkAccentGrid = screen.getByText('Accent color').closest('div')!.parentElement as HTMLElement
    const darkAccentContainer = darkAccentGrid.querySelectorAll('div')[1] as HTMLElement
    const darkAccentButtons = within(darkAccentContainer).getAllByRole('button')
    const darkWhiteButton = darkAccentButtons[darkAccentButtons.length - 1] as HTMLButtonElement
    const darkSwatch = darkWhiteButton.querySelector('span') as HTMLSpanElement
    expect(darkSwatch.style.backgroundColor).toContain('255, 255, 255')

    const grayGrid = screen.getByText('Gray color').closest('div')!.parentElement as HTMLElement
    const grayButtonsContainer = grayGrid.querySelectorAll('div')[1] as HTMLElement
    const grayButtons = within(grayButtonsContainer).getAllByRole('button')
    const targetGray = grayButtons[1] as HTMLButtonElement

    fireEvent.click(targetGray)
    expect(targetGray.className).toContain('border-cn-2')
  })

  it('omits accent and gray sections when disabled even if accessibility options are enabled', () => {
    render(
      <ThemeDialog {...defaultProps} showAccessibilityThemeOptions showAccentColor={false} showGrayColor={false} />
    )

    expect(screen.queryByText('Accent color')).not.toBeInTheDocument()
    expect(screen.queryByText('Gray color')).not.toBeInTheDocument()
  })
})
