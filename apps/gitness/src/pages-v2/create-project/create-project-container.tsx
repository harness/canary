import { useNavigate } from 'react-router-dom'

import { useCreateSpaceMutation } from '@harnessio/code-service-client'
import { CreateProjectFormFields, CreateProjectPage } from '@harnessio/ui/views'

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

  const handleFormSubmit = (formData: CreateProjectFormFields) => {
    // Trigger the mutation with form data as the request body
    mutate({
      body: {
        identifier: formData.identifier
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
