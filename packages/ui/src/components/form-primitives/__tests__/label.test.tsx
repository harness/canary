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
  IconWithTooltip: ({ content, disabled, className }: any) => (
    <span data-testid="icon-tooltip" data-content={content} data-disabled={disabled} className={className}>
      tooltip
    </span>
  )
}))

describe('Label', () => {
  it('returns null when no children provided', () => {
    const { container } = render(<Label>{null}</Label>)
    expect(container.firstChild).toBeNull()
  })

  it('does not render required asterisk when optional is true', () => {
    render(
      <Label className="extra" optional>
        Name
      </Label>
    )

    const element = screen.getByText('Name').closest('[data-mock="label"]')
    expect(element).toHaveClass('cn-label', 'extra')
    expect(element?.querySelector('.cn-label-required')).toBeNull()
  })

  it('renders required asterisk when field is not optional', () => {
    render(<Label>Name</Label>)

    const element = screen.getByText('Name').closest('[data-mock="label"]')
    expect(element?.querySelector('.cn-label-required')).toHaveTextContent('*')
  })

  describe('tooltip and suffix', () => {
    it('wraps label in container when only tooltip is provided', () => {
      render(
        <Label className="extra" tooltipContent="Help text" disabled>
          Field
        </Label>
      )

      const container = screen.getByText('Field').closest('.cn-label-container')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('cn-label-container', 'extra')
      expect(container?.closest('.cn-label-wrapper')).toBeNull()

      const label = container?.querySelector('[data-mock="label"]')
      expect(label).toHaveClass('cn-label', 'cn-label-disabled')
      expect(label).not.toHaveClass('extra')

      const tooltip = screen.getByTestId('icon-tooltip')
      expect(tooltip).toHaveAttribute('data-content', 'Help text')
      expect(tooltip).toHaveAttribute('data-disabled', 'true')
      expect(tooltip).toHaveClass('cn-label-tooltip')

      expect(screen.queryByTestId('suffix')).toBeNull()
    })

    it('wraps label in wrapper when only suffix is provided', () => {
      render(
        <Label className="extra" suffix={<span data-testid="suffix">suffix</span>} disabled>
          Field
        </Label>
      )

      const wrapper = screen.getByText('Field').closest('.cn-label-wrapper')
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveClass('cn-label-wrapper', 'extra')

      const container = wrapper?.querySelector('.cn-label-container')
      expect(container).toBeInTheDocument()
      expect(container?.querySelector('[data-mock="label"]')).toHaveClass('cn-label', 'cn-label-disabled')

      expect(screen.queryByTestId('icon-tooltip')).toBeNull()
      expect(screen.getByTestId('suffix')).toHaveTextContent('suffix')
    })

    it('wraps label in wrapper with container and suffix when both are provided', () => {
      render(
        <Label className="extra" tooltipContent="Help text" suffix={<span data-testid="suffix">suffix</span>}>
          Field
        </Label>
      )

      const wrapper = screen.getByText('Field').closest('.cn-label-wrapper')
      expect(wrapper).toBeInTheDocument()
      expect(wrapper).toHaveClass('cn-label-wrapper', 'extra')

      const container = wrapper?.querySelector('.cn-label-container')
      expect(container).toBeInTheDocument()
      expect(container?.querySelector('[data-mock="label"]')).toHaveClass('cn-label')

      const tooltip = screen.getByTestId('icon-tooltip')
      expect(tooltip).toHaveAttribute('data-content', 'Help text')
      expect(tooltip).toHaveClass('cn-label-tooltip')

      expect(screen.getByTestId('suffix')).toHaveTextContent('suffix')
    })
  })
})
