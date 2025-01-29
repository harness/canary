import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOpLogoutMutation } from '@harnessio/code-service-client'

import { useRoutes } from '../framework/context/NavigationContext'

export const Logout: React.FC = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { mutate: logout, isSuccess } = useOpLogoutMutation({})

  useEffect(() => {
    if (isSuccess) {
      navigate(routes.toSignIn()) // Redirect to sign-in page
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    logout({})
  }, [logout])

  return <div>Redirecting...</div>
}
