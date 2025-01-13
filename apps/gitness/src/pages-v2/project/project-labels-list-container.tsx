import { useGetSpaceQuery, useListSpaceLabelsQuery } from '@harnessio/code-service-client'
import { CreateLabelDialog, ProjectLabelsListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

export const ProjectLabelsList = () => {
  const space_ref = useGetSpaceURLParam()
  console.log('repo_ref', space_ref)

  const { data: { body: labels } = {} } = useListSpaceLabelsQuery({
    space_ref: space_ref ?? '',
    queryParams: { page: 1, limit: 100 }
  })

  return (
    <>
      <ProjectLabelsListView
        openAlertDeleteDialog={() => {}}
        useTranslationStore={useTranslationStore}
        labels={labels}
        space_ref={space_ref}
      />
      <CreateLabelDialog
        open={true}
        onClose={() => {}}
        onSubmit={() => {}}
        useTranslationStore={useTranslationStore}
        isCreatingLabel={false}
        error={''}
      />
    </>
  )
}
