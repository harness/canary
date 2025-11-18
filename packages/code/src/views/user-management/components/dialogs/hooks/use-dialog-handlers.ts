import { useCallback } from 'react'

import { IDataHandlers } from '@/views'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogs } from '@/views/user-management/providers/dialogs-provider'

export const useDialogHandlers = (handlers: IDataHandlers) => {
  const { closeDialog } = useDialogs()

  return {
    handleCreateUser: useCallback(
      async (...args: Parameters<typeof handlers.handleCreateUser>) => {
        const result = await handlers.handleCreateUser(...args)

        closeDialog(DialogLabels.CREATE_USER)

        return result
      },
      [closeDialog, handlers.handleCreateUser]
    ),

    handleUpdateUser: useCallback(
      async (...args: Parameters<typeof handlers.handleUpdateUser>) => {
        const result = await handlers.handleUpdateUser(...args)

        closeDialog(DialogLabels.EDIT_USER)

        return result
      },
      [closeDialog, handlers.handleUpdateUser]
    ),

    handleDeleteUser: useCallback(
      async (...args: Parameters<typeof handlers.handleDeleteUser>) => {
        const result = await handlers.handleDeleteUser(...args)

        closeDialog(DialogLabels.DELETE_USER)

        return result
      },
      [closeDialog, handlers.handleDeleteUser]
    ),

    handleUpdateUserAdmin: useCallback(
      async (...args: Parameters<typeof handlers.handleUpdateUserAdmin>) => {
        const result = await handlers.handleUpdateUserAdmin(...args)

        closeDialog(DialogLabels.TOGGLE_ADMIN)

        return result
      },
      [closeDialog, handlers.handleUpdateUserAdmin]
    ),

    handleUpdatePassword: useCallback(
      async (...args: Parameters<typeof handlers.handleUpdatePassword>) => {
        const result = await handlers.handleUpdatePassword(...args)

        return result
      },
      [closeDialog, handlers.handleUpdatePassword]
    )
  }
}
