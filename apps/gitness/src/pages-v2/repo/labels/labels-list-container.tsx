import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteRepoLabelMutation, useDeleteSpaceLabelMutation } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ILabelType, LabelsListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useQueryState } from '../../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../../project/stores/labels-store'
import { useFullFillLabelStore } from './hooks/use-full-fill-label-store'

export const RepoLabelsList = () => {
  const { spaceId } = useParams<PathParams>()
  const routes = useRoutes()
  const navigate = useNavigate()

  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)

  const { page, setPage, labels: storeLabels, deleteLabel: deleteStoreLabel } = useLabelsStore()

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const { isLoading, space_ref, repo_ref } = useFullFillLabelStore({ queryPage, query })

  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { mutate: deleteRepoLabel, isLoading: isDeletingRepoLabel } = useDeleteRepoLabelMutation(
    {
      repo_ref: repo_ref ?? ''
    },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteStoreLabel(variables.key)
      }
    }
  )

  const { mutate: deleteSpaceLabel, isLoading: isDeletingSpaceLabel } = useDeleteSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteStoreLabel(variables.key)
      }
    }
  )

  const handleEditLabel = (label: ILabelType) => {
    label.scope === 0 ? navigate(`${label.key}`) : navigate(`${routes.toProjectLabels({ spaceId })}/${label.key}`)
  }

  const handleDeleteLabel = (key: string) => {
    const label = storeLabels.find(label => label.key === key)

    if (!label) return

    label?.scope === 0 ? deleteRepoLabel({ key }) : deleteSpaceLabel({ key })
  }

  return (
    <>
      <LabelsListPage
        useTranslationStore={useTranslationStore}
        useLabelsStore={useLabelsStore}
        createdIn={space_ref}
        handleEditLabel={handleEditLabel}
        handleDeleteLabel={handleOpenDeleteDialog}
        searchQuery={query}
        setSearchQuery={setQuery}
        isLoading={isLoading}
        isRepository
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingRepoLabel || isDeletingSpaceLabel}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
