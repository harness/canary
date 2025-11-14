import { render } from '@testing-library/react'

import { Spacer } from '../spacer'

describe('Spacer', () => {
  it('renders a spacer div with default spacing and aria-hidden', () => {
    const { container } = render(<Spacer data-testid="spacer" />)

    const spacer = container.firstElementChild as HTMLElement
    expect(spacer.tagName.toLowerCase()).toBe('div')
    expect(spacer).toHaveAttribute('aria-hidden')
    expect(spacer.className.trim().split(/\s+/)).toContain('mt-[var(--cn-spacing-4)]')
  })

  it('applies size variants, merges custom classes, and forwards props', () => {
    const { container } = render(
      <Spacer size={2.5} className="custom-class" role="presentation" data-testid="variant-spacer" />
    )

    const spacer = container.firstElementChild as HTMLElement
    expect(spacer.className).toContain('mt-[var(--cn-spacing-2-half)]')
    expect(spacer.className).toContain('custom-class')
    expect(spacer).toHaveAttribute('role', 'presentation')
  })

  it('exposes a display name for debugging', () => {
    expect(Spacer.displayName).toBe('Spacer')
  })
})
