import { noop } from '@utils/viewUtils'

import { RepoCreatePage } from '@harnessio/ui/views'

import { useRepoCreateStore } from './repo-create-store'

export const CreateRepoView = () => {
  const { gitIgnoreOptions, licenseOptions } = useRepoCreateStore()

  return (
    <RepoCreatePage
      onFormSubmit={noop}
      onFormCancel={noop}
      isLoading={false}
      isSuccess={false}
      gitIgnoreOptions={gitIgnoreOptions}
      licenseOptions={licenseOptions}
    />
  )
}
