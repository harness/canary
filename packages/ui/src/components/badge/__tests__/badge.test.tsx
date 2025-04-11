import { render, RenderResult, screen } from '@testing-library/react'

import { Badge } from '../badge'

// Define a simpler props interface for testing
type TestProps = {
  theme?: string
  variant?: string
  size?: string
  className?: string
  [key: string]: unknown // Better than 'any'
}

// Constants for reusable text
const BADGE_TEXT = 'badge'

// For tests, we need a simpler approach
const renderComponent = (props: TestProps = {}): RenderResult => {
  // Handle differently based on theme
  let finalProps: TestProps = { ...props }

  // If theme is 'ai', make sure variant is undefined
  if (props.theme === 'ai') {
    finalProps = { ...props, variant: undefined }
  }
  // If no theme and no variant, provide a default variant
  else if (!props.theme && !props.variant) {
    finalProps = { ...props, variant: 'surface' }
  }

  // Using type assertion for test simplicity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return render(<Badge {...(finalProps as any)}>{BADGE_TEXT}</Badge>)
}

describe('Badge', () => {
  test('it should render with default props', () => {
    renderComponent()

    expect(screen.getByText(BADGE_TEXT)).toBeInTheDocument()
  })

  test('it should apply theme styles correctly', () => {
    renderComponent({ theme: 'danger' })

    expect(screen.getByText(BADGE_TEXT)).toHaveClass(/danger/)
  })

  test('it should apply size styles correctly', () => {
    renderComponent({ size: 'sm' })

    expect(screen.getByText(BADGE_TEXT)).toHaveClass('badge-sm')
  })

  test('it should apply ai theme styles correctly', () => {
    renderComponent({ theme: 'ai' })

    expect(screen.getByText(BADGE_TEXT)).toHaveClass('badge-ai')
  })

  test('it should apply variant styles correctly', () => {
    renderComponent({ variant: 'counter' })

    expect(screen.getByText(BADGE_TEXT)).toHaveClass('badge-counter')
  })
})
