import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { render, screen } from '@testing-library/react'

import { StatusBadge, type StatusBadgeProps } from '../status-badge'

// One test per guide rule whose Check names it. The @ts-expect-error lines are checked by `pnpm typecheck`;
// if the type stops blocking a prop, the directive becomes unused and typecheck fails.

const manifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../status-badge.manifest.json'), 'utf8')) as {
  props: { shared: { name: string; values?: string[] }[] }
}

const themeValues = (): string[] => manifest.props.shared.find(prop => prop.name === 'theme')?.values ?? []

describe('StatusBadge rules', () => {
  it('SBD-004 renders a non-interactive indicator', () => {
    const blocked: StatusBadgeProps[] = [
      // @ts-expect-error onClick is omitted from StatusBadgeProps
      { variant: 'primary', onClick: () => undefined },
      // @ts-expect-error role is omitted from StatusBadgeProps
      { variant: 'primary', role: 'button' },
      // @ts-expect-error tabIndex is omitted from StatusBadgeProps
      { variant: 'primary', tabIndex: 0 }
    ]
    expect(blocked).toHaveLength(3)

    render(<StatusBadge variant="primary">Running</StatusBadge>)
    const badge = screen.getByText('Running')

    expect(badge.tagName).toBe('DIV')
    expect(badge).not.toHaveAttribute('role')
    expect(badge).not.toHaveAttribute('tabindex')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('SBD-006 exposes only the text label to assistive tech', () => {
    const { container } = render(
      <StatusBadge variant="status" theme="danger">
        Failed
      </StatusBadge>
    )

    expect(container.firstElementChild).toHaveTextContent(/^Failed$/)
    expect(container.querySelector('.cn-badge-indicator')).toHaveAttribute('aria-hidden', 'true')
  })

  it('SBD-007 gives the status variant the indicator and pulse, and other variants the icon', () => {
    const blocked: StatusBadgeProps[] = [
      // @ts-expect-error icon is never on the status variant
      { variant: 'status', icon: 'check' },
      // @ts-expect-error pulse is never on non-status variants
      { variant: 'primary', pulse: true }
    ]
    expect(blocked).toHaveLength(2)

    const status = render(
      <StatusBadge variant="status" pulse>
        Live
      </StatusBadge>
    )
    expect(status.container.querySelector('.cn-badge-indicator')).toHaveClass('animate-pulse')
    expect(status.container.querySelector('svg')).toBeNull()
    status.unmount()

    const still = render(<StatusBadge variant="status">Idle</StatusBadge>)
    expect(still.container.querySelector('.cn-badge-indicator')).not.toHaveClass('animate-pulse')
    still.unmount()

    const withIcon = render(
      <StatusBadge variant="primary" icon="check">
        Passed
      </StatusBadge>
    )
    expect(withIcon.container.querySelector('svg')).not.toBeNull()
    expect(withIcon.container.querySelector('.cn-badge-indicator')).toBeNull()
  })

  it('SBD-010 maps every manifest theme to its semantic class and accepts no others', () => {
    // @ts-expect-error theme is a closed enum
    const blocked: StatusBadgeProps = { variant: 'primary', theme: 'purple' }
    expect(blocked.theme).toBe('purple')

    const values = themeValues()
    expect(values.length).toBeGreaterThan(0)

    for (const theme of values) {
      const { unmount } = render(
        <StatusBadge variant="primary" theme={theme as StatusBadgeProps['theme']}>
          {theme}
        </StatusBadge>
      )
      expect(screen.getByText(theme)).toHaveClass(`cn-badge-${theme}`)
      unmount()
    }
  })
})
