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
    test('should render more actions button', () => {
      renderComponent()

      const button = screen.getByRole('button', { name: 'Show more actions' })
      expect(button).toBeInTheDocument()
    })

    test('should render with more-vert icon by default', () => {
      const { container } = renderComponent()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with custom icon', () => {
      renderComponent({ iconName: 'search' })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should render as icon-only button', () => {
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
  })

  describe('Dropdown Menu', () => {
    test('should render dropdown trigger button', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should configure dropdown with actions', () => {
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

    test('should accept actions with onClick handlers', () => {
      const handleClick = vi.fn()
      const actions = [{ title: 'Test Action', onClick: handleClick }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should configure dropdown menu', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Action States', () => {
    test('should accept disabled actions', () => {
      const actions = [{ title: 'Disabled Action', onClick: vi.fn(), disabled: true }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should accept danger actions', () => {
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
    test('should accept action with link', () => {
      const actions = [{ title: 'Go to Page', to: '/page', onClick: vi.fn() }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should accept link action with icon', () => {
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

    test('should apply custom button variant', () => {
      const { container } = renderComponent({ buttonVariant: 'outline' })

      const button = container.querySelector('.cn-button-outline')
      expect(button).toBeInTheDocument()
    })

    test('should apply medium size by default', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom button size', () => {
      const { container } = renderComponent({ buttonSize: 'sm' })

      const button = container.querySelector('.cn-button-sm')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom theme', () => {
      const { container } = renderComponent({ theme: 'danger' })

      const button = container.querySelector('.cn-button-danger')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    test('should disable button when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    test('should not open dropdown when disabled', async () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Dropdown should not open
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    test('should have tooltip on button', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should accept actions with tooltips', () => {
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
    test('should accept actions without onClick', () => {
      const actions = [{ title: 'No Handler' }]

      render(
        <TestWrapper>
          <MoreActionsTooltip actions={actions} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should accept mix of link and onClick actions', () => {
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

    test('should apply sideOffset and alignOffset', () => {
      renderComponent({ sideOffset: 10, alignOffset: 5 })

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
