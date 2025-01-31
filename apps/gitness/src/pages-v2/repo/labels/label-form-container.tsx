import { useNavigate, useParams } from 'react-router-dom'

import { useSaveRepoLabelMutation } from '@harnessio/code-service-client'
import { CreateLabelFormFields, LabelFormPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../../project/stores/labels-store'
import { useGetRepoLabelAndValuesData } from './hooks/use-get-repo-label-and-values-data'

export const RepoLabelFormContainer = () => {
  const routes = useRoutes()
  const { spaceId, repoId, labelId } = useParams<PathParams>()
  const navigate = useNavigate()

  const { isLoading: isDataLoading, repo_ref } = useGetRepoLabelAndValuesData({
    query: labelId,
    enabled: !!labelId
  })

  const {
    mutate,
    isLoading,
    error: createError
  } = useSaveRepoLabelMutation(
    {
      repo_ref
    },
    {
      onSuccess: () => {
        onFormCancel()
      }
    }
  )

  const onFormCancel = () => {
    navigate(routes.toRepoLabels({ spaceId, repoId }))
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
