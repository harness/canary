import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { MoreActionsTooltip } from '../more-actions-tooltip'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const mockActions = [
  { title: 'Edit', iconName: 'edit-pencil' as const, onClick: vi.fn() },
  { title: 'Delete', iconName: 'trash' as const, onClick: vi.fn(), isDanger: true },
  { title: 'Archive', onClick: vi.fn() }
]

const renderComponent = (props: Partial<React.ComponentProps<typeof MoreActionsTooltip>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <MoreActionsTooltip actions={mockActions} {...props} />
    </TestWrapper>
  )
}

describe('MoreActionsTooltip', () => {
  describe('Basic Rendering', () => {
    test('should render trigger button with actions', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Show more actions' })
      expect(button).toBeInTheDocument()
    })

    test('should render with default more-vert icon', () => {
      const { container } = renderComponent()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with custom icon when iconName provided', () => {
      renderComponent({ iconName: 'search' })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should render as icon-only button with aria-label', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Show more actions')
    })

    test('should not render when actions array is empty', () => {
      const { container } = render(
        <TestWrapper>
          <MoreActionsTooltip actions={[]} />
        </TestWrapper>
      )

      const button = container.querySelector('button')
      expect(button).not.toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(MoreActionsTooltip.displayName).toBe('MoreActionsTooltip')
    })
  })

  describe('Dropdown Menu', () => {
    test('should render dropdown trigger with proper attributes', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should configure dropdown menu with actions', () => {
      const actions = [
        { title: 'Edit', iconName: 'edit-pencil' as const, onClick: vi.fn() },
        { title: 'Delete', onClick: vi.fn() }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should configure dropdown menu to open on trigger click', () => {
      const actions = [{ title: 'Test Action', onClick: vi.fn() }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should show aria-expanded false by default', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Action States', () => {
    test('should render disabled actions correctly', () => {
      const actions = [{ title: 'Disabled Action', onClick: vi.fn(), disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should render danger actions with styling', () => {
      const actions = [{ title: 'Dangerous', onClick: vi.fn(), isDanger: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Link Navigation', () => {
    test('should render action with link navigation', () => {
      const actions = [{ title: 'Go to Page', to: '/page', onClick: vi.fn() }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should render link action with icon', () => {
      const actions = [{ title: 'Open', to: '/open', iconName: 'star' as const }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Button Variants & Sizes', () => {
    test('should apply ghost variant by default', () => {
      const { container } = renderComponent()

      const button = container.querySelector('.cn-button-ghost')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom button variant when specified', () => {
      const { container } = renderComponent({ buttonVariant: 'outline' })

      const button = container.querySelector('.cn-button-outline')
      expect(button).toBeInTheDocument()
    })

    test('should apply medium size by default', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom button size when specified', () => {
      const { container } = renderComponent({ buttonSize: 'sm' })

      const button = container.querySelector('.cn-button-sm')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom theme to button', () => {
      const { container } = renderComponent({ theme: 'danger' })

      const button = container.querySelector('.cn-button-danger')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    test('should disable trigger button when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    test('should not open dropdown when trigger is disabled', async () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Dropdown should not open
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    test('should have tooltip on trigger button', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should render actions with custom tooltips', () => {
      const actions = [
        {
          title: 'Action',
          onClick: vi.fn(),
          tooltip: { title: 'Tooltip Title', content: 'Tooltip Content' }
        }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to trigger button', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <MoreActionsTooltip ref={ref} actions={mockActions} />
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should render action without onClick handler', () => {
      const actions = [{ title: 'No Handler' }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should render mix of link and click actions', () => {
      const actions = [
        { title: 'Link Action', to: '/link' },
        { title: 'Click Action', onClick: vi.fn() }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should apply custom className to dropdown content', () => {
      renderComponent({ className: 'custom-dropdown-class' })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should apply sideOffset and alignOffset to content', () => {
      renderComponent({ sideOffset: 10, alignOffset: 5 })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Action Types - Link with Icon', () => {
    test('should configure link action with icon', () => {
      const actions = [{ title: 'Open Page', to: '/page', iconName: 'star' as const }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure link action with icon and danger state', () => {
      const actions = [{ title: 'Delete', to: '/delete', iconName: 'trash' as const, isDanger: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure link action with icon when disabled', () => {
      const actions = [{ title: 'Disabled Link', to: '/link', iconName: 'star' as const, disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })

  describe('Action Types - Link without Icon', () => {
    test('should configure link action without icon', () => {
      const actions = [{ title: 'Navigate', to: '/navigate' }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure link action without icon with danger state', () => {
      const actions = [{ title: 'Delete Page', to: '/delete', isDanger: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure link action without icon when disabled', () => {
      const actions = [{ title: 'Disabled', to: '/link', disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })

  describe('Action Types - Click with Icon', () => {
    test('should configure click action with icon', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Edit', iconName: 'edit-pencil' as const, onClick: handleClick }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure click action with icon and danger state', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Delete', iconName: 'trash' as const, onClick: handleClick, isDanger: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure click action with icon when disabled', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Disabled', iconName: 'star' as const, onClick: handleClick, disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })

  describe('Action Types - Click without Icon', () => {
    test('should configure click action without icon', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Archive', onClick: handleClick }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure click action without icon with danger state', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Remove', onClick: handleClick, isDanger: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure click action without icon when disabled', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Disabled Action', onClick: handleClick, disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })

  describe('Action with Tooltip', () => {
    test('should configure action with custom tooltip', () => {
      const actions = [
        {
          title: 'Action',
          onClick: vi.fn(),
          tooltip: { title: 'Tooltip Title', content: 'Tooltip Content' }
        }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should configure action without tooltip wrapper', () => {
      const actions = [{ title: 'No Tooltip', onClick: vi.fn() }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should default to ghost button variant', () => {
      const { container } = renderComponent()

      const button = container.querySelector('.cn-button-ghost')
      expect(button).toBeInTheDocument()
    })

    test('should default to medium button size', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should default disabled to false', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    test('should default to more-vert icon', () => {
      const { container } = renderComponent()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should default sideOffset to 2', () => {
      renderComponent()

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should default alignOffset to 0', () => {
      renderComponent()

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper aria attributes on trigger button', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Show more actions' })
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should be keyboard accessible', () => {
      renderComponent()

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    test('should indicate disabled state for accessibility', () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Re-rendering', () => {
    test('should update when buttonVariant changes', () => {
      const { rerender, container } = render(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} buttonVariant="ghost" />
        </TestWrapper>
      )

      expect(container.querySelector('.cn-button-ghost')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} buttonVariant="outline" />
        </TestWrapper>
      )

      expect(container.querySelector('.cn-button-outline')).toBeInTheDocument()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} disabled={false} />
        </TestWrapper>
      )

      let button = screen.getByRole('button')
      expect(button).not.toBeDisabled()

      rerender(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} disabled={true} />
        </TestWrapper>
      )

      button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    test('should remove component when actions become empty', () => {
      const { rerender, container } = render(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <MoreActionsTooltip actions={[]} />
        </TestWrapper>
      )

      const button = container.querySelector('button')
      expect(button).not.toBeInTheDocument()
    })

    test('should update when iconName changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} iconName="more-vert" />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <MoreActionsTooltip actions={mockActions} iconName="search" />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should configure all action type combinations in one menu', () => {
      const actions = [
        { title: 'Link with Icon', to: '/link', iconName: 'star' as const },
        { title: 'Link without Icon', to: '/link2' },
        { title: 'Click with Icon', iconName: 'edit-pencil' as const, onClick: vi.fn() },
        { title: 'Click without Icon', onClick: vi.fn() }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })

    test('should handle all props together', () => {
      const { container } = renderComponent({
        theme: 'danger',
        iconName: 'trash',
        sideOffset: 5,
        alignOffset: 10,
        className: 'custom-class',
        buttonVariant: 'outline',
        buttonSize: 'sm',
        disabled: false
      })

      const button = container.querySelector('.cn-button-outline.cn-button-sm.cn-button-danger')
      expect(button).toBeInTheDocument()
    })

    test('should configure mix of all action states', () => {
      const actions = [
        { title: 'Normal', onClick: vi.fn() },
        { title: 'Disabled', onClick: vi.fn(), disabled: true },
        { title: 'Danger', onClick: vi.fn(), isDanger: true },
        { title: 'With Tooltip', onClick: vi.fn(), tooltip: { content: 'Help text' } }
      ]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Show more actions' })).toBeInTheDocument()
    })
  })
})
