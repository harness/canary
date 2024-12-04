import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUser, useOnLoginMutation } from '@harnessio/code-service-client'
import { SignInData, SignInPage } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

export const SignIn: FC = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useAppContext()
  const {
    mutate: login,
    isLoading,
    error
  } = useOnLoginMutation(
    { queryParams: { include_cookie: true } },
    {
      onSuccess: () => {
        getUser({})
          .then(response => {
            setCurrentUser(response.body)
          })
          .catch(_e => {
            // Ignore/toast error
          })
        navigate('/') // Redirect to Home page
      }
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
    />
  )
}
