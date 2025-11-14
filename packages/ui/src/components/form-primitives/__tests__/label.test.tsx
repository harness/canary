import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Label } from '../label'

vi.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: any) => (
    <label data-mock="label" {...props}>
      {children}
    </label>
  )
}))

vi.mock('@components/icon-with-tooltip', () => ({
  IconWithTooltip: ({ content, disabled }: any) => (
    <span data-testid="icon-tooltip" data-content={content} data-disabled={disabled}>
      tooltip
    </span>
  )
}))

describe('Label', () => {
  it('returns null when no children provided', () => {
    const { container } = render(<Label>{null}</Label>)
    expect(container.firstChild).toBeNull()
  })

  it('renders base label with text and optional indicator', () => {
    render(
      <Label className="extra" optional>
        Name
      </Label>
    )

    const element = screen.getByText('Name').closest('[data-mock="label"]')
    expect(element).toHaveClass('cn-label', 'extra')
    expect(element?.querySelector('.cn-label-optional')).toHaveTextContent('(optional)')
  })

  it('wraps label when tooltip or suffix provided', () => {
    render(
      <Label tooltipContent="Help text" suffix={<span data-testid="suffix">suffix</span>} disabled>
        Field
      </Label>
    )

    const container = screen.getByText('Field').closest('.cn-label-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('cn-label-container')

    const label = container?.querySelector('[data-mock="label"]')
    expect(label).toHaveClass('cn-label', 'cn-label-disabled')

    const tooltip = screen.getByTestId('icon-tooltip')
    expect(tooltip).toHaveAttribute('data-content', 'Help text')
    expect(tooltip).toHaveAttribute('data-disabled', 'true')

    expect(screen.getByTestId('suffix')).toHaveTextContent('suffix')
  })
})
