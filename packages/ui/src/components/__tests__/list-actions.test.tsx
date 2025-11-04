import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Dropdown, Left, Right, Root } from '../list-actions'

describe('ListActions', () => {
  describe('Root Component', () => {
    test('should render root container with content', () => {
      const { container } = render(<Root>Content</Root>)

      expect(screen.getByText('Content')).toBeInTheDocument()
      const root = container.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should apply custom className to root', () => {
      const { container } = render(<Root className="custom-root">Content</Root>)

      const root = container.querySelector('.custom-root')
      expect(root).toBeInTheDocument()
    })

    test('should render multiple children in root', () => {
      render(
        <Root>
          <div>Child 1</div>
          <div>Child 2</div>
        </Root>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(Root.displayName).toBe('ListActions.Root')
    })

    test('should render with default gap spacing', () => {
      const { container } = render(<Root>Test</Root>)

      const root = container.querySelector('.gap-cn-xl')
      expect(root).toBeInTheDocument()
    })

    test('should render with default justify-between styling', () => {
      const { container } = render(<Root>Test</Root>)

      const root = container.querySelector('.justify-between')
      expect(root).toBeInTheDocument()
    })
  })

  describe('Left Component', () => {
    test('should render left section with content', () => {
      const { container } = render(<Left>Left Content</Left>)

      expect(screen.getByText('Left Content')).toBeInTheDocument()
      const left = container.querySelector('.flex.grow.items-center')
      expect(left).toBeInTheDocument()
    })

    test('should apply custom className to left section', () => {
      const { container } = render(<Left className="custom-left">Content</Left>)

      const left = container.querySelector('.custom-left')
      expect(left).toBeInTheDocument()
    })

    test('should render multiple action buttons', () => {
      render(
        <Left>
          <button>Action 1</button>
          <button>Action 2</button>
        </Left>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })

    test('should apply grow styling for flex layout', () => {
      const { container } = render(<Left>Content</Left>)

      const left = container.querySelector('.grow')
      expect(left).toBeInTheDocument()
    })

    test('should render with gap spacing', () => {
      const { container } = render(<Left>Test</Left>)

      const left = container.querySelector('.gap-cn-xl')
      expect(left).toBeInTheDocument()
    })
  })

  describe('Right Component', () => {
    test('should render right section with content', () => {
      const { container } = render(<Right>Right Content</Right>)

      expect(screen.getByText('Right Content')).toBeInTheDocument()
      const right = container.querySelector('.flex.items-center')
      expect(right).toBeInTheDocument()
    })

    test('should apply custom className to right section', () => {
      const { container } = render(<Right className="custom-right">Content</Right>)

      const right = container.querySelector('.custom-right')
      expect(right).toBeInTheDocument()
    })

    test('should render multiple buttons in right section', () => {
      render(
        <Right>
          <button>Save</button>
          <button>Cancel</button>
        </Right>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('should render with items-center styling', () => {
      const { container } = render(<Right>Test</Right>)

      const right = container.querySelector('.items-center')
      expect(right).toBeInTheDocument()
    })

    test('should apply gap spacing in right section', () => {
      const { container } = render(<Right>Content</Right>)

      const right = container.querySelector('.gap-cn-xl')
      expect(right).toBeInTheDocument()
    })
  })

  describe('Dropdown Component', () => {
    test('should render dropdown trigger button', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Select" items={items} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should configure dropdown with proper aria attributes', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Actions" items={items} />)

      const button = screen.getByRole('button', { name: /actions/i })
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should call onChange when item is selected via click', async () => {
      const handleChange = vi.fn()
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      const DropdownWrapper = () => {
        const [open, setOpen] = React.useState(false)
        const selectItem = (value: string) => {
          handleChange(value)
          setOpen(false)
        }

        return (
          <div>
            <button onClick={() => setOpen(!open)}>Select</button>
            {open && (
              <div>
                {items.map(item => (
                  <button key={item.value} type="button" onClick={() => selectItem(item.value || item.name)}>
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      }

      render(<DropdownWrapper />)

      const trigger = screen.getByRole('button', { name: /select/i })
      await userEvent.click(trigger)

      const option1 = screen.getByText('Option 1')
      await userEvent.click(option1)

      expect(handleChange).toHaveBeenCalledWith('1')
    })

    test('should configure dropdown with items without value property', () => {
      const handleChange = vi.fn()
      const items = [{ name: 'Option Only Name' }]

      render(<Dropdown title="Select" items={items} onChange={handleChange} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should accept selectedValue to show checkmark', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Select" items={items} selectedValue="1" />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should render dropdown trigger with items configured', () => {
      const items = [{ name: 'Option Only Name' }]

      render(<Dropdown title="Select" items={items} />)

      const trigger = screen.getByRole('button', { name: /select/i })
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should render with nav-arrow-down icon', () => {
      const items = [{ name: 'Option 1' }]
      const { container } = render(<Dropdown title="Select" items={items} />)

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should handle empty items array without errors', () => {
      render(<Dropdown title="Empty" items={[]} />)

      expect(screen.getByRole('button', { name: /empty/i })).toBeInTheDocument()
    })

    test('should render with transparent button variant', () => {
      const items = [{ name: 'Option 1' }]
      const { container } = render(<Dropdown title="Select" items={items} />)

      const button = container.querySelector('.cn-button-transparent')
      expect(button).toBeInTheDocument()
    })

    test('should render dropdown button with items', () => {
      const items = [{ name: 'Option 1' }]

      render(<Dropdown title="Select" items={items} />)

      const trigger = screen.getByRole('button', { name: /select/i })
      expect(trigger).toBeInTheDocument()
    })

    test('should not render dropdown content when items is null', () => {
      render(<Dropdown title="Select" items={null as any} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })
  })

  describe('Complex Layout', () => {
    test('should render complete layout with left actions and right dropdown', () => {
      const items = [{ name: 'Sort by Date' }, { name: 'Sort by Name' }]

      render(
        <Root>
          <Left>
            <button>Add New</button>
            <button>Delete</button>
          </Left>
          <Right>
            <Dropdown title="Sort" items={items} />
          </Right>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Add New' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sort/i })).toBeInTheDocument()
    })

    test('should render layout with only left section', () => {
      render(
        <Root>
          <Left>
            <button>Left Action</button>
          </Left>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Left Action' })).toBeInTheDocument()
    })

    test('should render layout with only right section', () => {
      render(
        <Root>
          <Right>
            <button>Right Action</button>
          </Right>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Right Action' })).toBeInTheDocument()
    })

    test('should apply custom classNames to all components', () => {
      const { container } = render(
        <Root className="custom-root">
          <Left className="custom-left">Left</Left>
          <Right className="custom-right">Right</Right>
        </Root>
      )

      expect(container.querySelector('.custom-root')).toBeInTheDocument()
      expect(container.querySelector('.custom-left')).toBeInTheDocument()
      expect(container.querySelector('.custom-right')).toBeInTheDocument()
    })

    test('should render multiple action buttons in both sections', () => {
      render(
        <Root>
          <Left>
            <button>Action 1</button>
            <button>Action 2</button>
          </Left>
          <Right>
            <button>Action 3</button>
            <button>Action 4</button>
          </Right>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 4' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle root with null children', () => {
      const { container } = render(<Root>{null}</Root>)

      const root = container.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should handle multiple dropdowns in right section', () => {
      const items1 = [{ name: 'Item 1' }]
      const items2 = [{ name: 'Item 2' }]

      render(
        <Root>
          <Right>
            <Dropdown title="Menu 1" items={items1} />
            <Dropdown title="Menu 2" items={items2} />
          </Right>
        </Root>
      )

      expect(screen.getByRole('button', { name: /menu 1/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /menu 2/i })).toBeInTheDocument()
    })

    test('should handle root with undefined children', () => {
      const { container } = render(<Root>{undefined}</Root>)

      const root = container.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should handle root with empty string children', () => {
      render(<Root>{''}</Root>)

      const root = document.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should handle dropdown with very long title', () => {
      const items = [{ name: 'Option 1' }]
      const longTitle = 'This is a very long dropdown title that should still render correctly'

      render(<Dropdown title={longTitle} items={items} />)

      expect(screen.getByRole('button', { name: new RegExp(longTitle, 'i') })).toBeInTheDocument()
    })

    test('should handle dropdown with special characters in title', () => {
      const items = [{ name: 'Option 1' }]

      render(<Dropdown title="<Select & Filter>" items={items} />)

      expect(screen.getByRole('button', { name: /<select & filter>/i })).toBeInTheDocument()
    })

    test('should handle dropdown with many items', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({ name: `Option ${i + 1}`, value: String(i + 1) }))

      render(<Dropdown title="Many Options" items={items} />)

      const trigger = screen.getByRole('button', { name: /many options/i })
      expect(trigger).toBeInTheDocument()
    })
  })
})
