import { FC, useEffect, useState } from 'react'

import { updateUser, UpdateUserErrorResponse } from '@harnessio/code-service-client'
import {
  PasswordFields,
  ProfileFields,
  ProfileSettingsErrorType,
  SettingsAccountGeneralPage
} from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext.tsx'
import { useProfileSettingsStore } from './stores/profile-settings-store'

export const SettingsProfileGeneralPage: FC = () => {
  const { currentUser, updateUserProfile, isLoadingUser, isUpdatingUser, updateUserError } = useAppContext()
  const { setUserData } = useProfileSettingsStore()
  const [isProfileUpdated, setIsProfileUpdated] = useState(false)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [updatePasswordError, setPasswordError] = useState<{
    type: ProfileSettingsErrorType
    message: string
  } | null>(null)

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    setIsUpdatingPassword(true)
    setPasswordError(null)
    try {
      await updateUser({ body: { password: newPassword } })
    } catch (error) {
      const typedError = error as UpdateUserErrorResponse
      setPasswordError({
        type: ProfileSettingsErrorType.PASSWORD,
        message: typedError.message || 'An unknown update password error occurred.'
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleUpdateUser = (updatedUserData: Omit<ProfileFields, 'username'>) => {
    updateUserProfile({
      display_name: updatedUserData.name,
      email: updatedUserData.email
    }).then(() => {
      setIsProfileUpdated(true)
    })
  }

  const handleUpdateUserPassword = (updatedPasswordData: PasswordFields) => {
    if (updatedPasswordData.newPassword !== updatedPasswordData.confirmPassword) {
      setPasswordError({ type: ProfileSettingsErrorType.PASSWORD, message: 'Passwords do not match' })
      return
    }

    updateUserPassword(updatedPasswordData.newPassword).then(() => {
      setIsPasswordUpdated(true)
    })
  }

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.display_name || '',
        username: currentUser.uid || '',
        email: currentUser.email || ''
      })
    }
  }, [currentUser, setUserData])

  return (
    <>
      <SettingsAccountGeneralPage
        useProfileSettingsStore={useProfileSettingsStore}
        isLoadingUser={isLoadingUser}
        isUpdatingUser={isUpdatingUser}
        isUpdatingPassword={isUpdatingPassword}
        error={updateUserError || updatePasswordError}
        onUpdateUser={handleUpdateUser}
        onUpdatePassword={handleUpdateUserPassword}
        profileUpdateSuccess={isProfileUpdated}
        passwordUpdateSuccess={isPasswordUpdated}
      />
    </>
  )
}
