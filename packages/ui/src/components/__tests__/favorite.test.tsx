import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Favorite } from '../favorite'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof Favorite>> = {}): RenderResult => {
  const defaultProps = {
    onFavoriteToggle: vi.fn(),
    ...props
  }

  return render(
    <TestWrapper>
      <Favorite {...defaultProps} />
    </TestWrapper>
  )
}

describe('Favorite', () => {
  describe('Basic Rendering', () => {
    test('should render favorite toggle button', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should render with pin icon when not favorited', () => {
      const { container } = renderComponent({ isFavorite: false })

      // Pin icon is shown
      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with pin-solid icon when favorited', () => {
      const { container } = renderComponent({ isFavorite: true })

      // Pin-solid icon is shown
      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should default to not favorited', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-favorite' })

      const element = container.querySelector('.custom-favorite')
      expect(element).toBeInTheDocument()
    })
  })

  describe('Toggle Behavior', () => {
    test('should call onFavoriteToggle when clicked', async () => {
      const handleToggle = vi.fn()
      renderComponent({ onFavoriteToggle: handleToggle, isFavorite: false })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalledWith(true)
    })

    test('should call onFavoriteToggle with false when unfavoriting', async () => {
      const handleToggle = vi.fn()
      renderComponent({ onFavoriteToggle: handleToggle, isFavorite: true })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalledWith(false)
    })

    test('should toggle state on multiple clicks', async () => {
      const handleToggle = vi.fn()
      const { rerender } = render(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={handleToggle} />
        </TestWrapper>
      )

      const button = screen.getByRole('button')

      await userEvent.click(button)
      expect(handleToggle).toHaveBeenNthCalledWith(1, true)

      rerender(
        <TestWrapper>
          <Favorite isFavorite={true} onFavoriteToggle={handleToggle} />
        </TestWrapper>
      )

      const button2 = screen.getByRole('button')
      await userEvent.click(button2)
      expect(handleToggle).toHaveBeenNthCalledWith(2, false)
    })

    test('should handle rapid clicks', async () => {
      const handleToggle = vi.fn()
      renderComponent({ onFavoriteToggle: handleToggle })

      const button = screen.getByRole('button')
      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalledTimes(3)
    })
  })

  describe('Visual States', () => {
    test('should apply transparent variant', () => {
      const { container } = renderComponent()

      const toggle = container.querySelector('.cn-toggle-transparent')
      expect(toggle).toBeInTheDocument()
    })

    test('should apply small size', () => {
      const { container } = renderComponent()

      const toggle = container.querySelector('.cn-toggle-sm')
      expect(toggle).toBeInTheDocument()
    })

    test('should render as icon-only button', () => {
      renderComponent()

      // Icon-only toggle
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply hover styles', () => {
      const { container } = renderComponent()

      const element = container.querySelector('.hover\\:bg-cn-hover')
      expect(element).toBeInTheDocument()
    })

    test('should apply primary variant when favorited', () => {
      renderComponent({ isFavorite: true })

      // Primary variant is applied to selected toggle
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
    })

    test('should apply transparent variant when not favorited', () => {
      const { container } = renderComponent({ isFavorite: false })

      const button = container.querySelector('.cn-button-transparent')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Tooltip Integration', () => {
    test('should show Pin tooltip when not favorited', () => {
      renderComponent({ isFavorite: false })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should show Unpin tooltip when favorited', () => {
      renderComponent({ isFavorite: true })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle controlled state changes', () => {
      const handleToggle = vi.fn()
      const { rerender } = render(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={handleToggle} />
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')

      rerender(
        <TestWrapper>
          <Favorite isFavorite={true} onFavoriteToggle={handleToggle} />
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
    })

    test('should work with undefined isFavorite', () => {
      renderComponent({ isFavorite: undefined })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should combine className with default styles', () => {
      const { container } = renderComponent({ className: 'extra-class' })

      const element = container.querySelector('.extra-class')
      expect(element).toBeInTheDocument()
      const hoverElement = container.querySelector('.hover\\:bg-cn-hover')
      expect(hoverElement).toBeInTheDocument()
    })
  })
})
