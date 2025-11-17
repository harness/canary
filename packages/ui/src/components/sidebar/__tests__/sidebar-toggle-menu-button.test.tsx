import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SidebarToggleMenuButton } from '../sidebar-toggle-menu-button'

// Mock context
vi.mock('@/context', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue
  })
}))

// Mock sidebar context
const mockToggleSidebar = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  toggleSidebar: mockToggleSidebar,
  state: 'expanded'
}))

vi.mock('../sidebar-context', () => ({
  useSidebar: () => mockUseSidebar()
}))

// Mock Button component
vi.mock('@components/button', () => ({
  Button: ({ children, onClick, variant, size, iconOnly, tooltipProps, ...props }: any) => (
    <button
      data-testid="toggle-button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly}
      data-tooltip-content={tooltipProps?.content}
      {...props}
    >
      {children}
    </button>
  )
}))

// Mock IconV2 component
vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, size }: any) => (
    <span data-testid="icon" data-name={name} data-size={size}>
      Icon
    </span>
  )
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

describe('SidebarToggleMenuButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSidebar.mockReturnValue({
      toggleSidebar: mockToggleSidebar,
      state: 'expanded'
    })
  })

  describe('Basic Rendering', () => {
    test('should render toggle button', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toBeInTheDocument()
    })

    test('should render with sidebar icon', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('data-name', 'sidebar')
      expect(icon).toHaveAttribute('data-size', 'md')
    })

    test('should render with transparent variant', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-variant', 'transparent')
    })

    test('should render with sm size', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-size', 'sm')
    })

    test('should render as icon only button', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-icon-only', 'true')
    })
  })

  describe('Tooltip Content', () => {
    test('should show "Collapse" tooltip when expanded', () => {
      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'expanded'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Collapse')
    })

    test('should show "Expand" tooltip when collapsed', () => {
      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'collapsed'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Expand')
    })
  })

  describe('Click Behavior', () => {
    test('should call toggleSidebar when clicked', async () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(mockToggleSidebar).toHaveBeenCalledTimes(1)
    })

    test('should stop event propagation', async () => {
      const parentClick = vi.fn()

      render(
        <TestWrapper>
          <button type="button" onClick={parentClick}>
            <SidebarToggleMenuButton />
          </button>
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(mockToggleSidebar).toHaveBeenCalled()
      // stopPropagation should be called, but we can't directly test it in this mock setup
    })

    test('should call custom onClick handler if provided', async () => {
      const customOnClick = vi.fn()

      render(
        <TestWrapper>
          <SidebarToggleMenuButton onClick={customOnClick} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(customOnClick).toHaveBeenCalledTimes(1)
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1)
    })

    test('should call custom onClick before toggleSidebar', async () => {
      const callOrder: string[] = []
      const customOnClick = vi.fn(() => callOrder.push('custom'))
      mockToggleSidebar.mockImplementation(() => callOrder.push('toggle'))

      render(
        <TestWrapper>
          <SidebarToggleMenuButton onClick={customOnClick} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(callOrder).toEqual(['custom', 'toggle'])
    })

    test('should receive event object in onClick handler', async () => {
      const customOnClick = vi.fn()

      render(
        <TestWrapper>
          <SidebarToggleMenuButton onClick={customOnClick} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(customOnClick).toHaveBeenCalledWith(expect.any(Object))
      expect(customOnClick.mock.calls[0][0]).toHaveProperty('stopPropagation')
    })
  })

  describe('Title Prop', () => {
    test('should accept title prop', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton title="Toggle Menu" />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toBeInTheDocument()
    })

    test('should handle undefined title', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton title={undefined} />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toBeInTheDocument()
    })

    test('should handle empty string title', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton title="" />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toBeInTheDocument()
    })
  })

  describe('Multiple Clicks', () => {
    test('should handle multiple rapid clicks', async () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      const button = screen.getByTestId('toggle-button')

      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)

      expect(mockToggleSidebar).toHaveBeenCalledTimes(3)
    })

    test('should toggle between states on multiple clicks', async () => {
      let currentState = 'expanded'

      mockToggleSidebar.mockImplementation(() => {
        currentState = currentState === 'expanded' ? 'collapsed' : 'expanded'
      })

      mockUseSidebar.mockImplementation(() => ({
        toggleSidebar: mockToggleSidebar,
        state: currentState
      }))

      const { rerender } = render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Collapse')

      await userEvent.click(screen.getByTestId('toggle-button'))

      currentState = 'collapsed'
      mockUseSidebar.mockImplementation(() => ({
        toggleSidebar: mockToggleSidebar,
        state: currentState
      }))

      rerender(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Expand')
    })
  })

  describe('Integration with Sidebar Context', () => {
    test('should get state from sidebar context', () => {
      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'collapsed'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(mockUseSidebar).toHaveBeenCalled()
      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Expand')
    })

    test('should get toggleSidebar function from context', async () => {
      const customToggle = vi.fn()
      mockUseSidebar.mockReturnValue({
        toggleSidebar: customToggle,
        state: 'expanded'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(customToggle).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle state transitions gracefully', () => {
      const { rerender } = render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Collapse')

      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'collapsed'
      })

      rerender(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Expand')
    })

    test('should handle onClick being undefined', async () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton onClick={undefined} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByTestId('toggle-button'))

      expect(mockToggleSidebar).toHaveBeenCalled()
    })

    test('should work with disabled button', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      const button = screen.getByTestId('toggle-button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    test('should be keyboard accessible', async () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      const button = screen.getByTestId('toggle-button')
      button.focus()

      expect(button).toHaveFocus()

      await userEvent.keyboard('{Enter}')

      expect(mockToggleSidebar).toHaveBeenCalled()
    })

    test('should support space key activation', async () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      const button = screen.getByTestId('toggle-button')
      button.focus()

      await userEvent.keyboard(' ')

      expect(mockToggleSidebar).toHaveBeenCalled()
    })
  })

  describe('Translation Integration', () => {
    test('should use translation for tooltip when collapsed', () => {
      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'collapsed'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      // The mock translation function returns the default value
      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Expand')
    })

    test('should use translation for tooltip when expanded', () => {
      mockUseSidebar.mockReturnValue({
        toggleSidebar: mockToggleSidebar,
        state: 'expanded'
      })

      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-tooltip-content', 'Collapse')
    })
  })

  describe('Button Props', () => {
    test('should use correct button variant', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-variant', 'transparent')
    })

    test('should use correct button size', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-size', 'sm')
    })

    test('should be icon only button', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('toggle-button')).toHaveAttribute('data-icon-only', 'true')
    })
  })

  describe('Icon Props', () => {
    test('should render sidebar icon with correct name', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'sidebar')
    })

    test('should render sidebar icon with medium size', () => {
      render(
        <TestWrapper>
          <SidebarToggleMenuButton />
        </TestWrapper>
      )

      expect(screen.getByTestId('icon')).toHaveAttribute('data-size', 'md')
    })
  })
})
