import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Legend } from '../legend'

vi.mock('@components/text', () => ({
  Text: ({ children, as, color, ...props }: any) => (
    <div data-component="mock-text" data-as={as} data-color={color} {...props}>
      {children}
    </div>
  )
}))

describe('Legend', () => {
  it('renders title and description with proper variants', () => {
    render(<Legend title="Section Title" description="Helpful description" />)

    const title = screen.getByText('Section Title')
    expect(title).toHaveAttribute('data-color', 'foreground-1')
    expect(title).toHaveAttribute('data-as', 'h6')

    const description = screen.getByText('Helpful description')
    expect(description).not.toHaveAttribute('data-as')
  })

  it('renders children and custom className', () => {
    render(
      <Legend title="Title" className="custom">
        <button type="button">Action</button>
      </Legend>
    )

    const container = screen.getByText('Title').closest('.custom')
    expect(container).toHaveClass('grid', 'gap-y-cn-xs', 'custom')
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})
