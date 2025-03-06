import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOnLoginMutation } from '@harnessio/code-service-client'
import { SignInData, SignInPage } from '@harnessio/ui/views'

import { useRoutes } from '../framework/context/NavigationContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const SignIn: FC = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const {
    mutate: login,
    isLoading,
    error
  } = useOnLoginMutation(
    { queryParams: { include_cookie: true } },
    {
      onSuccess: () => navigate(routes.toHome()) // Redirect to Home page
    }
  )

  return (
    <SignInPage
      isLoading={isLoading}
      handleSignIn={(data: SignInData) => {
        login({
          body: {
            login_identifier: data.email,
            password: data.password
          }
        })
      }}
      error={error?.message}
      useTranslationStore={useTranslationStore}
    />
  )
}
