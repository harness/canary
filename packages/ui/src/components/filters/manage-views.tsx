// TODO: we should rethink the approach and stop using the @dnd-kit library

import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react'

import { AlertDialog, Button, Icon, Input } from '@/components'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import useDragAndDrop from '../../hooks/use-drag-and-drop'
import { SavedView, ViewManagement } from './types'

/**
 * Interface for the draggable view item component
 * @property view - The view object containing id, name, and other properties
 * @property id - Unique identifier for drag and drop functionality
 * @property onRename - Callback function for handling view rename
 * @property onDelete - Callback function for handling view deletion
 * @property existingNames - Set of existing view names for validation
 * @property validateViewNameChange - Function to validate view name changes
 */
interface SortableItemProps {
  view: SavedView
  id: string
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  existingNames: Set<string>
  validateViewNameChange: ViewManagement['validateViewNameChange']
}

/**
 * SortableItem component represents a draggable view item with rename and delete capabilities
 * Implements drag and drop functionality using dnd-kit
 * Handles real-time name validation and error states
 */
const SortableItem = memo<SortableItemProps>(
  ({ view, id, onRename, onDelete, existingNames, validateViewNameChange }) => {
    const [name, setName] = useState(view.name.trim())
    const [hasError, setHasError] = useState(false)

    // Initialize drag and drop functionality
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    /**
     * Handles input changes for view name
     * Validates the new name in real-time and updates error state
     * Propagates changes to parent component
     * @param e - Change event from input
     */
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setName(newName)

        const validation = validateViewNameChange(newName, view.name, existingNames)
        setHasError(validation.hasError)

        // Always update parent to reflect current state
        onRename(view.id, newName)
      },
      [view.id, view.name, existingNames, onRename, validateViewNameChange]
    )

    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="flex items-center gap-x-2 rounded p-2 hover:bg-cn-background-hover"
      >
        <div className="group cursor-move" {...attributes} {...listeners}>
          <Icon
            className="text-icons-4 transition-colors duration-200 group-hover:text-icons-2"
            name="grid-dots"
            size={14}
          />
        </div>

        <Input
          theme={hasError ? 'danger' : 'default'}
          value={name}
          size="md"
          placeholder="Enter a name"
          onChange={handleChange}
        />

        <button
          className="text-icons-4 hover:text-icons-danger"
          onClick={() => onDelete(view.id)}
          aria-label="Delete view"
        >
          <Icon className="rotate-45" name="plus" size={14} />
        </button>
      </div>
    )
  }
)

SortableItem.displayName = 'SortableItem'

/**
 * Interface for the ManageViews component
 * @property open - Controls dialog visibility
 * @property onOpenChange - Callback for dialog open state changes
 * @property views - Array of saved views
 * @property viewManagement - Object containing view management methods
 */
interface ManageViewsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  views: SavedView[]
  viewManagement: Pick<
    ViewManagement,
    | 'setCurrentView'
    | 'updateViewsOrder'
    | 'prepareViewsForSave'
    | 'getExistingNames'
    | 'hasViewListChanges'
    | 'hasViewErrors'
    | 'validateViewNameChange'
  >
}

/**
 * ManageViews component provides interface for reordering, renaming and deleting saved views
 * Features:
 * - Drag and drop reordering
 * - Real-time name validation
 * - Local state management for changes
 * - Batch updates on save
 */
const ManageViews: FC<ManageViewsProps> = memo(({ open, onOpenChange, views, viewManagement }) => {
  const [localViews, setLocalViews] = useState<SavedView[]>([])

  /**
   * Syncs local state with props when dialog opens
   * Ensures fresh start for each editing session
   */
  useEffect(() => {
    if (open) setLocalViews(views)
  }, [open, views])

  /**
   * Memoized set of existing view names for validation
   * Updates when local views change
   */
  const existingNames = useMemo(() => viewManagement.getExistingNames(localViews), [localViews, viewManagement])

  /**
   * Handles local view rename operations
   * Updates only local state without persisting changes
   */
  const handleLocalRename = useCallback((viewId: string, newName: string) => {
    setLocalViews(prev => prev.map(view => (view.id === viewId ? { ...view, name: newName } : view)))
  }, [])

  /**
   * Handles local view deletion
   * Updates only local state without persisting changes
   */
  const handleLocalDelete = useCallback((viewId: string) => {
    setLocalViews(prev => prev.filter(v => v.id !== viewId))
  }, [])

  // Initialize drag and drop functionality
  const { handleDragEnd, getItemId } = useDragAndDrop({
    items: localViews,
    onReorder: setLocalViews
  })

  /**
   * Determines if save button should be disabled
   * Checks for changes and validation errors
   */
  const isSaveDisabled =
    !viewManagement.hasViewListChanges(localViews, views) || viewManagement.hasViewErrors(localViews)

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content className="max-w-[410px]">
        <AlertDialog.Header>
          <AlertDialog.Title>Manage saved filters</AlertDialog.Title>
        </AlertDialog.Header>

        <div className="-mx-3.5 max-h-[320px] space-y-0.5 overflow-y-auto">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={localViews.map((_, index) => getItemId(index))}
              strategy={verticalListSortingStrategy}
            >
              {localViews.map((view, index) => (
                <SortableItem
                  key={`${getItemId(index)}-${view.id}`}
                  id={getItemId(index)}
                  view={view}
                  onRename={handleLocalRename}
                  onDelete={handleLocalDelete}
                  existingNames={existingNames}
                  validateViewNameChange={viewManagement.validateViewNameChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <AlertDialog.Footer>
          <Button
            variant="outline"
            onClick={() => {
              setLocalViews(views)
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Update views order first
              viewManagement.updateViewsOrder(viewManagement.prepareViewsForSave(localViews))

              // If all views were deleted, reset current view
              if (localViews.length === 0) {
                viewManagement.setCurrentView(null)
              }

              onOpenChange(false)
            }}
            disabled={isSaveDisabled}
          >
            Save
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
})

ManageViews.displayName = 'ManageViews'

export default ManageViews
