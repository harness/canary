import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDeleteSpaceLabelMutation } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ILabelType, LabelsListPage } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useQueryState } from '../../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../../i18n/stores/i18n-store'
import { useLabelsStore } from '../stores/labels-store'
import { useFillLabelStoreWithProjectLabelValuesData } from './hooks/use-fill-label-store-with-project-label-values-data.ts'

export const ProjectLabelsList = () => {
  const navigate = useNavigate()
  const space_ref = useGetSpaceURLParam()

  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)

  const { page, setPage, deleteLabel: deleteStoreLabel } = useLabelsStore()

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const [query, setQuery] = useQueryState('query')

  // To fetch labels/values and set isLoading state at useLabelsStore
  useFillLabelStoreWithProjectLabelValuesData({ queryPage, query })

  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { mutate: deleteSpaceLabel, isLoading: isDeletingSpaceLabel } = useDeleteSpaceLabelMutation(
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
    deleteSpaceLabel({ key: identifier })
  }

  return (
    <>
      <LabelsListPage
        className="mx-auto max-w-[1040px]"
        useTranslationStore={useTranslationStore}
        useLabelsStore={useLabelsStore}
        createdIn={space_ref}
        searchQuery={query}
        setSearchQuery={setQuery}
        labelsListViewProps={{ handleDeleteLabel: handleOpenDeleteDialog, handleEditLabel }}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingSpaceLabel}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
