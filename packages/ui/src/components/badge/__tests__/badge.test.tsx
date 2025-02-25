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

  test('it should apply variant styles correctly', () => {
    renderComponent({ variant: 'destructive' })

    expect(screen.getByText('badge')).toHaveClass(/destructive/)
  })

  test('it should apply size styles correctly', () => {
    renderComponent({ size: 'xl' })

    expect(screen.getByText('badge')).toHaveClass('h-[18px] px-2 text-12')
  })

  test('it should apply borderRadius styles correctly', () => {
    renderComponent({ borderRadius: 'full' })

    expect(screen.getByText('badge')).toHaveClass('rounded-full')
  })

  test('it should apply theme styles correctly', () => {
    renderComponent({ theme: 'success' })

    expect(screen.getByText('badge')).toHaveClass(
      'border-tag-border-mint-1 bg-tag-background-mint-1 text-tag-foreground-mint-1'
    )
  })
})
