import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Caption } from '../caption'

vi.mock('@components/text', () => ({
  Text: ({ children, className, ...props }: any) => (
    <span data-component="mock-text" className={className} {...props}>
      {children}
    </span>
  )
}))

describe('Caption', () => {
  it('renders children with default spacing and custom styles', () => {
    const { container } = render(<Caption className="custom-class">Helpful hint</Caption>)

    const text = container.querySelector('span')
    expect(text).not.toBeNull()
    expect(text).toHaveTextContent('Helpful hint')
    expect(text).toHaveClass('mt-cn-3xs')
    expect(text).toHaveClass('custom-class')
    expect(text).toHaveAttribute('data-component', 'mock-text')
  })

  it('renders as span element via Text as prop', () => {
    render(<Caption>Content</Caption>)

    const text = screen.getByText('Content')
    expect(text).toHaveTextContent('Content')
    expect(text).toHaveAttribute('data-component', 'mock-text')
    expect(text).toHaveAttribute('as', 'span')
  })
})
