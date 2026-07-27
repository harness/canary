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
              label={
                onDeleteSavedFilter ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    iconOnly
                    ignoreIconOnlyTooltip
                    aria-label={t('component:filter.delete', 'Delete Filter')}
                    className="cn-saved-filter-delete"
                    onClick={event => {
                      event.stopPropagation()
                      openingDeleteDialogRef.current = true
                      setFilterToDelete(option)
                    }}
                  >
                    <IconV2 name="trash" size="sm" />
                  </Button>
                ) : undefined
              }
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
          onClose={() => setFilterToDelete(null)}
          deleteFn={filterId => {
            Promise.resolve(onDeleteSavedFilter(filterId)).then(() => {
              if (filterId === savedFilterValue) {
                resetFilters()
              }
              setFilterToDelete(null)
            })
          }}
          type="filter"
          identifier={filterToDelete?.value}
          deletionItemName={filterToDelete?.label}
        />
      )}
    </>
  )
}

export default SavedFilters
