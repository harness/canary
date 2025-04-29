import { render, RenderResult, screen } from '@testing-library/react'
import { VariantProps } from 'class-variance-authority'

import { StatusBadge, statusBadgeVariants } from '../status-badge'

// Define a simpler props interface for testing
type TestProps = {
  theme?: VariantProps<typeof statusBadgeVariants>['theme']
  variant?: VariantProps<typeof statusBadgeVariants>['variant']
  size?: VariantProps<typeof statusBadgeVariants>['size']
  className?: string
  [key: string]: unknown
}

// Constants for reusable text
const BADGE_TEXT = 'badge'

// For tests, we need a simpler approach
const renderComponent = (props: TestProps = {}): RenderResult => {
  // Handle differently based on theme
  let finalProps: TestProps = { ...props }

  // If no theme and no variant, provide a default variant
  if (!props.theme && !props.variant) {
    finalProps = { ...props, variant: 'primary' }
  }

  // Using type assertion for test simplicity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return render(<StatusBadge {...(finalProps as any)}>{BADGE_TEXT}</StatusBadge>)
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
})
