import { FC, useEffect, useState } from 'react'

import { AlertDialog, Button, DropdownMenu, Icon, Input } from '@/components'

import { FilterValue, SavedView, SortValue, ViewManagement } from '../../types'

/**
 * Views component handles the management of filter views including creation, updating, renaming and deletion.
 * It provides UI for saving current filter/sort configurations as named views and managing existing ones.
 */
interface ViewsProps {
  currentView: SavedView | null
  savedViews: SavedView[]
  viewManagement: Pick<ViewManagement, 'checkNameExists' | 'saveView' | 'updateView' | 'deleteView' | 'renameView'> & {
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
          className="flex items-center gap-x-1.5 px-0 text-14 text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1"
          variant="ghost"
          onClick={() => setIsNewViewDialogOpen(true)}
        >
          <Icon name="bookmark-add" size={12} />
          <span>Save view</span>
        </Button>
      ) : (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              className="flex items-center gap-x-1.5 px-0 text-14 text-cn-foreground-2 transition-colors duration-200 hover:text-cn-foreground-1"
              variant="ghost"
            >
              <Icon name="bookmark-icon" size={12} />
              <span>Manage view</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-48" align="end">
            {hasChanges && (
              <>
                <DropdownMenu.Item onSelect={handleUpdateCurrentView}>Update current view</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setIsNewViewDialogOpen(true)}>Save as new view</DropdownMenu.Item>
              </>
            )}
            <DropdownMenu.Item
              onSelect={() => {
                setNewViewName(currentView.name)
                setIsRenameDialogOpen(true)
              }}
            >
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="text-cn-foreground-danger"
              onSelect={() => viewManagement.deleteView(currentView.id)}
            >
              Delete view
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      <AlertDialog.Root open={isNewViewDialogOpen} onOpenChange={setIsNewViewDialogOpen}>
        <AlertDialog.Content className="max-w-[460px]">
          <AlertDialog.Header>
            <AlertDialog.Title>New view</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Description variant="secondary">
            You can save current configuration of the view. Manage and switch them through the{' '}
            <strong className="text-cn-foreground-1">View</strong> dropdown.
          </AlertDialog.Description>

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
          <AlertDialog.Footer>
            <Button
              variant="surface"
              theme="muted"
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
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <AlertDialog.Content className="max-w-[460px]">
          <AlertDialog.Header>
            <AlertDialog.Title>Rename view</AlertDialog.Title>
          </AlertDialog.Header>

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

          <AlertDialog.Footer>
            <Button
              variant="surface"
              theme="muted"
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
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export default Views
