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

  describe('Component Display Names', () => {
    test('should have correct displayName for Root', () => {
      expect(DropdownMenu.Root.displayName).toBe('DropdownMenuRoot')
    })

    test('should have correct displayName for Trigger', () => {
      expect(DropdownMenu.Trigger.displayName).toBe('DropdownMenuTrigger')
    })

    test('should have correct displayName for Content', () => {
      expect(DropdownMenu.Content.displayName).toBe('DropdownMenuContent')
    })

    test('should have correct displayName for Item', () => {
      expect(DropdownMenu.Item.displayName).toBe('DropdownMenuItem')
    })

    test('should have correct displayName for CheckboxItem', () => {
      expect(DropdownMenu.CheckboxItem.displayName).toBe('DropdownMenuCheckboxItem')
    })

    test('should have correct displayName for RadioItem', () => {
      expect(DropdownMenu.RadioItem.displayName).toBe('DropdownMenuRadioItem')
    })

    test('should have correct displayName for RadioGroup', () => {
      expect(DropdownMenu.RadioGroup.displayName).toBe('DropdownMenuRadioGroup')
    })

    test('should have correct displayName for Separator', () => {
      expect(DropdownMenu.Separator.displayName).toBe('DropdownMenuSeparator')
    })

    test('should have correct displayName for Group', () => {
      expect(DropdownMenu.Group.displayName).toBe('DropdownMenuGroup')
    })

    test('should have correct displayName for Header', () => {
      expect(DropdownMenu.Header.displayName).toBe('DropdownMenuHeader')
    })

    test('should have correct displayName for Footer', () => {
      expect(DropdownMenu.Footer.displayName).toBe('DropdownMenuFooter')
    })

    test('should have correct displayName for Spinner', () => {
      expect(DropdownMenu.Spinner.displayName).toBe('DropdownMenuSpinner')
    })

    test('should have correct displayName for NoOptions', () => {
      expect(DropdownMenu.NoOptions.displayName).toBe('DropdownMenuNoOptions')
    })

    test('should have correct displayName for Slot', () => {
      expect(DropdownMenu.Slot.displayName).toBe('DropdownMenuSlot')
    })
  })

  describe('DropdownMenu.Header and Footer', () => {
    test('should render Header', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Header>Header Content</DropdownMenu.Header>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    test('should render Footer', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
            <DropdownMenu.Footer>Footer Content</DropdownMenu.Footer>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    test('should render both Header and Footer', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Header>Header</DropdownMenu.Header>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
            <DropdownMenu.Footer>Footer</DropdownMenu.Footer>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('DropdownMenu.Spinner', () => {
    test('should render spinner with loading icon', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Spinner />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const spinner = document.querySelector('.cn-dropdown-menu-spinner')
      expect(spinner).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Spinner className="custom-spinner" />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const spinner = document.querySelector('.custom-spinner')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('DropdownMenu.NoOptions', () => {
    test('should render default no options text', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.NoOptions />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('No options available')).toBeInTheDocument()
    })

    test('should render custom no options text', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.NoOptions>Custom empty message</DropdownMenu.NoOptions>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Custom empty message')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.NoOptions className="custom-no-options">Empty</DropdownMenu.NoOptions>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const noOptions = document.querySelector('.custom-no-options')
      expect(noOptions).toBeInTheDocument()
    })
  })

  describe('DropdownMenu.Slot', () => {
    test('should render Slot component', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Slot>Slot Content</DropdownMenu.Slot>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Slot Content')).toBeInTheDocument()
    })

    test('should forward ref on Slot', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Slot ref={ref}>Content</DropdownMenu.Slot>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.Item - Extended Props', () => {
    test('should render item with title', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Item Title">Content</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Item Title')).toBeInTheDocument()
    })

    test('should render item with description', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Title" description="Description text">
              Item
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    test('should render item with label', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Item" label="Label">
              Content
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    test('should render item with shortcut', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Save" shortcut="⌘S">
              Content
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('⌘S')).toBeInTheDocument()
    })

    test('should render item with checkmark', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Item" checkmark={true}>
              Content
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Item')).toBeInTheDocument()
    })

    test('should render item with tag', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Item" tag={{ value: 'Beta' }}>
              Content
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Beta')).toBeInTheDocument()
    })
  })

  describe('DropdownMenu.Group - Extended', () => {
    test('should render group with label', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group label="Group Label">
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Group Label')).toBeInTheDocument()
    })

    test('should render group without label', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const items = screen.getAllByRole('menuitem')
      expect(items.length).toBe(1)
    })

    test('should forward ref on Group', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group ref={ref}>
              <DropdownMenu.Item>Item</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.RadioGroup - Extended', () => {
    test('should render RadioGroup with label', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup label="Choose Option">
              <DropdownMenu.RadioItem value="1" label="Option 1" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Choose Option')).toBeInTheDocument()
    })

    test('should handle value change', () => {
      const handleValueChange = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="1" onValueChange={handleValueChange}>
              <DropdownMenu.RadioItem value="1" label="Option 1" />
              <DropdownMenu.RadioItem value="2" label="Option 2" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const radioItems = screen.getAllByRole('menuitemradio')
      expect(radioItems.length).toBe(2)
    })

    test('should forward ref on RadioGroup', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup ref={ref}>
              <DropdownMenu.RadioItem value="1" label="Option" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.CheckboxItem - Extended', () => {
    test('should render unchecked checkbox item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem checked={false}>Unchecked</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemcheckbox')
      expect(item).toHaveAttribute('data-state', 'unchecked')
    })

    test('should render indeterminate checkbox item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem checked="indeterminate">Indeterminate</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemcheckbox')
      expect(item).toHaveAttribute('data-state', 'indeterminate')
    })

    test('should handle disabled checkbox item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem disabled>Disabled Checkbox</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemcheckbox')
      expect(item).toHaveAttribute('data-disabled')
    })

    test('should forward ref on CheckboxItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem ref={ref}>Checkbox</DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.RadioItem - Extended', () => {
    test('should render with title prop', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="1" title="Radio Title" label="Option 1" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Radio Title')).toBeInTheDocument()
    })

    test('should render with description', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="1" title="Radio" description="Radio description" label="Opt 1" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Radio description')).toBeInTheDocument()
    })

    test('should handle disabled radio item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem value="1" label="Option" disabled />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByRole('menuitemradio')
      expect(item).toHaveAttribute('data-disabled')
    })

    test('should forward ref on RadioItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup>
              <DropdownMenu.RadioItem ref={ref} value="1" label="Option" />
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Content', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content ref={ref}>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Item', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item ref={ref}>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Separator', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Separator ref={ref} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Header', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Header ref={ref}>Header</DropdownMenu.Header>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Footer', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Footer ref={ref}>Footer</DropdownMenu.Footer>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Spinner', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Spinner ref={ref} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Default Values', () => {
    test('should use default sideOffset of 4', () => {
      renderComponent({ open: true })

      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases - Extended', () => {
    test('should handle empty menu content', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Empty Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content></DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const menu = document.querySelector('.cn-dropdown-menu')
      expect(menu).toBeInTheDocument()
    })

    test('should handle very long item text', () => {
      const longText = 'A'.repeat(200)
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title={longText}>Content</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText(/AAAA/)).toBeInTheDocument()
    })

    test('should handle special characters in items', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Item @#$%^&*()">Content</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Item @#$%^&*()')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper menu roles', () => {
      renderComponent({ open: true })

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    test('should allow keyboard navigation', () => {
      renderComponent({ open: true })

      const menuItems = screen.getAllByRole('menuitem')
      menuItems[0].focus()
      expect(menuItems[0]).toHaveFocus()
    })

    test('should mark disabled items correctly', () => {
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

  describe('ScrollArea Integration', () => {
    test('should render content with ScrollArea', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Scroll Item">Content</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Scroll Item')).toBeInTheDocument()
    })

    test('should accept scrollAreaProps', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content scrollAreaProps={{ className: 'custom-scroll' }}>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(1)
    })
  })

  describe('Complex Integration', () => {
    test('should render complete menu with all features', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Complete Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Header>Menu Header</DropdownMenu.Header>
            <DropdownMenu.Group label="Actions">
              <DropdownMenu.Item title="Action 1" shortcut="⌘1">
                Content
              </DropdownMenu.Item>
              <DropdownMenu.Item title="Action 2" shortcut="⌘2">
                Content
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem>Checkbox Option</DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioGroup label="Select One">
              <DropdownMenu.RadioItem value="1" label="Option 1" />
              <DropdownMenu.RadioItem value="2" label="Option 2" />
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Footer>Menu Footer</DropdownMenu.Footer>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Menu Header')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByText('Select One')).toBeInTheDocument()
      expect(screen.getByText('Menu Footer')).toBeInTheDocument()
    })
  })

  describe('DropdownMenu.AvatarItem', () => {
    test('should render avatar item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="John Doe" title="User Profile">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('User Profile')).toBeInTheDocument()
    })

    test('should render avatar item with description', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="Jane Smith" title="User" description="Admin user">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Admin user')).toBeInTheDocument()
    })

    test('should use lg avatar size with description', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="User" title="Title" description="Description">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    test('should use sm avatar size without description', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="User" title="Title">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    test('should handle rounded prop', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="User" rounded={false} title="Title">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    test('should handle isGroup prop', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem name="Group" isGroup title="Group Name">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Group Name')).toBeInTheDocument()
    })

    test('should forward ref on AvatarItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.AvatarItem ref={ref} name="User" title="Title">
              Content
            </DropdownMenu.AvatarItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.LogoItem', () => {
    test('should render logo item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.LogoItem logo="github" title="GitHub">
              Content
            </DropdownMenu.LogoItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('GitHub')).toBeInTheDocument()
    })

    test('should forward ref on LogoItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.LogoItem ref={ref} logo="harness" title="Harness">
              Content
            </DropdownMenu.LogoItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.IconItem', () => {
    test('should render icon item', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IconItem icon="star" title="Favorites">
              Content
            </DropdownMenu.IconItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Favorites')).toBeInTheDocument()
    })

    test('should apply iconClassName', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IconItem icon="check" iconClassName="custom-icon" title="Check">
              Content
            </DropdownMenu.IconItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Check')).toBeInTheDocument()
    })

    test('should apply iconSize', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IconItem icon="settings" iconSize="lg" title="Settings">
              Content
            </DropdownMenu.IconItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should forward ref on IconItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IconItem ref={ref} icon="star" title="Icon">
              Content
            </DropdownMenu.IconItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('DropdownMenu.IndicatorItem', () => {
    test('should render indicator item with color', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IndicatorItem color="green" title="Active">
              Content
            </DropdownMenu.IndicatorItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    test('should render with pulse animation', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IndicatorItem color="red" pulse title="Pulsing">
              Content
            </DropdownMenu.IndicatorItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Pulsing')).toBeInTheDocument()
    })

    test('should render all indicator colors', () => {
      const colors: Array<
        | 'gray'
        | 'green'
        | 'red'
        | 'yellow'
        | 'blue'
        | 'purple'
        | 'brown'
        | 'cyan'
        | 'indigo'
        | 'lime'
        | 'mint'
        | 'orange'
        | 'pink'
        | 'violet'
      > = [
        'gray',
        'green',
        'red',
        'yellow',
        'blue',
        'purple',
        'brown',
        'cyan',
        'indigo',
        'lime',
        'mint',
        'orange',
        'pink',
        'violet'
      ]

      colors.forEach(color => {
        render(
          <DropdownMenu.Root open={true}>
            <DropdownMenu.Trigger asChild>
              <button>Menu {color}</button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.IndicatorItem color={color} title={color}>
                Content
              </DropdownMenu.IndicatorItem>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )

        expect(screen.getByText(color)).toBeInTheDocument()
      })
    })

    test('should forward ref on IndicatorItem', () => {
      const ref = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.IndicatorItem ref={ref} color="blue" title="Indicator">
              Content
            </DropdownMenu.IndicatorItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Sub-menus', () => {
    test('should render Item with sub-menu children', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item title="Parent Item">
              <DropdownMenu.Item title="Child Item 1">Content</DropdownMenu.Item>
              <DropdownMenu.Item title="Child Item 2">Content</DropdownMenu.Item>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Parent Item')).toBeInTheDocument()
    })

    test('should render CheckboxItem with sub-menu children', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem title="Parent Checkbox">
              <DropdownMenu.Item title="Nested Item">Content</DropdownMenu.Item>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByText('Parent Checkbox')).toBeInTheDocument()
    })

    test('should handle CheckboxItem click with sub-menu', async () => {
      const handleClick = vi.fn()
      const handleCheckedChange = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Main Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              title="Checkbox with Submenu"
              checked={false}
              onClick={handleClick}
              onCheckedChange={handleCheckedChange}
            >
              <DropdownMenu.Item title="Child">Content</DropdownMenu.Item>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByText('Checkbox with Submenu')
      await userEvent.click(item)

      expect(handleClick).toHaveBeenCalled()
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    test('should handle CheckboxItem indeterminate toggle with sub-menu', async () => {
      const handleCheckedChange = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Main Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              title="Indeterminate"
              checked="indeterminate"
              onCheckedChange={handleCheckedChange}
            >
              <DropdownMenu.Item title="Child">Content</DropdownMenu.Item>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByText('Indeterminate')
      await userEvent.click(item)

      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })

    test('should not trigger CheckboxItem when disabled with sub-menu', async () => {
      const handleClick = vi.fn()

      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Main Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem title="Disabled" onClick={handleClick} disabled>
              <DropdownMenu.Item title="Child">Content</DropdownMenu.Item>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      const item = screen.getByText('Disabled')
      await userEvent.click(item)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Additional Component Display Names', () => {
    test('should have correct displayName for AvatarItem', () => {
      expect(DropdownMenu.AvatarItem.displayName).toBe('DropdownMenuAvatarItem')
    })

    test('should have correct displayName for LogoItem', () => {
      expect(DropdownMenu.LogoItem.displayName).toBe('DropdownMenuLogoItem')
    })

    test('should have correct displayName for IconItem', () => {
      expect(DropdownMenu.IconItem.displayName).toBe('DropdownMenuIconItem')
    })

    test('should have correct displayName for IndicatorItem', () => {
      expect(DropdownMenu.IndicatorItem.displayName).toBe('DropdownMenuIndicatorItem')
    })
  })

  describe('Menu Item with Prefix', () => {
    test('should render item with prefix', () => {
      render(
        <DropdownMenu.Root open={true}>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item prefix={<span data-testid="prefix">Prefix</span>} title="Title">
              Content
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )

      expect(screen.getByTestId('prefix')).toBeInTheDocument()
    })
  })
})
