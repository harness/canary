import { noop } from '@utils/viewUtils'

import { RepoImportPage } from '@harnessio/views'

export const ImportRepoView = () => {
  return (
    <>
      <RepoImportPage onFormSubmit={noop} onFormCancel={noop} isLoading={false} apiErrorsValue={undefined} />
    </>
  )
}
