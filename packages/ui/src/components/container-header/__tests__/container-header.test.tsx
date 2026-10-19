import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ContainerHeader } from '../index'

describe('ContainerHeader', () => {
  test('renders title as text', () => {
    render(<ContainerHeader title="Section Title" />)
    expect(screen.getByText('Section Title')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<ContainerHeader title="Title" description="A helpful description" />)
    expect(screen.getByText('A helpful description')).toBeInTheDocument()
  })

  test('does not render description when omitted', () => {
    const { container } = render(<ContainerHeader title="Title" />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  test('renders actions slot', () => {
    render(<ContainerHeader title="Title" actions={<button data-testid="action-btn">Click me</button>} />)
    expect(screen.getByTestId('action-btn')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<ContainerHeader title="Title" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('renderTitle wraps the title element', () => {
    render(
      <ContainerHeader title="Wrapped Title" renderTitle={node => <div data-testid="title-wrapper">{node}</div>} />
    )
    expect(screen.getByTestId('title-wrapper')).toHaveTextContent('Wrapped Title')
  })

  test('renderDescription wraps the description element', () => {
    render(
      <ContainerHeader
        title="Title"
        description="Wrapped Description"
        renderDescription={node => <div data-testid="description-wrapper">{node}</div>}
      />
    )
    expect(screen.getByTestId('description-wrapper')).toHaveTextContent('Wrapped Description')
  })

  test('omitting renderTitle and renderDescription leaves output unchanged', () => {
    const { container } = render(<ContainerHeader title="Plain Title" description="Plain Description" />)
    expect(screen.getByText('Plain Title')).toBeInTheDocument()
    expect(screen.getByText('Plain Description')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="title-wrapper"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="description-wrapper"]')).not.toBeInTheDocument()
  })
})
