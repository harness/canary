import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Dropdown, Left, Right, Root } from '../list-actions'

describe('ListActions', () => {
  describe('Root Component', () => {
    test('should render root container', () => {
      const { container } = render(<Root>Content</Root>)

      expect(screen.getByText('Content')).toBeInTheDocument()
      const root = container.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<Root className="custom-root">Content</Root>)

      const root = container.querySelector('.custom-root')
      expect(root).toBeInTheDocument()
    })

    test('should render children', () => {
      render(
        <Root>
          <div>Child 1</div>
          <div>Child 2</div>
        </Root>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })
  })

  describe('Left Component', () => {
    test('should render left section', () => {
      const { container } = render(<Left>Left Content</Left>)

      expect(screen.getByText('Left Content')).toBeInTheDocument()
      const left = container.querySelector('.flex.grow.items-center')
      expect(left).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<Left className="custom-left">Content</Left>)

      const left = container.querySelector('.custom-left')
      expect(left).toBeInTheDocument()
    })

    test('should render children', () => {
      render(
        <Left>
          <button>Action 1</button>
          <button>Action 2</button>
        </Left>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })
  })

  describe('Right Component', () => {
    test('should render right section', () => {
      const { container } = render(<Right>Right Content</Right>)

      expect(screen.getByText('Right Content')).toBeInTheDocument()
      const right = container.querySelector('.flex.items-center')
      expect(right).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<Right className="custom-right">Content</Right>)

      const right = container.querySelector('.custom-right')
      expect(right).toBeInTheDocument()
    })

    test('should render children', () => {
      render(
        <Right>
          <button>Save</button>
          <button>Cancel</button>
        </Right>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('Dropdown Component', () => {
    test('should render dropdown trigger', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Select" items={items} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should configure dropdown with items', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Actions" items={items} />)

      const button = screen.getByRole('button', { name: /actions/i })
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })

    test('should accept onChange callback', () => {
      const handleChange = vi.fn()
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Select" items={items} onChange={handleChange} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should accept selectedValue prop', () => {
      const items = [
        { name: 'Option 1', value: '1' },
        { name: 'Option 2', value: '2' }
      ]

      render(<Dropdown title="Select" items={items} selectedValue="1" />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should handle items without value property', () => {
      const items = [{ name: 'Option Only Name' }]

      render(<Dropdown title="Select" items={items} />)

      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    test('should render with arrow icon', () => {
      const items = [{ name: 'Option 1' }]
      const { container } = render(<Dropdown title="Select" items={items} />)

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should handle empty items array', () => {
      render(<Dropdown title="Empty" items={[]} />)

      expect(screen.getByRole('button', { name: /empty/i })).toBeInTheDocument()
    })
  })

  describe('Complex Layout', () => {
    test('should render complete list actions layout', () => {
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

    test('should render with only Left section', () => {
      render(
        <Root>
          <Left>
            <button>Left Action</button>
          </Left>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Left Action' })).toBeInTheDocument()
    })

    test('should render with only Right section', () => {
      render(
        <Root>
          <Right>
            <button>Right Action</button>
          </Right>
        </Root>
      )

      expect(screen.getByRole('button', { name: 'Right Action' })).toBeInTheDocument()
    })

    test('should apply custom classNames to all sections', () => {
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
  })

  describe('Edge Cases', () => {
    test('should handle Root with no children', () => {
      const { container } = render(<Root>{null}</Root>)

      const root = container.querySelector('.flex.items-center.justify-between')
      expect(root).toBeInTheDocument()
    })

    test('should handle multiple Dropdowns', () => {
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
  })
})

