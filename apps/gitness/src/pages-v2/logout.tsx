import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOpLogoutMutation } from '@harnessio/code-service-client'

export const Logout: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: logout, isSuccess } = useOpLogoutMutation({})

  useEffect(() => {
    if (isSuccess) {
      navigate('/signin') // Redirect to sign-in page
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    logout({})
  }, [logout])

  return 'Redirecting...'
}
