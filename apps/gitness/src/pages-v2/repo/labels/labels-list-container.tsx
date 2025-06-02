import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteRepoLabelMutation, useDeleteSpaceLabelMutation } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ILabelType, LabelsListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useQueryState } from '../../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../../hooks/use-pagination-query-state-with-store'
import { PathParams } from '../../../RouteDefinitions'
import { useLabelsStore } from '../../project/stores/labels-store'
import { usePopulateLabelStore } from './hooks/use-populate-label-store.ts'

export const RepoLabelsList = () => {
  const { spaceId } = useParams<PathParams>()
  const routes = useRoutes()
  const navigate = useNavigate()

  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)

  const { page, setPage, labels: storeLabels, deleteLabel: deleteStoreLabel } = useLabelsStore()

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const { space_ref, repo_ref } = usePopulateLabelStore({ queryPage, query })

  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { mutate: deleteRepoLabel, isLoading: isDeletingRepoLabel } = useDeleteRepoLabelMutation(
    { repo_ref: repo_ref ?? '' },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteStoreLabel(variables.key)
      }
    }
  )

  const { mutate: deleteSpaceLabel, isLoading: isDeletingSpaceLabel } = useDeleteSpaceLabelMutation(
    { space_ref: space_ref ?? '' },
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
        className="max-w-[772px] px-0"
        useLabelsStore={useLabelsStore}
        createdIn={space_ref}
        searchQuery={query}
        setSearchQuery={setQuery}
        isRepository
        labelsListViewProps={{ widthType: 'small', handleDeleteLabel: handleOpenDeleteDialog, handleEditLabel }}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingRepoLabel || isDeletingSpaceLabel}
      />
    </>
  )
}
