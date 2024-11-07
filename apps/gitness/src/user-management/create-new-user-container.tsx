import { useState } from 'react'
import { SandboxSettingsCreateNewUserPage, generateAlphaNumericHash, ResetPasswordDialog } from '@harnessio/playground'
import { AdminCreateUserRequestBody, useAdminCreateUserMutation } from '@harnessio/code-service-client'

export const CreateNewUserContainer = () => {
  const [password] = useState<string>(generateAlphaNumericHash(10))
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  const { mutate: createUser } = useAdminCreateUserMutation(
    {},
    {
      onSuccess: () => {
        setOpenPasswordDialog(true)
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const handleCreateUser = (data: any) => {
    const body: AdminCreateUserRequestBody = { ...data, password }
    createUser({ body })
  }

  return (
    <>
      <SandboxSettingsCreateNewUserPage handleCreateUser={handleCreateUser} />
      {openPasswordDialog && <ResetPasswordDialog onClose={() => setOpenPasswordDialog(false)} password={password} />}
    </>
  )
}
