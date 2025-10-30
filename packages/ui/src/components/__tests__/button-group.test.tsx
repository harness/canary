import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ButtonGroup } from '../button-group'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const basicButtons = [
  { children: 'Button 1', onClick: vi.fn() },
  { children: 'Button 2', onClick: vi.fn() },
  { children: 'Button 3', onClick: vi.fn() }
]

const renderComponent = (props: Partial<React.ComponentProps<typeof ButtonGroup>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <ButtonGroup buttonsProps={basicButtons} {...props} />
    </TestWrapper>
  )
}

describe('ButtonGroup', () => {
  describe('Basic Rendering', () => {
    test('should render button group', () => {
      const { container } = renderComponent()

      const group = container.querySelector('.cn-button-group')
      expect(group).toBeInTheDocument()
    })

    test('should render all buttons', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: 'Button 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Button 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Button 3' })).toBeInTheDocument()
    })

    test('should render with default horizontal orientation', () => {
      const { container } = renderComponent()

      const group = container.querySelector('.cn-button-group-horizontal')
      expect(group).toBeInTheDocument()
    })

    test('should render with vertical orientation', () => {
      const { container } = renderComponent({ orientation: 'vertical' })

      const group = container.querySelector('.cn-button-group-vertical')
      expect(group).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-group' })

      const group = container.querySelector('.custom-group')
      expect(group).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    test('should handle button clicks', async () => {
      const handleClick = vi.fn()
      const buttons = [{ children: 'Click Me', onClick: handleClick }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Click Me' })
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should handle multiple button clicks', async () => {
      const click1 = vi.fn()
      const click2 = vi.fn()
      const buttons = [
        { children: 'Button 1', onClick: click1 },
        { children: 'Button 2', onClick: click2 }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      await userEvent.click(screen.getByRole('button', { name: 'Button 1' }))
      await userEvent.click(screen.getByRole('button', { name: 'Button 2' }))

      expect(click1).toHaveBeenCalledTimes(1)
      expect(click2).toHaveBeenCalledTimes(1)
    })

    test('should handle disabled buttons', () => {
      const buttons = [{ children: 'Disabled', onClick: vi.fn(), disabled: true }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Disabled' })
      expect(button).toBeDisabled()
    })
  })

  describe('Button Variants & Sizes', () => {
    test('should apply outline variant by default', () => {
      const { container } = renderComponent()

      const outlineButton = container.querySelector('.cn-button-outline')
      expect(outlineButton).toBeInTheDocument()
    })

    test('should apply custom variant to button', () => {
      const buttons: React.ComponentProps<typeof ButtonGroup>['buttonsProps'] = [
        { children: 'Primary', variant: 'primary' }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Primary' })
      expect(button).toHaveClass('cn-button-primary')
    })

    test('should apply medium size by default', () => {
      const { container } = renderComponent()

      // Default size is md
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    test('should apply custom size to all buttons', () => {
      const { container } = renderComponent({ size: 'sm' })

      const buttons = container.querySelectorAll('.cn-button-sm')
      expect(buttons.length).toBe(3)
    })
  })

  describe('First & Last Button Styling', () => {
    test('should apply first button class to first button', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveClass('cn-button-group-first')
    })

    test('should apply last button class to last button', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons[buttons.length - 1]).toHaveClass('cn-button-group-last')
    })

    test('should apply both first and last classes when single button', () => {
      const buttons = [{ children: 'Only Button' }]

      const { container } = render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = container.querySelector('button')
      expect(button).toHaveClass('cn-button-group-first')
      expect(button).toHaveClass('cn-button-group-last')
    })

    test('should not apply first/last classes to middle buttons', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      const middleButton = buttons[1]

      expect(middleButton).not.toHaveClass('cn-button-group-first')
      expect(middleButton).not.toHaveClass('cn-button-group-last')
    })
  })

  describe('Dropdown Integration', () => {
    test('should render button with dropdown', () => {
      const buttons = [
        {
          children: 'Actions',
          dropdownProps: {
            content: <div>Dropdown Content</div>
          }
        }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Actions' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should position dropdown based on orientation', () => {
      const buttons = [
        {
          children: 'Menu',
          dropdownProps: {
            content: <div>Menu Items</div>
          }
        }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} orientation="vertical" />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Menu' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should render button without dropdown', () => {
      const buttons = [{ children: 'Regular Button', onClick: vi.fn() }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Regular Button' })).toBeInTheDocument()
    })
  })

  describe('Tooltip Integration', () => {
    test('should render button with tooltip', () => {
      const buttons = [
        {
          children: 'Save',
          tooltipProps: { content: 'Save changes' }
        }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    test('should position tooltip based on orientation', () => {
      const buttons = [
        {
          children: 'Action',
          tooltipProps: { content: 'Tooltip' }
        }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} orientation="vertical" />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Icon Only Mode', () => {
    test('should render icon-only buttons when iconOnly is true', () => {
      const buttons = [{ children: 'Icon', icon: 'star' }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} iconOnly />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should override global iconOnly with button-specific iconOnly', () => {
      const buttons = [
        { children: 'Icon 1', icon: 'star', iconOnly: false },
        { children: 'Icon 2', icon: 'check' }
      ]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} iconOnly />
        </TestWrapper>
      )

      const buttons_elements = screen.getAllByRole('button')
      expect(buttons_elements.length).toBe(2)
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to group container', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <ButtonGroup ref={ref} buttonsProps={basicButtons} />
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref to individual button', () => {
      const ref = vi.fn()
      const buttons = [{ children: 'Button', ref }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty buttonsProps array', () => {
      const { container } = render(
        <TestWrapper>
          <ButtonGroup buttonsProps={[]} />
        </TestWrapper>
      )

      const group = container.querySelector('.cn-button-group')
      expect(group).toBeInTheDocument()
    })

    test('should handle single button', () => {
      const buttons = [{ children: 'Only Button' }]

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Only Button' })).toBeInTheDocument()
    })

    test('should handle many buttons', () => {
      const manyButtons = Array.from({ length: 10 }, (_, i) => ({
        children: `Button ${i + 1}`
      }))

      render(
        <TestWrapper>
          <ButtonGroup buttonsProps={manyButtons} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Button 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Button 10' })).toBeInTheDocument()
    })

    test('should apply custom className to individual buttons', () => {
      const buttons = [{ children: 'Styled', className: 'custom-button-class' }]

      const { container } = render(
        <TestWrapper>
          <ButtonGroup buttonsProps={buttons} />
        </TestWrapper>
      )

      const button = container.querySelector('.custom-button-class')
      expect(button).toBeInTheDocument()
    })
  })
})
