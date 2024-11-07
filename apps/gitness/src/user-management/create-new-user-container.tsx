import { useState } from 'react'
import {
  SandboxSettingsCreateNewUserPage,
  generateAlphaNumericHash,
  ResetPasswordDialog,
  NewUserFields
} from '@harnessio/playground'
import { AdminCreateUserRequestBody, useAdminCreateUserMutation } from '@harnessio/code-service-client'

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
      <SandboxSettingsCreateNewUserPage
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
