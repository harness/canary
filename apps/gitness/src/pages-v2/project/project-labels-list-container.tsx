import { useState } from 'react'

import {
  DefineSpaceLabelRequestBody,
  useDefineSpaceLabelMutation,
  useListSpaceLabelsQuery
} from '@harnessio/code-service-client'
import { CreateLabelDialog, CreateLabelFormFields, ProjectLabelsListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectLabelsList = () => {
  const space_ref = useGetSpaceURLParam()
  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)

  const { data: { body: labels } = {}, refetch: refetchLabels } = useListSpaceLabelsQuery({
    space_ref: space_ref ?? '',
    queryParams: { page: 1, limit: 100 }
  })

  const {
    mutate: defineSpaceLabel,
    isLoading: isCreatingLabel,
    error
  } = useDefineSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: () => {
        setOpenCreateLabelDialog(false)
        refetchLabels()
      }
    }
  )

  const handleLabelCreate = (data: CreateLabelFormFields) => {
    defineSpaceLabel({
      body: {
        key: data.name,
        color: data.color,
        description: data.description
      }
    })
  }

  return (
    <>
      <ProjectLabelsListView
        openAlertDeleteDialog={() => {}}
        useTranslationStore={useTranslationStore}
        labels={labels}
        space_ref={space_ref}
        openCreateLabelDialog={() => setOpenCreateLabelDialog(true)}
      />
      <CreateLabelDialog
        open={openCreateLabelDialog}
        onClose={() => setOpenCreateLabelDialog(false)}
        onSubmit={handleLabelCreate}
        useTranslationStore={useTranslationStore}
        isCreatingLabel={isCreatingLabel}
        error={error?.message ?? ''}
      />
    </>
  )
}
