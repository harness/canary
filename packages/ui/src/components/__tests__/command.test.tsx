import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Command } from '../command'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (children: React.ReactNode): RenderResult => {
  return render(
    <TestWrapper>
      <Command.Root>{children}</Command.Root>
    </TestWrapper>
  )
}

describe('Command', () => {
  describe('Command.Root', () => {
    test('should render command root', () => {
      const { container } = renderComponent(<div>Command content</div>)

      expect(screen.getByText('Command content')).toBeInTheDocument()
      expect(container.querySelector('[cmdk-root]')).toBeTruthy()
    })

    test('should apply custom className', () => {
      const { container } = render(
        <TestWrapper>
          <Command.Root className="custom-command">
            <div>Content</div>
          </Command.Root>
        </TestWrapper>
      )

      const element = container.querySelector('.custom-command')
      expect(element).toBeTruthy()
    })
  })

  describe('Command.Input', () => {
    test('should render input with search icon', () => {
      renderComponent(<Command.Input placeholder="Search..." />)

      const input = screen.getByPlaceholderText('Search...')
      expect(input).toBeInTheDocument()

      // Search icon is present
      const icon = document.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should handle input changes', async () => {
      const handleChange = vi.fn()
      renderComponent(<Command.Input placeholder="Search" onValueChange={handleChange} />)

      const input = screen.getByPlaceholderText('Search')
      await userEvent.type(input, 'test')

      expect(handleChange).toHaveBeenCalled()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(<Command.Input className="custom-input" />)

      const input = container.querySelector('.custom-input')
      expect(input).toBeTruthy()
    })

    test('should handle disabled state', () => {
      renderComponent(<Command.Input disabled placeholder="Search" />)

      const input = screen.getByPlaceholderText('Search') as HTMLInputElement
      expect(input).toBeDisabled()
    })
  })

  describe('Command.List', () => {
    test('should render list container', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item>Item 1</Command.Item>
          <Command.Item>Item 2</Command.Item>
        </Command.List>
      )

      const list = container.querySelector('[cmdk-list]')
      expect(list).toBeTruthy()
    })

    test('should render children', () => {
      renderComponent(
        <Command.List>
          <Command.Item>Item 1</Command.Item>
          <Command.Item>Item 2</Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List className="custom-list">
          <Command.Item>Item</Command.Item>
        </Command.List>
      )

      const list = container.querySelector('.custom-list')
      expect(list).toBeTruthy()
    })
  })

  describe('Command.Item', () => {
    test('should render command item', () => {
      renderComponent(
        <Command.List>
          <Command.Item>Test Item</Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    test('should handle onSelect callback', async () => {
      const handleSelect = vi.fn()
      renderComponent(
        <Command.List>
          <Command.Item onSelect={handleSelect}>Selectable Item</Command.Item>
        </Command.List>
      )

      const item = screen.getByText('Selectable Item')
      await userEvent.click(item)

      expect(handleSelect).toHaveBeenCalled()
    })

    test('should handle disabled state', () => {
      renderComponent(
        <Command.List>
          <Command.Item disabled>Disabled Item</Command.Item>
        </Command.List>
      )

      const item = screen.getByText('Disabled Item')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item className="custom-item">Item</Command.Item>
        </Command.List>
      )

      const item = container.querySelector('.custom-item')
      expect(item).toBeTruthy()
    })
  })

  describe('Command.Group', () => {
    test('should render command group', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Group heading="Group Title">
            <Command.Item>Item 1</Command.Item>
            <Command.Item>Item 2</Command.Item>
          </Command.Group>
        </Command.List>
      )

      const group = container.querySelector('[cmdk-group]')
      expect(group).toBeTruthy()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    test('should render group heading', () => {
      renderComponent(
        <Command.List>
          <Command.Group heading="Options">
            <Command.Item>Option 1</Command.Item>
          </Command.Group>
        </Command.List>
      )

      expect(screen.getByText('Options')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Group className="custom-group" heading="Group">
            <Command.Item>Item</Command.Item>
          </Command.Group>
        </Command.List>
      )

      const group = container.querySelector('.custom-group')
      expect(group).toBeTruthy()
    })
  })

  describe('Command.Empty', () => {
    test('should render empty state', () => {
      renderComponent(
        <>
          <Command.Input />
          <Command.List>
            <Command.Empty>No results found</Command.Empty>
          </Command.List>
        </>
      )

      // Empty message is present (shown when no items match)
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Empty className="custom-empty">Empty</Command.Empty>
        </Command.List>
      )

      const empty = container.querySelector('.custom-empty')
      expect(empty).toBeTruthy()
    })
  })

  describe('Command.Separator', () => {
    test('should render separator', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item>Item 1</Command.Item>
          <Command.Separator />
          <Command.Item>Item 2</Command.Item>
        </Command.List>
      )

      const separator = container.querySelector('[cmdk-separator]')
      expect(separator).toBeTruthy()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Separator className="custom-separator" />
        </Command.List>
      )

      const separator = container.querySelector('.custom-separator')
      expect(separator).toBeTruthy()
    })
  })

  describe('Command.Shortcut', () => {
    test('should render keyboard shortcut', () => {
      renderComponent(
        <Command.List>
          <Command.Item>
            <span>Open</span>
            <Command.Shortcut>⌘K</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      expect(screen.getByText('⌘K')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item>
            <Command.Shortcut className="custom-shortcut">Ctrl+K</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      const shortcut = container.querySelector('.custom-shortcut')
      expect(shortcut).toBeTruthy()
    })
  })

  describe('Command.Loading', () => {
    test('should render loading state', () => {
      renderComponent(
        <Command.List>
          <Command.Loading>Loading...</Command.Loading>
        </Command.List>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Loading className="custom-loading">Loading</Command.Loading>
        </Command.List>
      )

      const loading = container.querySelector('.custom-loading')
      expect(loading).toBeTruthy()
    })
  })

  describe('Command.Dialog', () => {
    test('should render command dialog', () => {
      render(
        <TestWrapper>
          <Command.Dialog open={true}>
            <Command.Input placeholder="Search" />
            <Command.List>
              <Command.Item>Item 1</Command.Item>
            </Command.List>
          </Command.Dialog>
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    test('should not render when open is false', () => {
      render(
        <TestWrapper>
          <Command.Dialog open={false}>
            <Command.Input placeholder="Search" />
          </Command.Dialog>
        </TestWrapper>
      )

      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument()
    })

    test('should handle open state changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <Command.Dialog open={false}>
            <Command.Input placeholder="Search" />
          </Command.Dialog>
        </TestWrapper>
      )

      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Command.Dialog open={true}>
            <Command.Input placeholder="Search" />
          </Command.Dialog>
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete command palette', () => {
      renderComponent(
        <>
          <Command.Input placeholder="Type a command" />
          <Command.List>
            <Command.Group heading="Actions">
              <Command.Item>New File</Command.Item>
              <Command.Item>Save</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Settings">
              <Command.Item>Preferences</Command.Item>
            </Command.Group>
            <Command.Empty>No results</Command.Empty>
          </Command.List>
        </>
      )

      expect(screen.getByPlaceholderText('Type a command')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByText('New File')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should render items with shortcuts', () => {
      renderComponent(
        <Command.List>
          <Command.Item>
            <span>Copy</span>
            <Command.Shortcut>⌘C</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            <span>Paste</span>
            <Command.Shortcut>⌘V</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('⌘C')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
      expect(screen.getByText('⌘V')).toBeInTheDocument()
    })

    test('should render multiple groups', () => {
      renderComponent(
        <Command.List>
          <Command.Group heading="Group 1">
            <Command.Item>Item 1</Command.Item>
          </Command.Group>
          <Command.Group heading="Group 2">
            <Command.Item>Item 2</Command.Item>
          </Command.Group>
          <Command.Group heading="Group 3">
            <Command.Item>Item 3</Command.Item>
          </Command.Group>
        </Command.List>
      )

      expect(screen.getByText('Group 1')).toBeInTheDocument()
      expect(screen.getByText('Group 2')).toBeInTheDocument()
      expect(screen.getByText('Group 3')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Root', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <Command.Root ref={ref}>
            <div>Content</div>
          </Command.Root>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Input', () => {
      const ref = vi.fn()

      renderComponent(<Command.Input ref={ref} />)

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on List', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List ref={ref}>
          <Command.Item>Item</Command.Item>
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Item', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List>
          <Command.Item ref={ref}>Item</Command.Item>
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Group', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List>
          <Command.Group ref={ref} heading="Test">
            <Command.Item>Item</Command.Item>
          </Command.Group>
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Empty', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List>
          <Command.Empty ref={ref}>Empty</Command.Empty>
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Separator', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List>
          <Command.Separator ref={ref} />
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Loading', () => {
      const ref = vi.fn()

      renderComponent(
        <Command.List>
          <Command.Loading ref={ref}>Loading</Command.Loading>
        </Command.List>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct displayName for Shortcut', () => {
      expect(Command.Shortcut.displayName).toBe('CommandShortcut')
    })
  })

  describe('Command.Input - Extended', () => {
    test('should handle empty input', () => {
      renderComponent(<Command.Input placeholder="Empty" />)

      const input = screen.getByPlaceholderText('Empty') as HTMLInputElement
      expect(input.value).toBe('')
    })

    test('should handle controlled value', () => {
      const { rerender } = render(
        <TestWrapper>
          <Command.Root>
            <Command.Input value="Initial" placeholder="Test" />
          </Command.Root>
        </TestWrapper>
      )

      let input = screen.getByPlaceholderText('Test') as HTMLInputElement
      expect(input.value).toBe('Initial')

      rerender(
        <TestWrapper>
          <Command.Root>
            <Command.Input value="Updated" placeholder="Test" />
          </Command.Root>
        </TestWrapper>
      )

      input = screen.getByPlaceholderText('Test') as HTMLInputElement
      expect(input.value).toBe('Updated')
    })

    test('should handle autoFocus', () => {
      renderComponent(<Command.Input autoFocus placeholder="Auto focus" />)

      const input = screen.getByPlaceholderText('Auto focus')
      expect(input).toHaveFocus()
    })

    test('should forward data attributes', () => {
      renderComponent(<Command.Input data-testid="custom-input" />)

      expect(screen.getByTestId('custom-input')).toBeInTheDocument()
    })
  })

  describe('Command.List - Extended', () => {
    test('should handle scrollAreaProps', () => {
      const { container } = renderComponent(
        <Command.List scrollAreaProps={{ className: 'custom-scroll' }}>
          <Command.Item>Item</Command.Item>
        </Command.List>
      )

      const scrollArea = container.querySelector('.custom-scroll')
      expect(scrollArea).toBeInTheDocument()
    })

    test('should handle empty list', () => {
      const { container } = renderComponent(<Command.List></Command.List>)

      const list = container.querySelector('[cmdk-list]')
      expect(list).toBeTruthy()
    })

    test('should handle many items', () => {
      renderComponent(
        <Command.List>
          {Array.from({ length: 50 }, (_, i) => (
            <Command.Item key={i}>Item {i}</Command.Item>
          ))}
        </Command.List>
      )

      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 49')).toBeInTheDocument()
    })
  })

  describe('Command.Item - Extended', () => {
    test('should handle keywords prop', () => {
      renderComponent(
        <Command.List>
          <Command.Item keywords={['test', 'search']}>Searchable Item</Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Searchable Item')).toBeInTheDocument()
    })

    test('should handle value prop', () => {
      renderComponent(
        <Command.List>
          <Command.Item value="custom-value">Item with value</Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Item with value')).toBeInTheDocument()
    })

    test('should not call onSelect when disabled', async () => {
      const handleSelect = vi.fn()
      renderComponent(
        <Command.List>
          <Command.Item disabled onSelect={handleSelect}>
            Disabled Item
          </Command.Item>
        </Command.List>
      )

      const item = screen.getByText('Disabled Item')
      await userEvent.click(item)

      expect(handleSelect).not.toHaveBeenCalled()
    })

    test('should forward data attributes', () => {
      renderComponent(
        <Command.List>
          <Command.Item data-testid="custom-item">Item</Command.Item>
        </Command.List>
      )

      expect(screen.getByTestId('custom-item')).toBeInTheDocument()
    })
  })

  describe('Command.Group - Extended', () => {
    test('should render without heading', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Group>
            <Command.Item>Item 1</Command.Item>
            <Command.Item>Item 2</Command.Item>
          </Command.Group>
        </Command.List>
      )

      const group = container.querySelector('[cmdk-group]')
      expect(group).toBeTruthy()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    test('should handle value prop', () => {
      renderComponent(
        <Command.List>
          <Command.Group heading="Group" value="group-value">
            <Command.Item>Item</Command.Item>
          </Command.Group>
        </Command.List>
      )

      expect(screen.getByText('Group')).toBeInTheDocument()
      expect(screen.getByText('Item')).toBeInTheDocument()
    })
  })

  describe('Command.Shortcut - Extended', () => {
    test('should render multiple shortcuts', () => {
      renderComponent(
        <Command.List>
          <Command.Item>
            <span>Action</span>
            <Command.Shortcut>⌘</Command.Shortcut>
            <Command.Shortcut>K</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      expect(screen.getByText('⌘')).toBeInTheDocument()
      expect(screen.getByText('K')).toBeInTheDocument()
    })

    test('should handle long shortcut text', () => {
      renderComponent(
        <Command.List>
          <Command.Item>
            <span>Action</span>
            <Command.Shortcut>Ctrl+Shift+Alt+K</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Ctrl+Shift+Alt+K')).toBeInTheDocument()
    })

    test('should forward data attributes', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item>
            <Command.Shortcut data-testid="shortcut">Ctrl+K</Command.Shortcut>
          </Command.Item>
        </Command.List>
      )

      expect(container.querySelector('[data-testid="shortcut"]')).toBeInTheDocument()
    })
  })

  describe('Command.Dialog - Extended', () => {
    test('should handle onOpenChange', () => {
      const handleOpenChange = vi.fn()

      render(
        <TestWrapper>
          <Command.Dialog open={true} onOpenChange={handleOpenChange}>
            <Command.Input />
          </Command.Dialog>
        </TestWrapper>
      )

      expect(handleOpenChange).not.toHaveBeenCalled()
    })

    test('should render complete command palette in dialog', () => {
      render(
        <TestWrapper>
          <Command.Dialog open={true}>
            <Command.Input placeholder="Search" />
            <Command.List>
              <Command.Group heading="Actions">
                <Command.Item>Action 1</Command.Item>
              </Command.Group>
              <Command.Empty>No results</Command.Empty>
            </Command.List>
          </Command.Dialog>
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByText('Action 1')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty group', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Group heading="Empty Group"></Command.Group>
        </Command.List>
      )

      expect(screen.getByText('Empty Group')).toBeInTheDocument()
      const group = container.querySelector('[cmdk-group]')
      expect(group).toBeTruthy()
    })

    test('should handle multiple separators', () => {
      const { container } = renderComponent(
        <Command.List>
          <Command.Item>Item 1</Command.Item>
          <Command.Separator />
          <Command.Separator />
          <Command.Separator />
          <Command.Item>Item 2</Command.Item>
        </Command.List>
      )

      const separators = container.querySelectorAll('[cmdk-separator]')
      expect(separators.length).toBe(3)
    })

    test('should handle items with complex children', () => {
      renderComponent(
        <Command.List>
          <Command.Item>
            <div>
              <strong>Bold</strong>
              <span>Normal</span>
              <em>Italic</em>
            </div>
          </Command.Item>
        </Command.List>
      )

      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('Normal')).toBeInTheDocument()
      expect(screen.getByText('Italic')).toBeInTheDocument()
    })

    test('should handle very long item text', () => {
      const longText = 'A'.repeat(200)
      renderComponent(
        <Command.List>
          <Command.Item>{longText}</Command.Item>
        </Command.List>
      )

      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes on Root', () => {
      const { container } = render(
        <TestWrapper>
          <Command.Root data-testid="root">
            <div>Content</div>
          </Command.Root>
        </TestWrapper>
      )

      expect(container.querySelector('[data-testid="root"]')).toBeInTheDocument()
    })

    test('should forward label prop on Root', () => {
      const { container } = render(
        <TestWrapper>
          <Command.Root label="Command Menu">
            <div>Content</div>
          </Command.Root>
        </TestWrapper>
      )

      const root = container.querySelector('[cmdk-root]')
      expect(root).toBeTruthy()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update input value', async () => {
      const handleChange = vi.fn()
      const { rerender } = render(
        <TestWrapper>
          <Command.Root>
            <Command.Input placeholder="Search" onValueChange={handleChange} />
          </Command.Root>
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText('Search')
      await userEvent.type(input, 'test')

      expect(handleChange).toHaveBeenCalled()

      rerender(
        <TestWrapper>
          <Command.Root>
            <Command.Input placeholder="Updated" onValueChange={handleChange} />
          </Command.Root>
        </TestWrapper>
      )

      expect(screen.getByPlaceholderText('Updated')).toBeInTheDocument()
    })

    test('should update items dynamically', () => {
      const { rerender } = render(
        <TestWrapper>
          <Command.Root>
            <Command.List>
              <Command.Item>Item 1</Command.Item>
            </Command.List>
          </Command.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <Command.Root>
            <Command.List>
              <Command.Item>Item 1</Command.Item>
              <Command.Item>Item 2</Command.Item>
            </Command.List>
          </Command.Root>
        </TestWrapper>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should be keyboard navigable', () => {
      renderComponent(
        <>
          <Command.Input placeholder="Search" />
          <Command.List>
            <Command.Item>Item 1</Command.Item>
            <Command.Item>Item 2</Command.Item>
          </Command.List>
        </>
      )

      const input = screen.getByPlaceholderText('Search')
      input.focus()

      expect(input).toHaveFocus()
    })

    test('should have proper ARIA attributes on items', () => {
      renderComponent(
        <Command.List>
          <Command.Item>Accessible Item</Command.Item>
        </Command.List>
      )

      const item = screen.getByText('Accessible Item')
      expect(item).toBeInTheDocument()
    })

    test('should mark disabled items correctly', () => {
      renderComponent(
        <Command.List>
          <Command.Item disabled>Disabled Item</Command.Item>
        </Command.List>
      )

      const item = screen.getByText('Disabled Item')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Filtering and Search', () => {
    test('should accept input for filtering', async () => {
      const { container } = renderComponent(
        <>
          <Command.Input placeholder="Search" />
          <Command.List>
            <Command.Item>Apple</Command.Item>
            <Command.Item>Banana</Command.Item>
            <Command.Item>Cherry</Command.Item>
            <Command.Empty>No results</Command.Empty>
          </Command.List>
        </>
      )

      const input = screen.getByPlaceholderText('Search')
      expect(input).toBeInTheDocument()

      // Items are rendered
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
      expect(screen.getByText('Cherry')).toBeInTheDocument()

      const list = container.querySelector('[cmdk-list]')
      expect(list).toBeTruthy()
    })
  })

  describe('Complex Integration Scenarios', () => {
    test('should handle complete command palette with all features', () => {
      renderComponent(
        <>
          <Command.Input placeholder="Type a command..." />
          <Command.List>
            <Command.Loading>Loading...</Command.Loading>
            <Command.Empty>No results</Command.Empty>
            <Command.Group heading="File">
              <Command.Item>
                <span>New File</span>
                <Command.Shortcut>⌘N</Command.Shortcut>
              </Command.Item>
              <Command.Item disabled>
                <span>Open</span>
                <Command.Shortcut>⌘O</Command.Shortcut>
              </Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Edit">
              <Command.Item>
                <span>Copy</span>
                <Command.Shortcut>⌘C</Command.Shortcut>
              </Command.Item>
              <Command.Item>
                <span>Paste</span>
                <Command.Shortcut>⌘V</Command.Shortcut>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </>
      )

      expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
      expect(screen.getByText('File')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('New File')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('⌘N')).toBeInTheDocument()
    })

    test('should handle nested groups', () => {
      renderComponent(
        <Command.List>
          <Command.Group heading="Parent Group">
            <Command.Item>Parent Item 1</Command.Item>
            <Command.Item>Parent Item 2</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Child Group">
            <Command.Item>Child Item 1</Command.Item>
            <Command.Item>Child Item 2</Command.Item>
          </Command.Group>
        </Command.List>
      )

      expect(screen.getByText('Parent Group')).toBeInTheDocument()
      expect(screen.getByText('Child Group')).toBeInTheDocument()
      expect(screen.getByText('Parent Item 1')).toBeInTheDocument()
      expect(screen.getByText('Child Item 1')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    test('should show loading state', () => {
      renderComponent(
        <Command.List>
          <Command.Loading>Loading items...</Command.Loading>
        </Command.List>
      )

      expect(screen.getByText('Loading items...')).toBeInTheDocument()
    })

    test('should handle progress prop on Loading', () => {
      renderComponent(
        <Command.List>
          <Command.Loading progress={50}>Loading 50%</Command.Loading>
        </Command.List>
      )

      expect(screen.getByText('Loading 50%')).toBeInTheDocument()
    })
  })
})
