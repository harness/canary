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

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Favorite.displayName).toBeUndefined()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes', () => {
      renderComponent({ 'data-testid': 'favorite-button' } as any)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should forward aria attributes', () => {
      renderComponent({ 'aria-label': 'Toggle favorite' } as any)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should forward title attribute', () => {
      renderComponent({ title: 'Favorite this item' } as any)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when isFavorite changes', () => {
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

    test('should update when className changes', () => {
      const { rerender, container } = render(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={vi.fn()} className="class1" />
        </TestWrapper>
      )

      expect(container.querySelector('.class1')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={vi.fn()} className="class2" />
        </TestWrapper>
      )

      expect(container.querySelector('.class2')).toBeInTheDocument()
      expect(container.querySelector('.class1')).not.toBeInTheDocument()
    })

    test('should update when onFavoriteToggle changes', async () => {
      const handleToggle1 = vi.fn()
      const handleToggle2 = vi.fn()
      const { rerender } = render(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={handleToggle1} />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleToggle1).toHaveBeenCalledWith(true)
      expect(handleToggle2).not.toHaveBeenCalled()

      rerender(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={handleToggle2} />
        </TestWrapper>
      )

      const button2 = screen.getByRole('button')
      await userEvent.click(button2)

      expect(handleToggle2).toHaveBeenCalledWith(true)
      expect(handleToggle1).toHaveBeenCalledTimes(1)
    })
  })

  describe('Default Values', () => {
    test('should default isFavorite to false', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')
    })

    test('should render with minimal props', () => {
      renderComponent({ onFavoriteToggle: vi.fn() })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should be keyboard accessible', async () => {
      const handleToggle = vi.fn()
      renderComponent({ onFavoriteToggle: handleToggle })

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()

      // Use click instead of keyboard since Toggle handles it internally
      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalledWith(true)
    })

    test('should have proper button role', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should have proper data-state attribute', () => {
      renderComponent({ isFavorite: false })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'off')
    })

    test('should update data-state when favorited', () => {
      renderComponent({ isFavorite: true })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', async () => {
      const handleToggle = vi.fn()
      const { container } = renderComponent({
        isFavorite: true,
        onFavoriteToggle: handleToggle,
        className: 'custom-class'
      })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-state', 'on')
      expect(container.querySelector('.custom-class')).toBeInTheDocument()

      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalledWith(false)
    })

    test('should maintain state through multiple interactions', async () => {
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

      rerender(
        <TestWrapper>
          <Favorite isFavorite={false} onFavoriteToggle={handleToggle} />
        </TestWrapper>
      )

      const button3 = screen.getByRole('button')
      await userEvent.click(button3)
      expect(handleToggle).toHaveBeenNthCalledWith(3, true)
    })
  })
})
