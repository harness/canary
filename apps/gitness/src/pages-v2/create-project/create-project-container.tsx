import { useNavigate } from 'react-router-dom'

import { OpenapiCreateSpaceRequest, useCreateSpaceMutation } from '@harnessio/code-service-client'
import { CreateProjectPage } from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export default function CreateProject() {
  const navigate = useNavigate()
  const { addSpaces } = useAppContext()

  // Set up the mutation hook with the form data
  const { mutate, isLoading, error } = useCreateSpaceMutation(
    {},
    {
      onSuccess: response => {
        const { body: project } = response
        addSpaces([project])
        //onSuccess in react-query has allowed 200-299
        navigate(`/${project?.identifier}/repos`)
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

  return (
    <CreateProjectPage
      onFormSubmit={handleFormSubmit}
      useTranslationStore={useTranslationStore}
      isLoading={isLoading}
      apiError={error?.message}
    />
  )
}
