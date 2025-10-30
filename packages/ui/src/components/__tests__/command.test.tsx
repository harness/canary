import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { Command } from '../command'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (children: React.ReactNode): RenderResult => {
  return render(<TestWrapper><Command.Root>{children}</Command.Root></TestWrapper>)
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

      renderComponent(<Command.List ref={ref}><Command.Item>Item</Command.Item></Command.List>)

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
  })
})

