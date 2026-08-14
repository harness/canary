import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Toaster } from '../toaster'

vi.mock('sonner', () => ({
  Toaster: ({ duration }: { duration?: number }) => <div data-testid="sonner-toaster" data-duration={duration} />
}))

describe('Toaster', () => {
  test('renders a single sonner toaster when several are mounted', () => {
    render(
      <>
        <Toaster duration={1000} />
        <Toaster duration={2000} />
        <Toaster duration={3000} />
      </>
    )

    const toasters = screen.getAllByTestId('sonner-toaster')
    expect(toasters).toHaveLength(1)
    expect(toasters[0]).toHaveAttribute('data-duration', '1000')
  })

  test('hands ownership to a still-mounted toaster when the owner unmounts', () => {
    const Harness = ({ showFirst }: { showFirst: boolean }) => (
      <>
        {showFirst && <Toaster duration={1000} />}
        <Toaster duration={2000} />
      </>
    )

    const { rerender } = render(<Harness showFirst />)
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-duration', '1000')

    rerender(<Harness showFirst={false} />)

    const toasters = screen.getAllByTestId('sonner-toaster')
    expect(toasters).toHaveLength(1)
    expect(toasters[0]).toHaveAttribute('data-duration', '2000')
  })

  test('renders again after every toaster has unmounted', () => {
    const { unmount } = render(<Toaster duration={1000} />)
    expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument()

    unmount()

    render(<Toaster duration={2000} />)
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('data-duration', '2000')
  })
})
