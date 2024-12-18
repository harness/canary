import { useEffect, useState } from 'react'

import {
  GetUserErrorResponse,
  UpdateUserErrorResponse,
  UpdateUserRequestBody,
  useGetUserQuery,
  useUpdateUserMutation
} from '@harnessio/code-service-client'
import { PasswordFields, ProfileFields, SettingsAccountGeneralPage } from '@harnessio/ui/views'

import { useProfileSettingsStore } from './stores/profile-settings-store'

export const SettingsProfileGeneralPage: React.FC = () => {
  const { setUserData } = useProfileSettingsStore()
  const [apiError, setApiError] = useState<{ type: 'profile' | 'password'; message: string } | null>(null)

  const { data: { body: userData } = {}, isLoading: isLoadingUser } = useGetUserQuery(
    {},
    {
      onError: (error: GetUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'profile', message: message })
      }
    }
  )
  const updateUserMutation = useUpdateUserMutation(
    {},
    {
      onSuccess: ({ body: data }) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || ''
        })
      },
      onError: (error: UpdateUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'profile', message: message })
      }
    }
  )

  const updatePasswordMutation = useUpdateUserMutation(
    {},
    {
      onSuccess: ({ body: data }) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || ''
        })
      },
      onError: (error: UpdateUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'password', message: message })
      }
    }
  )

  const handleUpdateUser = (updatedUserData: Omit<ProfileFields, 'username'>) => {
    const updateUserBody: UpdateUserRequestBody = {
      display_name: updatedUserData.name,
      email: updatedUserData.email
    }
    updateUserMutation.mutate({
      body: updateUserBody
    })
  }

  const handleUpdatePassword = (updatedPasswordData: PasswordFields) => {
    if (updatedPasswordData.newPassword !== updatedPasswordData.confirmPassword) {
      setApiError({ type: 'password', message: 'Passwords do not match' })
      return
    }

    const updatePasswordBody: UpdateUserRequestBody = {
      password: updatedPasswordData.newPassword
    }
    updatePasswordMutation.mutate({
      body: updatePasswordBody
    })
  }

  useEffect(() => {
    if (userData) {
      setUserData({
        name: userData.display_name || '',
        username: userData.uid || '',
        email: userData.email || ''
      })
    }
  }, [userData, setUserData])

  return (
    <>
      <SettingsAccountGeneralPage
        useProfileSettingsStore={useProfileSettingsStore}
        isLoadingUser={isLoadingUser}
        isUpdatingUser={updateUserMutation.isLoading}
        isUpdatingPassword={updatePasswordMutation.isLoading}
        error={apiError}
        onUpdateUser={handleUpdateUser}
        onUpdatePassword={handleUpdatePassword}
        profileUpdateSuccess={updateUserMutation.isSuccess}
        passwordUpdateSuccess={updatePasswordMutation.isSuccess}
      />
    </>
  )
}
