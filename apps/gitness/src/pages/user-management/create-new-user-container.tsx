import { useState } from 'react'

import { AdminCreateUserRequestBody, useAdminCreateUserMutation } from '@harnessio/code-service-client'
import {
  generateAlphaNumericHash,
  NewUserFields,
  ResetPasswordDialog,
  SettingsCreateNewUserForm
} from '@harnessio/views'

export const CreateNewUserContainer = () => {
  const [password] = useState<string>(generateAlphaNumericHash(10))
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  const {
    mutate: createUser,
    error: createUserError,
    isLoading: creatingUser
  } = useAdminCreateUserMutation(
    {},
    {
      onSuccess: () => {
        setOpenPasswordDialog(true)
      }
    }
  )

  const handleCreateUser = (data: NewUserFields) => {
    const body: AdminCreateUserRequestBody = { ...data, password }
    createUser({ body })
  }

  return (
    <>
      <SettingsCreateNewUserForm
        handleCreateUser={handleCreateUser}
        isLoading={creatingUser}
        apiError={createUserError?.message || null}
      />
      <ResetPasswordDialog
        isOpen={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        password={password}
      />
    </>
  )
}
