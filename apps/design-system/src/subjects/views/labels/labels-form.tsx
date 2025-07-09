import { LabelsListStore } from '@subjects/stores/labels-store.tsx'

import { LabelFormPage } from '@harnessio/ui/views'

export const LabelsForm = () => {
  return (
    <LabelFormPage
      useLabelsStore={LabelsListStore.useLabelsStore}
      isSaving={false}
      onSubmit={() => {}}
      onFormCancel={() => {}}
      error={''}
    />
  )
}
