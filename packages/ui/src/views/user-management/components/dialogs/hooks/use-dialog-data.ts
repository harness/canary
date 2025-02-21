import { generateAlphaNumericHash } from '@/utils/utils'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogs } from '@/views/user-management/providers/dialogs-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { UsersProps } from '@/views/user-management/types'

export const useDialogData = () => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { setUser, setPassword, setGeteneratePassword } = useAdminListUsersStore()

  const { openDialog } = useDialogs()

  const prepareDialogData = (user: UsersProps | null, dialogType: DialogLabels) => {
    if (user) setUser(user)

    if (dialogType === DialogLabels.RESET_PASSWORD) {
      setGeteneratePassword(false)
      setPassword(generateAlphaNumericHash(10))

      return
    }

    if (dialogType === DialogLabels.CREATE_USER) {
      setGeteneratePassword(true)
      setPassword(generateAlphaNumericHash(10))

      return
    }
  }

  const handleDialogOpen = (user: UsersProps | null, dialogType: DialogLabels) => {
    prepareDialogData(user, dialogType)
    openDialog(dialogType)
  }

  return {
    handleDialogOpen
  }
}
