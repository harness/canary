import { useEffect, useRef, useState } from 'react'

import { Button, DeleteAlertDialog, DropdownMenu, IconV2, Text } from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'

import { useFiltersContext } from '../Filters'

export interface SavedFiltersProps {
  options: { value: string; label: string }[]
  savedFilterKey?: string
  onDeleteSavedFilter?: (filterId: string) => Promise<void> | void
}

export function SavedFilters({ options, savedFilterKey, onDeleteSavedFilter }: SavedFiltersProps) {
  const { t } = useTranslation()
  const { applySavedFilter, resetFilters } = useFiltersContext()
  const { location } = useRouterContext()
  const openingDeleteDialogRef = useRef(false)

  const searchParams = new URLSearchParams(location.search)
  const savedFilterValue = (savedFilterKey && searchParams.get(savedFilterKey)) ?? ''
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }>()
  const [filterToDelete, setFilterToDelete] = useState<{ value: string; label: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<{ message: string } | null>(null)

  const handleCloseDeleteDialog = () => {
    setFilterToDelete(null)
    setDeleteError(null)
    setIsDeleting(false)
  }

  const openDeleteDialog = (option: { value: string; label: string }) => {
    openingDeleteDialogRef.current = true
    setDeleteError(null)
    setFilterToDelete(option)
  }

  const handleDeleteSavedFilter = (filterId: string) => {
    if (!onDeleteSavedFilter) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      Promise.resolve(onDeleteSavedFilter(filterId))
        .then(() => {
          if (filterId === savedFilterValue) {
            resetFilters()
          }
          handleCloseDeleteDialog()
        })
        .catch(error => {
          setDeleteError({
            message:
              error instanceof Error
                ? error.message
                : t('component:filter.deleteSavedFilterFailed', 'Failed to delete filter')
          })
        })
        .finally(() => {
          setIsDeleting(false)
        })
    } catch (error) {
      setDeleteError({
        message:
          error instanceof Error
            ? error.message
            : t('component:filter.deleteSavedFilterFailed', 'Failed to delete filter')
      })
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(
        options.find(option => option.value === savedFilterValue) ?? {
          value: savedFilterValue,
          label: savedFilterValue
        }
      )
    }
  }, [options, savedFilterValue])

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="md" variant="ghost" className="min-w-0 max-w-fit flex-1">
            <IconV2 name="filter" />
            <Text truncate>{selectedOption?.label || 'Saved filters'}</Text>
            <IconV2 name="nav-arrow-down" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" className="cn-saved-filters-dropdown min-w-56">
          {options.map(option => (
            <DropdownMenu.Item
              key={option.value}
              title={option.label}
              checkmark={option.value === selectedOption?.value}
              aria-keyshortcuts={onDeleteSavedFilter ? 'Delete' : undefined}
              label={
                onDeleteSavedFilter ? (
                  <span
                    aria-hidden="true"
                    className="cn-saved-filter-delete inline-flex cursor-pointer items-center"
                    onClick={event => {
                      event.stopPropagation()
                      openDeleteDialog(option)
                    }}
                  >
                    <IconV2 name="trash" size="sm" />
                  </span>
                ) : undefined
              }
              onKeyDown={event => {
                if (onDeleteSavedFilter && event.key === 'Delete') {
                  event.preventDefault()
                  event.stopPropagation()
                  openDeleteDialog(option)
                }
              }}
              onSelect={event => {
                if (openingDeleteDialogRef.current) {
                  event.preventDefault()
                  openingDeleteDialogRef.current = false
                  return
                }

                applySavedFilter(option.value)
                setSelectedOption(option)
              }}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {onDeleteSavedFilter && (
        <DeleteAlertDialog
          open={filterToDelete !== null}
          title={t('component:filter.delete', 'Delete Filter')}
          deleteConfirmText={t('component:entity.delete', 'Delete')}
          onClose={handleCloseDeleteDialog}
          isLoading={isDeleting}
          error={deleteError}
          deleteFn={handleDeleteSavedFilter}
          type="filter"
          identifier={filterToDelete?.value}
          deletionItemName={filterToDelete?.label}
        />
      )}
    </>
  )
}

export default SavedFilters
