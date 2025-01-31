import { useNavigate, useParams } from 'react-router-dom'

import { useSaveSpaceLabelMutation } from '@harnessio/code-service-client'
import { CreateLabelFormFields, LabelFormPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../stores/labels-store'
import { useGetProjectLabelAndValuesData } from './hooks/use-get-project-label-and-values-data'

export const ProjectLabelFormContainer = () => {
  const routes = useRoutes()
  const { spaceId, labelId } = useParams<PathParams>()
  const navigate = useNavigate()

  const { isLoading: isDataLoading, space_ref } = useGetProjectLabelAndValuesData({
    query: labelId,
    enabled: !!labelId
  })

  const {
    mutate,
    isLoading,
    error: createError
  } = useSaveSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: () => {
        onFormCancel()
      }
    }
  )

  const onFormCancel = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routes.toProjectLabels({ spaceId }))
    }
  }

  const onSubmit = (data: CreateLabelFormFields) => {
    const { values, ...rest } = data

    mutate({
      body: {
        label: {
          ...rest
        },
        values
      }
    })
  }

  return (
    <LabelFormPage
      useLabelsStore={useLabelsStore}
      useTranslationStore={useTranslationStore}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onFormCancel={onFormCancel}
      error={createError?.message}
      isDataLoading={isDataLoading}
      labelId={labelId}
    />
  )
}
