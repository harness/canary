import { Button, ListActions, SearchBox } from '@/components'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogData } from '@/views/user-management/components/dialogs/hooks'
import { useSearch } from '@/views/user-management/providers/search-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export const Actions = () => {
  const { useTranslationStore } = useUserManagementStore()

  const { t } = useTranslationStore()

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
        />
      </ListActions.Left>
      <ListActions.Right>
        <Button variant="default" onClick={() => handleDialogOpen(null, DialogLabels.CREATE_USER)}>
          {t('views:userManagement.newUserButton', 'New user')}
        </Button>
      </ListActions.Right>
    </ListActions.Root>
  )
}
