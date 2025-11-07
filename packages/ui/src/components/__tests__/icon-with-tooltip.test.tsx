import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { IconWithTooltip } from '../icon-with-tooltip'

const tooltipCalls: any[] = []
const iconCalls: any[] = []

vi.mock('@/components', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    Tooltip: ({ children, ...props }: any) => {
      tooltipCalls.push(props)
      return (
        <div data-testid="mock-tooltip" data-tooltip-props={JSON.stringify(props)}>
          {children}
        </div>
      )
    },
    IconV2: ({ name, ...props }: any) => {
      iconCalls.push({ name, props })
      return <span data-testid="mock-icon" data-name={name} {...props} />
    }
  }
})

beforeEach(() => {
  tooltipCalls.length = 0
  iconCalls.length = 0
})

describe('IconWithTooltip', () => {
  test('renders tooltip with provided props', () => {
    render(<IconWithTooltip title="Help" content="More info" side="left" />)

    expect(tooltipCalls[0]).toMatchObject({ title: 'Help', content: 'More info', side: 'left' })
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument()
  })

  test('applies disabled state and pointer events class', () => {
    render(<IconWithTooltip title="Disabled" content="Tooltip" disabled className="custom-class" />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.className).toContain('pointer-events-none')
    expect(button.className).toContain('custom-class')
  })

  test('merges custom class when enabled', () => {
    render(<IconWithTooltip title="Enabled" content="Tooltip" className="enabled-class" />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    expect(button.className).toContain('enabled-class')
    expect(button.className).not.toContain('pointer-events-none')
  })

  test('passes icon props to IconV2 component', () => {
    render(
      <IconWithTooltip
        title="Icon"
        content="Tooltip"
        iconProps={{ name: 'info-circle', size: 'lg', 'aria-hidden': 'true' }}
      />
    )

    expect(iconCalls[0]).toMatchObject({ name: 'info-circle' })
    const icon = screen.getByTestId('mock-icon')
    expect(icon).toHaveAttribute('data-name', 'info-circle')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })
})
