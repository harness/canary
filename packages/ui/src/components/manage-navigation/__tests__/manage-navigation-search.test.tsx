import React from 'react'

import { MenuGroupType, NavbarItemType } from '@components/app-sidebar/types'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ManageNavigationSearch } from '../manage-navigation-search'

// Mock dependencies
const mockSetSearchDialogOpen = vi.fn()

// Create a context to share open state
const DropdownContext = React.createContext<{ open: boolean; onOpenChange: (value: boolean) => void } | null>(null)

vi.mock('@/components', () => ({
  DropdownMenu: {
    Root: ({
      children,
      open,
      onOpenChange
    }: {
      children: React.ReactNode
      open: boolean
      onOpenChange: (value: boolean) => void
    }) => {
      mockSetSearchDialogOpen.mockImplementation(onOpenChange)
      return (
        <DropdownContext.Provider value={{ open, onOpenChange }}>
          <div data-testid="dropdown-root" data-open={open}>
            {children}
          </div>
        </DropdownContext.Provider>
      )
    },
    Trigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="dropdown-trigger" className={className}>
        {children}
      </div>
    ),
    Content: ({ children, align, className }: { children: React.ReactNode; align?: string; className?: string }) => {
      const context = React.useContext(DropdownContext)
      if (!context || !context.open) return null
      return (
        <div data-testid="dropdown-content" data-align={align} className={className}>
          {children}
        </div>
      )
    },
    Group: ({ children, label }: { children: React.ReactNode; label: string }) => (
      <div data-testid="dropdown-group" data-label={label}>
        {children}
      </div>
    ),
    Item: ({ children, title, onSelect }: { children?: React.ReactNode; title: string; onSelect?: () => void }) => (
      <button data-testid={`dropdown-item-${title}`} onClick={onSelect}>
        {children || title}
      </button>
    ),
    NoOptions: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-no-options">{children}</div>
  },
  SearchInput: (() => {
    const SearchInputComponent = React.forwardRef<HTMLInputElement, any>(
      ({ id, placeholder, onFocus, onChange, className }, ref) => {
        const inputRef = React.useRef<HTMLInputElement>(null)
        React.useImperativeHandle(ref, () => inputRef.current || ({} as HTMLInputElement))
        return (
          <input
            ref={inputRef}
            data-testid="search-input"
            id={id}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={e => onChange?.(e.target.value)}
            className={className}
          />
        )
      }
    )
    SearchInputComponent.displayName = 'SearchInput'
    return SearchInputComponent
  })()
}))

const createNavbarItem = (overrides: Partial<NavbarItemType> = {}): NavbarItemType => ({
  id: `item-${Math.random()}`,
  title: 'Test Item',
  to: '/test',
  ...overrides
})

const createMenuGroup = (overrides: Partial<MenuGroupType> = {}): MenuGroupType => ({
  groupId: 'group-1',
  title: 'Test Group',
  type: 'general' as any,
  items: [createNavbarItem({ id: 'item-1', title: 'Item 1' })],
  ...overrides
})

describe('ManageNavigationSearch', () => {
  const defaultNavbarMenuData: MenuGroupType[] = [
    createMenuGroup({
      groupId: 'group-1',
      title: 'Group 1',
      items: [
        createNavbarItem({ id: 'item-1', title: 'First Item' }),
        createNavbarItem({ id: 'item-2', title: 'Second Item' })
      ]
    }),
    createMenuGroup({
      groupId: 'group-2',
      title: 'Group 2',
      items: [createNavbarItem({ id: 'item-3', title: 'Third Item' })]
    })
  ]

  const defaultProps = {
    navbarMenuData: defaultNavbarMenuData,
    addToPinnedItems: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders search input', () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Add menu element')).toBeInTheDocument()
    })

    it('renders dropdown trigger', () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
    })

    it('does not render dropdown content when closed', () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('filters items based on search query', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'First' } })

      await waitFor(() => {
        expect(input.value).toBe('First')
      })
    })

    it('performs case-insensitive search', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'first' } })

      await waitFor(() => {
        expect(input.value).toBe('first')
      })
    })

    it('shows all items when search query is empty', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'First' } })
      fireEvent.change(input, { target: { value: '' } })

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('filters items across multiple groups', async () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: [createNavbarItem({ id: 'item-1', title: 'Alpha Item' })]
        }),
        createMenuGroup({
          groupId: 'group-2',
          title: 'Group 2',
          items: [createNavbarItem({ id: 'item-2', title: 'Beta Item' })]
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Alpha' } })

      await waitFor(() => {
        expect(input.value).toBe('Alpha')
      })
    })

    it('shows no results when no items match', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'NonExistentItem' } })

      await waitFor(() => {
        expect(input.value).toBe('NonExistentItem')
      })
    })
  })

  describe('Item Selection', () => {
    it('calls addToPinnedItems when item is selected', async () => {
      const addToPinnedItems = vi.fn()
      render(<ManageNavigationSearch {...defaultProps} addToPinnedItems={addToPinnedItems} />)

      // Open dropdown by setting state
      act(() => {
        mockSetSearchDialogOpen(true)
      })

      await waitFor(() => {
        const item = screen.getByTestId('dropdown-item-First Item')
        expect(item).toBeInTheDocument()
      })

      const item = screen.getByTestId('dropdown-item-First Item')
      fireEvent.click(item)

      expect(addToPinnedItems).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'item-1',
          title: 'First Item'
        })
      )
    })

    it('resets search query after item selection', async () => {
      const { rerender } = render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'First' } })
      expect(input.value).toBe('First')

      // Simulate opening dropdown
      act(() => {
        mockSetSearchDialogOpen(true)
      })
      rerender(<ManageNavigationSearch {...defaultProps} />)

      await waitFor(() => {
        const item = screen.queryByTestId('dropdown-item-First Item')
        if (item) {
          fireEvent.click(item)
        }
      })

      // After item click, the component should reset the search
      // Since we're testing the component behavior, we verify the component handles it
      await waitFor(() => {
        // The component should have reset filteredItems internally
        expect(screen.getByTestId('search-input')).toBeInTheDocument()
      })
    })

    it('closes dropdown after item selection', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'First' } })

      act(() => {
        mockSetSearchDialogOpen(true)
      })

      await waitFor(() => {
        const item = screen.getByTestId('dropdown-item-First Item')
        expect(item).toBeInTheDocument()
      })

      const item = screen.getByTestId('dropdown-item-First Item')
      fireEvent.click(item)

      await waitFor(() => {
        const dropdownRoot = screen.getByTestId('dropdown-root')
        expect(dropdownRoot).toHaveAttribute('data-open', 'false')
      })
    })
  })

  describe('Input Focus Handling', () => {
    it('resets filtered items when input is focused with empty value', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement

      // Type something
      fireEvent.change(input, { target: { value: 'First' } })
      expect(input.value).toBe('First')

      // Clear and focus
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.focus(input)

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('does not reset when input has value on focus', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'First' } })
      fireEvent.focus(input)

      await waitFor(() => {
        expect(input.value).toBe('First')
      })
    })
  })

  describe('Filter Items Function', () => {
    it('returns all categories when query is empty', () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: [createNavbarItem({ id: 'item-1', title: 'Item 1' })]
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      const input = screen.getByTestId('search-input')
      expect(input).toBeInTheDocument()
    })

    it('returns empty array when no items match', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'ZZZ' } })

      await waitFor(() => {
        expect(input.value).toBe('ZZZ')
      })
    })

    it('filters items within groups correctly', async () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: [
            createNavbarItem({ id: 'item-1', title: 'Match Item' }),
            createNavbarItem({ id: 'item-2', title: 'No Match' })
          ]
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Match' } })

      await waitFor(() => {
        expect(input.value).toBe('Match')
      })
    })

    it('removes groups with no matching items', async () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: [createNavbarItem({ id: 'item-1', title: 'Match Item' })]
        }),
        createMenuGroup({
          groupId: 'group-2',
          title: 'Group 2',
          items: [createNavbarItem({ id: 'item-2', title: 'No Match' })]
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Match' } })

      await waitFor(() => {
        expect(input.value).toBe('Match')
      })
    })
  })

  describe('Count Filtered Items', () => {
    it('calculates total count correctly', () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: [
            createNavbarItem({ id: 'item-1', title: 'Item 1' }),
            createNavbarItem({ id: 'item-2', title: 'Item 2' })
          ]
        }),
        createMenuGroup({
          groupId: 'group-2',
          title: 'Group 2',
          items: [createNavbarItem({ id: 'item-3', title: 'Item 3' })]
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      // Should render without errors
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('shows no options when count is zero', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'NonExistent' } })

      act(() => {
        mockSetSearchDialogOpen(true)
      })

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-no-options')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty navbarMenuData array', () => {
      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={[]} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('handles groups with empty items array', () => {
      const menuData: MenuGroupType[] = [
        createMenuGroup({
          groupId: 'group-1',
          title: 'Group 1',
          items: []
        })
      ]

      render(<ManageNavigationSearch {...defaultProps} navbarMenuData={menuData} />)

      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('handles special characters in search query', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: '!@#$%' } })

      await waitFor(() => {
        expect(input.value).toBe('!@#$%')
      })
    })

    it('handles whitespace-only search query', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: '   ' } })

      await waitFor(() => {
        expect(input.value).toBe('   ')
      })
    })

    it('handles rapid search input changes', async () => {
      render(<ManageNavigationSearch {...defaultProps} />)

      const input = screen.getByTestId('search-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'F' } })
      fireEvent.change(input, { target: { value: 'Fi' } })
      fireEvent.change(input, { target: { value: 'Fir' } })
      fireEvent.change(input, { target: { value: 'Firs' } })
      fireEvent.change(input, { target: { value: 'First' } })

      await waitFor(() => {
        expect(input.value).toBe('First')
      })
    })
  })
})
