import { render, screen } from '@testing-library/react'

import { Badge } from '../badge'

import '@testing-library/jest-dom'

describe('Badge Component', () => {
  test('renders the Badge component with default props', () => {
    render(<Badge>Default Badge</Badge>)

    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex items-center border transition-colors')
  })

  test('applies variant styles correctly', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)

    const badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass('bg-destructive text-destructive-foreground hover:bg-destructive/80')
  })

  test('applies size styles correctly', () => {
    render(<Badge size="xl">XL Badge</Badge>)

    const badge = screen.getByText('XL Badge')
    expect(badge).toHaveClass('h-[18px] px-2 text-12')
  })

  test('applies borderRadius styles correctly', () => {
    render(<Badge borderRadius="full">Full Rounded Badge</Badge>)

    const badge = screen.getByText('Full Rounded Badge')
    expect(badge).toHaveClass('rounded-full')
  })

  test('applies correct theme styles', () => {
    render(<Badge theme="success">Success Badge</Badge>)

    const badge = screen.getByText('Success Badge')
    expect(badge).toHaveClass('border-tag-border-mint-1 bg-tag-background-mint-1 text-tag-foreground-mint-1')
  })
})
