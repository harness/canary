import { useState } from 'react'

import {
  GetUserErrorResponse,
  UpdateUserErrorResponse,
  UpdateUserRequestBody,
  useGetUserQuery,
  useUpdateUserMutation
} from '@harnessio/code-service-client'

import { PasswordFields, ProfileFields, SettingsAccountGeneralPage } from './profile-settings-general-page'
import { LanguagesEnum } from './types'

export const SettingsProfileGeneralPage: React.FC = () => {
  const [apiError, setApiError] = useState<{ type: 'profile' | 'password'; message: string } | null>(null)
  const localLanguage = localStorage.getItem('i18nextLng')

  const [userData, setUserData] = useState<ProfileFields>({
    name: '',
    username: '',
    email: '',
    language: LanguagesEnum.SYSTEM
  })

  const { isLoading: isLoadingUser } = useGetUserQuery(
    {},
    {
      onSuccess: ({ body: data }) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || '',
          language: localStorage.getItem('i18nextLngSystem')
            ? ('system' as LanguagesEnum)
            : (localLanguage as LanguagesEnum)
        })
      },
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
          email: data.email || '',
          language: localStorage.getItem('i18nextLngSystem')
            ? ('system' as LanguagesEnum)
            : (localLanguage as LanguagesEnum)
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
          email: data.email || '',
          language: localStorage.getItem('i18nextLngSystem')
            ? ('system' as LanguagesEnum)
            : (localLanguage as LanguagesEnum)
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

  return (
    <SettingsAccountGeneralPage
      userData={userData}
      isLoadingUser={isLoadingUser}
      isUpdatingUser={updateUserMutation.isLoading}
      isUpdatingPassword={updatePasswordMutation.isLoading}
      error={apiError}
      onUpdateUser={handleUpdateUser}
      onUpdatePassword={handleUpdatePassword}
      profileUpdateSuccess={updateUserMutation.isSuccess}
      passwordUpdateSuccess={updatePasswordMutation.isSuccess}
    />
  )
}
