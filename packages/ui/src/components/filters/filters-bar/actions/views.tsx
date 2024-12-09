import { FC, useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Input
} from '@/components'

import { FilterValue, SavedView, SortValue, ViewManagement } from '../../types'

/**
 * Views component handles the management of filter views including creation, updating, renaming and deletion.
 * It provides UI for saving current filter/sort configurations as named views and managing existing ones.
 */
interface ViewsProps {
  currentView: SavedView | null
  savedViews: SavedView[]
  viewManagement: ViewManagement & {
    activeFilters: FilterValue[]
    activeSorts: SortValue[]
  }
  hasChanges: boolean
}

const Views: FC<ViewsProps> = ({ currentView, viewManagement, hasChanges }) => {
  /**
   * Dialog states for creating new view and renaming existing one
   */
  const [isNewViewDialogOpen, setIsNewViewDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [nameError, setNameError] = useState('')

  /**
   * Effect handles real-time validation of view names
   * - For new views: checks if name already exists
   * - For renaming: checks if new name exists excluding current view
   * - Skips validation for empty names (handled by button disable state)
   */
  useEffect(() => {
    const trimmedName = newViewName.trim()

    if (!trimmedName) {
      setNameError('')
      return
    }

    if (isRenameDialogOpen && currentView) {
      if (trimmedName === currentView.name) {
        setNameError('')
        return
      }

      if (viewManagement.checkNameExists(trimmedName, currentView.id)) {
        setNameError('A view with this name already exists')
      } else {
        setNameError('')
      }
    } else {
      if (viewManagement.checkNameExists(trimmedName)) {
        setNameError('A view with this name already exists')
      } else {
        setNameError('')
      }
    }
  }, [newViewName, currentView, isRenameDialogOpen, viewManagement])

  /**
   * Resets error state when dialogs are opened/closed
   * to ensure clean state for next interaction
   */
  useEffect(() => {
    setNameError('')
  }, [isNewViewDialogOpen, isRenameDialogOpen])

  /**
   * Handles saving a new view with current filters and sorts
   * Validates name existence before saving
   * Closes dialog and resets form state after successful save
   */
  const handleSaveNewView = () => {
    const trimmedName = newViewName.trim()
    if (viewManagement.checkNameExists(trimmedName)) return

    viewManagement.saveView(trimmedName, viewManagement.activeFilters, viewManagement.activeSorts)
    setNewViewName('')
    setNameError('')
    setIsNewViewDialogOpen(false)
  }

  /**
   * Handles renaming an existing view
   * Validates new name doesn't conflict with other views
   * Updates view name and closes dialog on success
   */
  const handleRename = () => {
    if (!currentView) return

    const trimmedName = newViewName.trim()
    if (viewManagement.checkNameExists(trimmedName, currentView.id)) return

    viewManagement.renameView(currentView.id, trimmedName)
    setNewViewName('')
    setNameError('')
    setIsRenameDialogOpen(false)
  }

  /**
   * Updates current view with latest filter and sort configurations
   * Used when user modifies filters/sorts and wants to update existing view
   */
  const handleUpdateCurrentView = () => {
    if (!currentView) return

    const updatedView = {
      ...currentView,
      filters: viewManagement.activeFilters,
      sorts: viewManagement.activeSorts
    }
    viewManagement.updateView(updatedView)
  }

  /**
   * Validation flags for enabling/disabling save buttons
   * - canSaveNew: checks if new view name is valid and unique
   * - canRename: checks if new name is valid, different from current, and unique
   */
  const canSaveNew = newViewName.trim() !== '' && !viewManagement.checkNameExists(newViewName.trim())
  const canRename =
    currentView &&
    newViewName.trim() !== '' &&
    newViewName.trim() !== currentView.name &&
    !viewManagement.checkNameExists(newViewName.trim(), currentView.id)

  return (
    <>
      {!currentView ? (
        <Button
          className="flex items-center gap-x-1.5 px-0 text-14 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
          variant="custom"
          onClick={() => setIsNewViewDialogOpen(true)}
        >
          <Icon name="bookmark-add" size={12} />
          <span>Save view</span>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-x-1.5 px-0 text-14 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
              variant="custom"
            >
              <Icon name="bookmark-icon" size={12} />
              <span>Manage view</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            {hasChanges && (
              <>
                <DropdownMenuItem onSelect={handleUpdateCurrentView}>Update current view</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsNewViewDialogOpen(true)}>Save as new view</DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onSelect={() => {
                setNewViewName(currentView.name)
                setIsRenameDialogOpen(true)
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-foreground-danger"
              onSelect={() => viewManagement.deleteView(currentView.id)}
            >
              Delete view
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog open={isNewViewDialogOpen} onOpenChange={setIsNewViewDialogOpen}>
        <AlertDialogContent className="max-w-[460px]">
          <AlertDialogHeader>
            <AlertDialogTitle>New view</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription variant="secondary">
            You can save current configuration of the view. Manage and switch them through the{' '}
            <strong className="text-foreground-1">View</strong> dropdown.
          </AlertDialogDescription>

          <div className="pb-4 pt-3">
            <Input
              label="Name"
              placeholder="Enter view name"
              value={newViewName}
              size="md"
              error={nameError}
              onChange={e => {
                setNewViewName(e.target.value)
              }}
            />
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewViewDialogOpen(false)
                setNameError('')
                setNewViewName('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewView} disabled={!canSaveNew}>
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <AlertDialogContent className="max-w-[460px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Rename view</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-4">
            <Input
              label="Name"
              placeholder="Enter new name"
              value={newViewName}
              size="md"
              error={nameError}
              onChange={e => {
                setNewViewName(e.target.value)
              }}
            />
          </div>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameDialogOpen(false)
                setNameError('')
                setNewViewName('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!canRename}>
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Views
