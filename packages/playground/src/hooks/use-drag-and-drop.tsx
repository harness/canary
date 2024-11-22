import { useCallback } from 'react'

import { DragEndEvent } from '@dnd-kit/core'

interface UseDragAndDropProps<T> {
  items: T[]
  onReorder?: (items: T[]) => void
}

/**
 * Hook for handling drag and drop functionality
 * Provides utilities for managing draggable items in a list
 *
 * @template T - Type of items being dragged (must include a 'type' property)
 * @param items - Array of draggable items
 * @param onReorder - Callback function to handle reordering of items
 *
 * @returns {Object} Object containing:
 *   - handleDragEnd: Function to handle the end of a drag operation
 *   - getItemId: Function to generate unique IDs for draggable items
 *
 * @example
 * ```tsx
 * const { handleDragEnd, getItemId } = useDragAndDrop({
 *   items: sortableItems,
 *   onReorder: handleReorder
 * })
 *
 * return (
 *   <DndContext onDragEnd={handleDragEnd}>
 *     <SortableContext items={items.map((_, index) => getItemId(index))}>
 *       {items.map((item, index) => (
 *         <SortableItem key={getItemId(index)} id={getItemId(index)} />
 *       ))}
 *     </SortableContext>
 *   </DndContext>
 * )
 * ```
 */
const useDragAndDrop = <T extends { type: string }>({ items, onReorder }: UseDragAndDropProps<T>) => {
  /**
   * Handles the end of a drag operation
   * Calculates new positions and calls onReorder with updated items array
   *
   * @param event - DragEndEvent from @dnd-kit/core containing:
   *   - active: Currently dragged item
   *   - over: Item being dragged over
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = parseInt(active.id.toString().split('-')[1])
      const newIndex = parseInt(over.id.toString().split('-')[1])

      const newItems = [...items]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)

      onReorder?.(newItems)
    },
    [items, onReorder]
  )

  /**
   * Generates a unique ID for a draggable item
   * Used by DndKit to track items during drag operations
   *
   * @param index - Index of the item in the list
   * @returns Formatted string ID in the format 'sort-{index}'
   */
  const getItemId = useCallback((index: number) => `sort-${index}`, [])

  return {
    handleDragEnd,
    getItemId
  }
}

export default useDragAndDrop
