import { createRef, forwardRef } from 'react'

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Shortcut } from '../shortcut'

const textCalls: Array<{ className: string; variant: string; rest: Record<string, unknown> }> = []

vi.mock('@/components', () => {
  const MockText = forwardRef<HTMLElement, any>(({ children, className, variant, ...rest }, ref) => {
    textCalls.push({ className, variant, rest })
    const { 'data-testid': dataTestId, ...otherProps } = rest
    return (
      <span
        data-testid={dataTestId ?? 'mock-text'}
        data-variant={variant}
        className={className}
        ref={ref}
        {...otherProps}
      >
        {children}
      </span>
    )
  })
  MockText.displayName = 'MockText'

  return {
    Text: MockText
  }
})

describe('Shortcut', () => {
  beforeEach(() => {
    textCalls.length = 0
  })

  it('renders underlying Text with shortcut styling and children', () => {
    render(<Shortcut>Cmd + K</Shortcut>)

    const text = screen.getByTestId('mock-text')
    expect(text).toHaveTextContent('Cmd + K')
    expect(text.getAttribute('data-variant')).toBe('caption-light')
    expect(text.className.split(/\s+/)).toContain('cn-shortcut')
    expect(textCalls[0]?.variant).toBe('caption-light')
  })

  it('merges custom class names and forwards other props', () => {
    render(
      <Shortcut className="extra-class" aria-label="shortcut" data-testid="shortcut">
        Shift + Enter
      </Shortcut>
    )

    const text = screen.getByTestId('shortcut')
    expect(text.className).toContain('cn-shortcut')
    expect(text.className).toContain('extra-class')
    expect(text).toHaveAttribute('aria-label', 'shortcut')
    expect(textCalls[0]?.rest['aria-label']).toBe('shortcut')
  })

  it('forwards refs to the underlying element', () => {
    const ref = createRef<HTMLElement>()

    render(<Shortcut ref={ref}>Space</Shortcut>)

    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName.toLowerCase()).toBe('span')
  })

  it('exposes a display name for debugging', () => {
    expect(Shortcut.displayName).toBe('Shortcut')
  })
})
