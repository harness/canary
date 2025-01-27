import { CreateUserDialog } from '@/views/user-management/components/dialogs/components/create-user'
import { DeleteUserDialog } from '@/views/user-management/components/dialogs/components/delete-user'
import { EditUserDialog } from '@/views/user-management/components/dialogs/components/edit-user'
import { RemoveAdminDialog } from '@/views/user-management/components/dialogs/components/remove-admin'
import { ResetPasswordDialog } from '@/views/user-management/components/dialogs/components/reset-password'
import { useDialogHandlers } from '@/views/user-management/components/dialogs/hooks'
import { DialogLabels, IDialogsProps } from '@/views/user-management/components/dialogs/types'
import { useDialogs } from '@/views/user-management/providers/dialogs-provider'

export const Dialogs = ({ handlers }: IDialogsProps) => {
  const { dialogsOpenState, closeDialog } = useDialogs()

  const { handleDeleteUser, handleUpdateUser, handleUpdatePassword, handleUpdateUserAdmin, handleCreateUser } =
    useDialogHandlers(handlers)

  return (
    <>
      <DeleteUserDialog
        open={dialogsOpenState[DialogLabels.DELETE_USER]}
        onClose={() => closeDialog(DialogLabels.DELETE_USER)}
        handleDeleteUser={handleDeleteUser}
      />
      <EditUserDialog
        open={dialogsOpenState[DialogLabels.EDIT_USER]}
        onClose={() => closeDialog(DialogLabels.EDIT_USER)}
        handleUpdateUser={handleUpdateUser}
      />
      <RemoveAdminDialog
        open={dialogsOpenState[DialogLabels.TOGGLE_ADMIN]}
        onClose={() => closeDialog(DialogLabels.TOGGLE_ADMIN)}
        handleUpdateUserAdmin={handleUpdateUserAdmin}
      />
      <ResetPasswordDialog
        open={dialogsOpenState[DialogLabels.RESET_PASSWORD]}
        onClose={() => closeDialog(DialogLabels.RESET_PASSWORD)}
        handleUpdatePassword={handleUpdatePassword}
      />
      <CreateUserDialog
        open={dialogsOpenState[DialogLabels.CREATE_USER]}
        onClose={() => closeDialog(DialogLabels.CREATE_USER)}
        handleCreateUser={handleCreateUser}
      />
    </>
  )
}
