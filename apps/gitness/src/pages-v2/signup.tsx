import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOnRegisterMutation } from '@harnessio/code-service-client'
import { SignUpData, SignUpPage } from '@harnessio/ui/views'

import { useRoutes } from '../framework/context/NavigationContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const SignUp: FC = () => {
  const routes = useRoutes()
  const navigate = useNavigate()

  const {
    mutate: register,
    isLoading,
    isSuccess,
    error
  } = useOnRegisterMutation({ queryParams: { include_cookie: true } })

  useEffect(() => {
    if (isSuccess) {
      navigate(routes.toProjectCreate())
    }
  }, [isSuccess])

  const handleSignUp = (data: SignUpData) => {
    register({
      body: {
        email: data.email,
        password: data.password,
        uid: data.userId,
        display_name: data.userId
      }
    })
  }

  return (
    <SignUpPage
      isLoading={isLoading}
      handleSignUp={handleSignUp}
      error={error?.message}
      useTranslationStore={useTranslationStore}
    />
  )
}
