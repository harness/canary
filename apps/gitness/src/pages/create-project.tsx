import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CreateSpaceErrorResponse,
  OpenapiCreateSpaceRequest,
  useCreateSpaceMutation
} from '@harnessio/code-service-client'
import { CreateProjectPage } from '@harnessio/views'

import { useAppContext } from '../framework/context/AppContext'

export default function CreateProject() {
  const navigate = useNavigate()
  const { addSpaces } = useAppContext()
  const [apiError, setApiError] = useState<string | null>(null)

  // Set up the mutation hook with the form data
  const { mutate, isLoading } = useCreateSpaceMutation(
    {},
    {
      onSuccess: response => {
        const { body: project } = response
        setApiError(null)
        addSpaces([project])
        //onSuccess in react-query has allowed 200-299
        navigate(`/spaces/${project?.identifier}/repos`)
      },
      onError: (error: CreateSpaceErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError(message)
      }
    }
  )

  const handleFormSubmit = (formData: OpenapiCreateSpaceRequest) => {
    // Trigger the mutation with form data as the request body
    mutate({
      body: {
        identifier: formData.identifier || '',
        description: formData.description || '',
        is_public: formData.is_public ?? false,
        parent_ref: formData.parent_ref || ''
      }
    })
  }

  return <CreateProjectPage onFormSubmit={handleFormSubmit} isLoading={isLoading} apiError={apiError} />
}
