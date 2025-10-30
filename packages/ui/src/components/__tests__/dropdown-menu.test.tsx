import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { DropdownMenu } from '../dropdown-menu'

const renderComponent = (props: Partial<React.ComponentProps<typeof DropdownMenu.Root>> = {}): RenderResult => {
  return render(
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild>
        <button>Open Menu</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={vi.fn()}>Item 1</DropdownMenu.Item>
        <DropdownMenu.Item onClick={vi.fn()}>Item 2</DropdownMenu.Item>
        <DropdownMenu.Item onClick={vi.fn()}>Item 3</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

describe('DropdownMenu', () => {
  describe('DropdownMenu.Root', () => {
    test('should render trigger button', () => {
      renderComponent()

      const trigger = screen.getByRole('button', { name: 'Open Menu' })
      expect(trigger).toBeInTheDocument()
    })

    test('should not show menu initially when closed', () => {
      renderComponent({ open: false })

      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).toBe(0)
    })

    test('should show menu when open is true', () => {
      renderComponent({ open: true })

      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    test('should handle defaultOpen prop', () => {
      renderComponent({ defaultOpen: true })

      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    test('should accept onOpenChange handler', () => {
      const handleOpenChange = vi.fn()

      render(
        <DropdownMenu.Root onOpenChange={handleOpenChange} open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      // Menu is rendered
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })
  })

  describe('DropdownMenu.Content', () => {
    test('should render content when open', () => {
      renderComponent({ open: true })

      // Content renders menu items
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    test('should render menu items', () => {
      renderComponent({ open: true })

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(3)
    })

    test('should accept custom className prop', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="custom-dropdown">
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      // Content renders successfully
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(1)
    })
  })

  describe('DropdownMenu.Item', () => {
    test('should render item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(1)
    })

    test('should call onClick when item is clicked', async () => {
      const handleClick = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={handleClick}>Click Me</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitem')
      await userEvent.click(item)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should render disabled item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item disabled>Disabled Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitem')
      expect(item).toHaveAttribute('data-disabled')
    })

    test('should mark disabled item with data-disabled attribute', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitem')
      expect(item).toHaveAttribute('data-disabled')
    })
  })

  describe('DropdownMenu.Separator', () => {
    test('should render menu with items around separator', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const items = screen.getAllByRole('menuitem')
      expect(items.length).toBe(2)
    })
  })

  describe('DropdownMenu.Group', () => {
    test('should render grouped items', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Group Item 1</DropdownMenu.Item>
              <DropdownMenu.Item>Group Item 2</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(2)
    })
  })

  describe('DropdownMenu.CheckboxItem', () => {
    test('should render checkbox item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem>Checkbox Option</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const items = screen.getAllByRole('menuitemcheckbox')
      expect(items.length).toBe(1)
    })

    test('should handle checked state', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem checked={true}>Checked Item</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemcheckbox')
      expect(item).toHaveAttribute('data-state', 'checked')
    })

    test('should call onCheckedChange when toggled', async () => {
      const handleChange = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem onCheckedChange={handleChange}>Toggle Me</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemcheckbox')
      await userEvent.click(item)

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.RadioGroup & RadioItem', () => {
    test('should render radio group', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="option1">
              <DropdownMenu.RadioItem value="option1" label="Option 1" />
              <DropdownMenu.RadioItem value="option2" label="Option 2" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const radioItems = screen.getAllByRole('menuitemradio')
      expect(radioItems.length).toBe(2)
    })

    test('should render multiple radio items', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="opt1" label="Option 1" />
              <DropdownMenu.RadioItem value="opt2" label="Option 2" />
              <DropdownMenu.RadioItem value="opt3" label="Option 3" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const radioItems = screen.getAllByRole('menuitemradio')
      expect(radioItems.length).toBe(3)
    })

    test('should show checked state on selected radio item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="option2">
              <DropdownMenu.RadioItem value="option1" label="Option 1" />
              <DropdownMenu.RadioItem value="option2" label="Option 2" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const radioItems = screen.getAllByRole('menuitemradio')
      expect(radioItems[1]).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Complex Scenarios', () => {
    test('should render menu with mixed item types', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Regular Item</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem>Checkbox Item</DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="r1" label="Radio 1" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const regularItems = screen.getAllByRole('menuitem')
      const checkboxItems = screen.getAllByRole('menuitemcheckbox')
      const radioItems = screen.getAllByRole('menuitemradio')
      
      expect(regularItems.length).toBeGreaterThan(0)
      expect(checkboxItems.length).toBe(1)
      expect(radioItems.length).toBe(1)
    })

    test('should render multiple groups', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
              <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>Item 3</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(3)
    })

    test('should render items with separators between them', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Item 3</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const items = screen.getAllByRole('menuitem')
      expect(items.length).toBe(3)
    })
  })

  describe('State Management', () => {
    test('should handle controlled state', () => {
      const { rerender } = render(
        <DropdownMenu.Root open={false}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      let menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).toBe(0)

      rerender(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(1)
    })
  })

  describe('DropdownMenu Primitives', () => {
    test('should render Root component', () => {
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button>Trigger</button>
          </DropdownMenu.Trigger>
        </DropdownMenu.Root>
      )

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
    })

    test('should render Trigger component', () => {
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button data-testid="custom-trigger">Custom Trigger</button>
          </DropdownMenu.Trigger>
        </DropdownMenu.Root>
      )

      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    })

    test('should render multiple items in content', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            <DropdownMenu.Item>Item 3</DropdownMenu.Item>
            <DropdownMenu.Item>Item 4</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const items = screen.getAllByRole('menuitem')
      expect(items.length).toBe(4)
    })
  })
})
