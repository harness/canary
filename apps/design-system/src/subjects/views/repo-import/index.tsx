import { noop, useTranslationsStore } from '@utils/viewUtils'

import { RepoImportPage } from '@harnessio/ui/views'

export const ImportRepoView = () => {
  return (
    <>
      <RepoImportPage
        onFormSubmit={noop}
        onFormCancel={noop}
        isLoading={false}
        apiErrorsValue={undefined}
        useTranslationStore={useTranslationsStore}
      />
    </>
  )
}
