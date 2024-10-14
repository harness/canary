import React from 'react'
import { SignUpPage, SignUpDataProps } from '@harnessio/playground'
import { useOnRegisterMutation } from '@harnessio/code-service-client'
import useToken from '../framework/hooks/useToken'
import { useNavigate } from 'react-router-dom'

export const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const { setToken } = useToken()

  const {
    mutate: register,
    isLoading,
    error
  } = useOnRegisterMutation(
    { queryParams: { include_cookie: true } },
    {
      onSuccess: data => {
        if (data?.access_token) {
          setToken(data.access_token)
          navigate('/')
        }
      }
    }
  )

  const handleSignUp = (data: SignUpDataProps) => {
    register({
      body: {
        email: data.email,
        password: data.password,
        uid: data.userId,
        display_name: data.userId
      }
    })
  }

  return <SignUpPage isLoading={isLoading} handleSignUp={handleSignUp} error={error?.message} />
}
