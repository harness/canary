import { useNavigate, useParams } from 'react-router-dom'

import { useSaveRepoLabelMutation } from '@harnessio/code-service-client'
import { CreateLabelFormFields, LabelFormPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../../project/stores/labels-store'
import { useFullFillLabelStore } from './hooks/use-full-fill-label-store'

export const RepoLabelFormContainer = () => {
  const routes = useRoutes()
  const { spaceId, repoId, labelId } = useParams<PathParams>()
  const navigate = useNavigate()

  const { repo_ref } = useFullFillLabelStore({ query: labelId, enabled: !!labelId })

  const onFormCancel = () => navigate(routes.toRepoLabels({ spaceId, repoId }))

  const {
    mutate,
    isLoading: isSaving,
    error: createError
  } = useSaveRepoLabelMutation({ repo_ref }, { onSuccess: onFormCancel })

  const onSubmit = (data: CreateLabelFormFields) => {
    const { values, ...rest } = data

    mutate({ body: { label: { ...rest }, values } })
  }

  return (
    <LabelFormPage
      className="w-[570px] px-0"
      useLabelsStore={useLabelsStore}
      useTranslationStore={useTranslationStore}
      isSaving={isSaving}
      onSubmit={onSubmit}
      onFormCancel={onFormCancel}
      error={createError?.message}
      labelId={labelId}
    />
  )
}
