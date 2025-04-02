import { ComponentProps } from 'react'

import { render, RenderResult, screen } from '@testing-library/react'

import { Badge } from '../badge'

const renderComponent = (props: Partial<ComponentProps<typeof Badge>> = {}): RenderResult =>
  render(<Badge {...props}>badge</Badge>)

describe('Badge', () => {
  test('it should render with default props', () => {
    renderComponent()

    expect(screen.getByText('badge')).toBeInTheDocument()
  })

  test('it should apply theme styles correctly', () => {
    renderComponent({ theme: 'danger' })

    expect(screen.getByText('badge')).toHaveClass(/danger/)
  })

  test('it should apply size styles correctly', () => {
    renderComponent({ size: 'sm' })

    expect(screen.getByText('badge')).toHaveClass('badge-sm')
  })

  test('it should apply ai theme styles correctly', () => {
    renderComponent({ theme: 'ai' })

    expect(screen.getByText('badge')).toHaveClass('badge-ai')
  })

  test('it should apply variant styles correctly', () => {
    renderComponent({ variant: 'counter' })

    expect(screen.getByText('badge')).toHaveClass('badge-counter')
  })
})
