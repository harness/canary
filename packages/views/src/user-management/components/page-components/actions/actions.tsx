import { forwardRef } from 'react'

import { Button, Dialog, IconV2, ListActions, SearchInput } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { DialogLabels } from '@views/user-management/components/dialogs'
import { useDialogData } from '@views/user-management/components/dialogs/hooks/use-dialog-data'

interface ActionProps {
  searchQuery: string | null
  handleSearchChange: (val: string) => void
}

export const Actions = forwardRef<HTMLInputElement, ActionProps>(({ searchQuery, handleSearchChange }, ref) => {
  const { t } = useTranslation()

  const { handleDialogOpen } = useDialogData()

  return (
    <ListActions.Root>
      <ListActions.Left>
        <SearchInput
          id="search"
          defaultValue={searchQuery ?? ''}
          inputContainerClassName="w-80"
          onChange={handleSearchChange}
          autoFocus
          ref={ref}
        />
      </ListActions.Left>
      <ListActions.Right>
        <Dialog.Trigger>
          <Button onClick={() => handleDialogOpen(null, DialogLabels.CREATE_USER)}>
            <IconV2 name="plus" />
            {t('views:userManagement.newUserButton', 'Create User')}
          </Button>
        </Dialog.Trigger>
      </ListActions.Right>
    </ListActions.Root>
  )
})
Actions.displayName = 'Actions'
