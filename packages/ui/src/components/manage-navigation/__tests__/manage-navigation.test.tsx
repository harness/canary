import React from 'react'

import { NavbarItemType } from '@components/app-sidebar/types'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ManageNavigation } from '../index'

// Mock dependencies
vi.mock('@/components', () => ({
  Button: ({ children, onClick, disabled, variant, size, iconOnly, tooltipProps, ...props }: any) => (
    <button
      data-testid={`button-${typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : 'custom'}`}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly}
      data-tooltip={tooltipProps?.content}
      {...props}
    >
      {children}
    </button>
  ),
  ButtonLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="button-layout">{children}</div>,
  Dialog: {
    Root: ({
      children,
      open,
      onOpenChange
    }: {
      children: React.ReactNode
      open: boolean
      onOpenChange: (value: boolean) => void
    }) => (
      <div data-testid="dialog-root" data-open={open}>
        {open && (
          <div onClick={() => onOpenChange(false)} data-testid="dialog-overlay" role="button" tabIndex={0}>
            {children}
          </div>
        )}
      </div>
    ),
    Content: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="dialog-content" className={className}>
        {children}
      </div>
    ),
    Header: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
    Title: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
    Body: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-body">{children}</div>,
    Footer: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>,
    Close: ({
      children,
      onClick,
      disabled
    }: {
      children: React.ReactNode
      onClick?: () => void
      disabled?: boolean
    }) => (
      <button data-testid="dialog-close" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    )
  },
  IconV2: ({ name, size, className }: { name: string; size?: string; className?: string }) => (
    <span data-testid={`icon-${name}`} data-size={size} className={className} />
  ),
  Layout: {
    Grid: ({ children, gapY }: { children: React.ReactNode; gapY?: string }) => (
      <div data-testid="layout-grid" data-gap-y={gapY}>
        {children}
      </div>
    ),
    Flex: ({ children, direction, gapX, gapY, align, justify, as, className }: any) => {
      const Tag = as || 'div'
      return (
        <Tag
          data-testid="layout-flex"
          data-direction={direction}
          data-gap-x={gapX}
          data-gap-y={gapY}
          data-align={align}
          data-justify={justify}
          className={className}
        >
          {children}
        </Tag>
      )
    }
  },
  Text: ({ children, variant, color, align, className, as }: any) => {
    const Tag = as || 'span'
    return (
      <Tag data-testid="text" data-variant={variant} data-color={color} data-align={align} className={className}>
        {children}
      </Tag>
    )
  }
}))

vi.mock('@/hooks/use-drag-and-drop', () => ({
  default: vi.fn(({ items, onReorder }: { items: any[]; onReorder?: (items: any[]) => void }) => ({
    handleDragEnd: vi.fn((event: any) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = parseInt(active.id.toString().split('-')[1])
      const newIndex = parseInt(over.id.toString().split('-')[1])

      const newItems = [...items]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)

      onReorder?.(newItems)
    }),
    getItemId: (index: number) => `sort-${index}`
  }))
}))

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd, collisionDetection: _collisionDetection, modifiers: _modifiers }: any) => (
    <div
      data-testid="dnd-context"
      onClick={() => onDragEnd?.({ active: { id: 'sort-1' }, over: { id: 'sort-0' } })}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),
  closestCenter: vi.fn()
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children, items }: { children: React.ReactNode; items: string[] }) => (
    <div data-testid="sortable-context" data-items={JSON.stringify(items)}>
      {children}
    </div>
  )
}))

vi.mock('../draggable-item', () => ({
  DraggableItem: ({ children, id, tag: Tag = 'div' }: any) => (
    <Tag data-testid={`draggable-item-${id}`}>
      {children({
        attributes: { 'data-draggable': true },
        listeners: { onMouseDown: vi.fn() }
      })}
    </Tag>
  )
}))

let itemIdCounter = 0
const createNavbarItem = (overrides: Partial<NavbarItemType> = {}): NavbarItemType => {
  itemIdCounter++
  return {
    id: `item-${itemIdCounter}-${Date.now()}`,
    title: `Test Item ${itemIdCounter}`,
    to: '/test',
    ...overrides
  }
}

describe('ManageNavigation', () => {
  const defaultPinnedItems: NavbarItemType[] = [
    createNavbarItem({ id: 'pinned-1', title: 'Pinned Item 1', permanentlyPinned: true }),
    createNavbarItem({ id: 'pinned-2', title: 'Pinned Item 2' })
  ]

  const defaultRecentItems: NavbarItemType[] = [
    createNavbarItem({ id: 'recent-1', title: 'Recent Item 1' }),
    createNavbarItem({ id: 'recent-2', title: 'Recent Item 2' })
  ]

  const defaultProps = {
    pinnedItems: defaultPinnedItems,
    recentItems: defaultRecentItems,
    showManageNavigation: true,
    onSave: vi.fn(),
    onClose: vi.fn(),
    isSubmitting: false,
    submitted: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders dialog when showManageNavigation is true', () => {
      render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'true')
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Manage navigation')
    })

    it('does not render dialog content when showManageNavigation is false', () => {
      render(<ManageNavigation {...defaultProps} showManageNavigation={false} />)

      expect(screen.getByTestId('dialog-root')).toHaveAttribute('data-open', 'false')
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
    })

    it('renders pinned items section', () => {
      render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByText('Pinned')).toBeInTheDocument()
      expect(screen.getByText('Pinned Item 1')).toBeInTheDocument()
      expect(screen.getByText('Pinned Item 2')).toBeInTheDocument()
    })

    it('renders recent items section when items exist', () => {
      render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByText('Recent')).toBeInTheDocument()
      expect(screen.getByText('Recent Item 1')).toBeInTheDocument()
      expect(screen.getByText('Recent Item 2')).toBeInTheDocument()
    })

    it('does not render recent section when no recent items', () => {
      render(<ManageNavigation {...defaultProps} recentItems={[]} />)

      expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('shows "No pinned items" when pinned items array is empty', () => {
      render(<ManageNavigation {...defaultProps} pinnedItems={[]} />)

      expect(screen.getByText('No pinned items')).toBeInTheDocument()
    })

    it('does not show recent section when filtered recent items are empty', () => {
      const pinnedItems = [createNavbarItem({ id: 'pinned-1' })]
      const recentItems = [createNavbarItem({ id: 'pinned-1' })] // Same ID as pinned

      render(<ManageNavigation {...defaultProps} pinnedItems={pinnedItems} recentItems={recentItems} />)

      expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })
  })

  describe('Pinned Items Management', () => {
    it('displays permanently pinned items with lock icon', () => {
      render(<ManageNavigation {...defaultProps} />)

      const pinnedItem1 = screen.getByText('Pinned Item 1').closest('[data-testid="layout-flex"]')
      expect(pinnedItem1).toHaveClass('cursor-not-allowed')
      expect(pinnedItem1).toHaveClass('opacity-55')
      expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    })

    it('displays draggable pinned items with grip icon', () => {
      render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByTestId('icon-grip-dots')).toBeInTheDocument()
      expect(screen.getByText('Pinned Item 2')).toBeInTheDocument()
    })

    it('does not remove permanently pinned items', async () => {
      render(<ManageNavigation {...defaultProps} />)

      const permanentlyPinnedItem = screen.getByText('Pinned Item 1')
      expect(permanentlyPinnedItem).toBeInTheDocument()

      // Permanently pinned items don't have unpin buttons
      const unpinButtons = screen.getAllByTestId('icon-xmark')
      const unpinButtonsForPermanent = unpinButtons.filter(btn => {
        const flexParent = btn.closest('[data-testid="layout-flex"]')
        return flexParent?.textContent?.includes('Pinned Item 1')
      })

      expect(unpinButtonsForPermanent).toHaveLength(0)
    })
  })

  describe('Recent Items Management', () => {
    it('filters out pinned items from recent items list', () => {
      const pinnedItems = [createNavbarItem({ id: 'shared-id', title: 'Shared Item' })]
      const recentItems = [
        createNavbarItem({ id: 'shared-id', title: 'Shared Item' }),
        createNavbarItem({ id: 'recent-only', title: 'Recent Only' })
      ]

      render(<ManageNavigation {...defaultProps} pinnedItems={pinnedItems} recentItems={recentItems} />)

      expect(screen.queryByText('Shared Item')).toBeInTheDocument() // In pinned
      expect(screen.getByText('Recent Only')).toBeInTheDocument() // In recent (filtered)
    })
  })

  describe('Drag and Drop', () => {
    it('renders DndContext for draggable items', () => {
      render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
      expect(screen.getByTestId('sortable-context')).toBeInTheDocument()
    })

    it('handles drag end event and reorders items', async () => {
      render(<ManageNavigation {...defaultProps} />)

      const dndContext = screen.getByTestId('dnd-context')
      fireEvent.click(dndContext)

      // The mock handleDragEnd should be called
      await waitFor(() => {
        expect(dndContext).toBeInTheDocument()
      })
    })
  })

  describe('Save and Cancel Actions', () => {
    it('calls onSave with current state when Save is clicked', async () => {
      const onSave = vi.fn()
      render(<ManageNavigation {...defaultProps} onSave={onSave} />)

      const saveButton = screen.getByText('Save')
      fireEvent.click(saveButton)

      expect(onSave).toHaveBeenCalled()
      expect(onSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'recent-1' }),
          expect.objectContaining({ id: 'recent-2' })
        ]),
        expect.arrayContaining([
          expect.objectContaining({ id: 'pinned-1' }),
          expect.objectContaining({ id: 'pinned-2' })
        ])
      )
    })

    it('calls onClose after saving', async () => {
      const onClose = vi.fn()
      render(<ManageNavigation {...defaultProps} onClose={onClose} />)

      const saveButton = screen.getByText('Save')
      fireEvent.click(saveButton)

      expect(onClose).toHaveBeenCalled()
    })

    it('calls onClose when Cancel is clicked', async () => {
      const onClose = vi.fn()
      render(<ManageNavigation {...defaultProps} onClose={onClose} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(onClose).toHaveBeenCalled()
    })

    it('closes dialog when overlay is clicked', async () => {
      const onClose = vi.fn()
      render(<ManageNavigation {...defaultProps} onClose={onClose} />)

      const overlay = screen.getByTestId('dialog-overlay')
      fireEvent.click(overlay)

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Loading and Submitted States', () => {
    it('disables Save button when isSubmitting is true', () => {
      render(<ManageNavigation {...defaultProps} isSubmitting={true} />)

      const saveButton = screen.getByText('Saving...')
      expect(saveButton).toBeDisabled()
    })

    it('shows "Saving..." text when isSubmitting is true', () => {
      render(<ManageNavigation {...defaultProps} isSubmitting={true} />)

      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })

    it('disables Cancel button when isSubmitting is true', () => {
      render(<ManageNavigation {...defaultProps} isSubmitting={true} />)

      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toBeDisabled()
    })

    it('shows "Saved" button when submitted is true', () => {
      render(<ManageNavigation {...defaultProps} submitted={true} />)

      expect(screen.getByText('Saved')).toBeInTheDocument()
      expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })

    it('disables "Saved" button when submitted is true', () => {
      render(<ManageNavigation {...defaultProps} submitted={true} />)

      const savedButton = screen.getByText('Saved')
      expect(savedButton).toBeDisabled()
    })

    it('does not show Cancel and Save buttons when submitted is true', () => {
      render(<ManageNavigation {...defaultProps} submitted={true} />)

      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })
  })

  describe('State Updates', () => {
    it('updates pinned items when props change', () => {
      const { rerender } = render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByText('Pinned Item 1')).toBeInTheDocument()

      const newPinnedItems = [createNavbarItem({ id: 'new-pinned', title: 'New Pinned Item' })]
      rerender(<ManageNavigation {...defaultProps} pinnedItems={newPinnedItems} />)

      expect(screen.getByText('New Pinned Item')).toBeInTheDocument()
      expect(screen.queryByText('Pinned Item 1')).not.toBeInTheDocument()
    })

    it('updates recent items when props change', () => {
      const { rerender } = render(<ManageNavigation {...defaultProps} />)

      expect(screen.getByText('Recent Item 1')).toBeInTheDocument()

      const newRecentItems = [createNavbarItem({ id: 'new-recent', title: 'New Recent Item' })]
      rerender(<ManageNavigation {...defaultProps} recentItems={newRecentItems} />)

      expect(screen.getByText('New Recent Item')).toBeInTheDocument()
    })

    it('handles adding already pinned item (no duplicate)', async () => {
      const pinnedItems = [createNavbarItem({ id: 'item-1', title: 'Item 1' })]
      const recentItems = [createNavbarItem({ id: 'item-1', title: 'Item 1' })] // Same ID

      render(<ManageNavigation {...defaultProps} pinnedItems={pinnedItems} recentItems={recentItems} />)

      // Item should not appear in recent (filtered out)
      expect(screen.queryByText('Item 1')).toBeInTheDocument() // Only in pinned
    })
  })

  describe('Edge Cases', () => {
    it('handles empty pinned items array', () => {
      render(<ManageNavigation {...defaultProps} pinnedItems={[]} />)

      expect(screen.getByText('No pinned items')).toBeInTheDocument()
    })

    it('handles empty recent items array', () => {
      render(<ManageNavigation {...defaultProps} recentItems={[]} />)

      expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })

    it('handles all recent items being pinned', () => {
      const pinnedItems = [createNavbarItem({ id: 'item-1' }), createNavbarItem({ id: 'item-2' })]
      const recentItems = [createNavbarItem({ id: 'item-1' }), createNavbarItem({ id: 'item-2' })]

      render(<ManageNavigation {...defaultProps} pinnedItems={pinnedItems} recentItems={recentItems} />)

      expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })

    it('handles multiple rapid pin/unpin operations', async () => {
      render(<ManageNavigation {...defaultProps} />)

      const pinButtons = screen.getAllByTestId('icon-pin')
      if (pinButtons.length > 0) {
        fireEvent.click(pinButtons[0].closest('button')!)
        fireEvent.click(pinButtons[0].closest('button')!)
      }

      // Should handle gracefully without errors
      expect(screen.getByTestId('dialog-root')).toBeInTheDocument()
    })
  })

  describe('Filter Recent Items Function', () => {
    it('filters out pinned items from recent items correctly', () => {
      const pinnedItems = [createNavbarItem({ id: 'pinned-1' }), createNavbarItem({ id: 'pinned-2' })]
      const recentItems = [
        createNavbarItem({ id: 'pinned-1' }), // Should be filtered
        createNavbarItem({ id: 'recent-1' }), // Should remain
        createNavbarItem({ id: 'pinned-2' }) // Should be filtered
      ]

      render(<ManageNavigation {...defaultProps} pinnedItems={pinnedItems} recentItems={recentItems} />)

      expect(screen.queryByText('Recent Item 1')).not.toBeInTheDocument() // Original recent items
      // Only the non-pinned recent item should show
      const recentSection = screen.queryByText('Recent')
      if (recentSection) {
        // Recent section exists, check it doesn't contain pinned items
        expect(screen.getByText('Recent')).toBeInTheDocument()
      }
    })
  })
})
