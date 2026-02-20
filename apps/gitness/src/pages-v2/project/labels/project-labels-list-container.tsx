import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteSpaceLabelMutation } from '@harnessio/code-service-client'
import { DeleteAlertDialog, MessageTheme } from '@harnessio/ui/components'
import { ILabelType, LabelsListPage, SandboxLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../../framework/hooks/useMFEContext.ts'
import { useQueryState } from '../../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../../hooks/use-pagination-query-state-with-store'
import { PathParams } from '../../../RouteDefinitions.ts'
import { getScopedRuleUrl } from '../../../utils/rule-url-utils.ts'
import { getSpaceRefByScope } from '../../../utils/scope-url-utils.ts'
import { useLabelsStore } from '../stores/labels-store'
import { useFillLabelStoreWithProjectLabelValuesData } from './hooks/use-fill-label-store-with-project-label-values-data.ts'

export const ProjectLabelsList = () => {
  const navigate = useNavigate()
  const space_ref = useGetSpaceURLParam()

  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const { repoId, spaceId } = useParams<PathParams>()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier },
    routeUtils
  } = useMFEContext()

  const { page, setPage, deleteLabel: deleteStoreLabel, labels: storeLabels, pageSize } = useLabelsStore()

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const [query, setQuery] = useQueryState('query')

  // To fetch labels/values and set isLoading state at useLabelsStore
  useFillLabelStoreWithProjectLabelValuesData({ queryPage, query, pageSize })

  const handleOpenDeleteDialog = (identifier: string) => {
    resetDeleteMutation()
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const {
    mutate: deleteSpaceLabel,
    isLoading: isDeletingSpaceLabel,
    error,
    reset: resetDeleteMutation
  } = useDeleteSpaceLabelMutation(
    { space_ref: `${space_ref}/+` },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteStoreLabel(variables.key)
      }
    }
  )

  const handleEditLabel = (label: ILabelType) => {
    navigate(`${label.key}`)
  }

  const handleDeleteLabel = (identifier: string) => {
    const label = storeLabels.find(label => label.key === identifier)

    deleteSpaceLabel({ space_ref: `${getSpaceRefByScope(space_ref ?? '', label?.scope ?? 0)}/+`, key: identifier })
  }

  return (
    <SandboxLayout.Content>
      <LabelsListPage
        useLabelsStore={useLabelsStore}
        searchQuery={query}
        setSearchQuery={setQuery}
        labelsListViewProps={{ handleDeleteLabel: handleOpenDeleteDialog, handleEditLabel }}
        isRepository={space_ref?.includes('/')}
        toRepoLabelDetails={({ labelId, scope }: { labelId: string; scope: number }) => {
          getScopedRuleUrl({
            scope,
            identifier: labelId,
            settingSection: 'labels',
            toCODERule: routeUtils?.toCODERule,
            toCODEManageRepositories: routeUtils?.toCODEManageRepositories,
            accountId,
            orgIdentifier,
            projectIdentifier,
            repoId,
            spaceId
          })
          return ''
        }}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingSpaceLabel}
        error={error ? { type: MessageTheme.ERROR, message: error?.message ?? 'Unable to delete label' } : undefined}
      />
    </SandboxLayout.Content>
  )
}
