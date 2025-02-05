import { noop, useTranslationStore } from '@utils/viewUtils'

import { ISpaceStore, ProjectSettingsGeneralPage } from '@harnessio/ui/views'

const useSpaceStore = (): ISpaceStore => ({
  space: null,
  isLoading: false,
  setSpace: noop,
  setIsLoading: noop
})

export const ProjectSettingsView = () => {
  return (
    <ProjectSettingsGeneralPage
      useSpaceStore={useSpaceStore}
      onFormSubmit={() => {}}
      isUpdating={false}
      isUpdateSuccess={false}
      updateError={null}
      setOpenDeleteDialog={() => {}}
      useTranslationStore={useTranslationStore}
    />
  )
}
