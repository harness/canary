import { DialogLabels, IDialogHandlers } from '@/views/user-management/components/dialogs'
import { useDialogs } from '@/views/user-management/providers/dialogs-provider'

export const useDialogHandlers = (handlers: IDialogHandlers) => {
  const { closeDialog } = useDialogs()

  return {
    handleCreateUser: async (...args: Parameters<typeof handlers.handleCreateUser>) => {
      const result = await handlers.handleCreateUser(...args)

      closeDialog(DialogLabels.CREATE_USER)

      return result
    },

    handleUpdateUser: async (...args: Parameters<typeof handlers.handleUpdateUser>) => {
      const result = await handlers.handleUpdateUser(...args)

      closeDialog(DialogLabels.EDIT_USER)

      return result
    },

    handleDeleteUser: async (...args: Parameters<typeof handlers.handleDeleteUser>) => {
      const result = await handlers.handleDeleteUser(...args)

      closeDialog(DialogLabels.DELETE_USER)

      return result
    },

    handleUpdateUserAdmin: async (...args: Parameters<typeof handlers.handleUpdateUserAdmin>) => {
      const result = await handlers.handleUpdateUserAdmin(...args)

      closeDialog(DialogLabels.TOGGLE_ADMIN)

      return result
    },

    handleUpdatePassword: async (...args: Parameters<typeof handlers.handleUpdatePassword>) => {
      const result = await handlers.handleUpdatePassword(...args)

      return result
    }
  }
}
