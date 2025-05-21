import { useCallback, useState } from 'react'

import { noop } from '@utils/viewUtils'

import { IBranchSelectorStore, RepoBranchListView } from '@harnessio/ui/views'

import { repoBranchesStore } from './repo-branches-store'

export function RepoBranchesView() {
  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const useRepoBranchesStore = useCallback((): IBranchSelectorStore => repoBranchesStore, [])

  return (
    <RepoBranchListView
      isLoading={false}
      isCreatingBranch={false}
      onSubmit={async () => {}}
      useRepoBranchesStore={useRepoBranchesStore}
      isCreateBranchDialogOpen={isCreateBranchDialogOpen}
      setCreateBranchDialogOpen={setCreateBranchDialogOpen}
      searchQuery={''}
      setSearchQuery={noop}
      createBranchError={undefined}
      toPullRequest={() => ''}
      toBranchRules={() => ''}
      toPullRequestCompare={() => ''}
      onDeleteBranch={noop}
      searchBranches={[]}
      setCreateBranchSearchQuery={noop}
    />
  )
}
