import { LabelsListStore } from '@subjects/stores/labels-store.tsx'
import { useTranslationsStore } from '@utils/viewUtils.ts'

import { LabelFormPage } from '@harnessio/ui/views'

export const LabelsForm = () => {
  return (
    <LabelFormPage
      useLabelsStore={LabelsListStore.useLabelsStore}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      onSubmit={() => {}}
      onFormCancel={() => {}}
      error={''}
      isDataLoading={false}
    />
  )
}
