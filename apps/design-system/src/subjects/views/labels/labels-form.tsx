import { LabelsListStore } from '@subjects/stores/labels-store.tsx'
import { useTranslationStore } from '@utils/viewUtils.ts'

import { LabelFormPage } from '@harnessio/ui/views'

export const LabelsForm = () => {
  return (
    <LabelFormPage
      useLabelsStore={LabelsListStore.useLabelsStore}
      useTranslationStore={useTranslationStore}
      isSaving={false}
      onSubmit={() => {}}
      onFormCancel={() => {}}
      error={''}
    />
  )
}
