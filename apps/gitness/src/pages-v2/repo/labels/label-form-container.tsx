import { useNavigate } from 'react-router-dom'

import { useSaveRepoLabelMutation } from '@harnessio/code-service-client'
import { useRouterContext } from '@harnessio/ui/context'
import { CreateLabelFormFields, LabelFormPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../../project/stores/labels-store'
import { usePopulateLabelStore } from './hooks/use-populate-label-store'

export const RepoLabelFormContainer = () => {
  const routes = useRoutes()
  const { useParams } = useRouterContext()
  const { repoId, labelId } = useParams<PathParams>()
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()

  const { repo_ref } = usePopulateLabelStore({ query: labelId, enabled: !!labelId })

  const onFormCancel = () => navigate(routes.toRepoLabels({ spaceId, repoId }))

  const {
    mutate: saveRepoLabel,
    isLoading: isSaving,
    error: createError
  } = useSaveRepoLabelMutation({ repo_ref }, { onSuccess: onFormCancel })

  const onSubmit = (data: CreateLabelFormFields) => {
    const { values, ...rest } = data

    saveRepoLabel({ body: { label: { ...rest }, values } })
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
