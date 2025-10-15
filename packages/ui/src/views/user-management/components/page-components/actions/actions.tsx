import { Button, Dialog, IconV2, ListActions, SearchBox } from '@/components'
import { useTranslation } from '@/context'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogData } from '@/views/user-management/components/dialogs/hooks/use-dialog-data'
import { useSearch } from '@/views/user-management/providers/search-provider'

export const Actions = () => {
  const { t } = useTranslation()

  const { searchInput, handleInputChange } = useSearch()

  const { handleDialogOpen } = useDialogData()

  return (
    <ListActions.Root>
      <ListActions.Left>
        <SearchBox.Root
          className="h-8 max-w-[320px]"
          placeholder={t('views:userManagement.searchPlaceholder', 'Search')}
          value={searchInput || ''}
          handleChange={handleInputChange}
          autoFocus
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
}
