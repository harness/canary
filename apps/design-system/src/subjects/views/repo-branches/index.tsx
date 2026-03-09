import { useCallback, useState } from 'react'

import { noop } from '@utils/viewUtils'

import { IBranchSelectorStore, RepoBranchListView } from '@harnessio/views'

import { repoBranchesStore } from './repo-branches-store'

export function RepoBranchesView() {
  const [_isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const useRepoBranchesStore = useCallback((): IBranchSelectorStore => repoBranchesStore, [])

  return (
    <RepoBranchListView
      isLoading={false}
      useRepoBranchesStore={useRepoBranchesStore}
      setCreateBranchDialogOpen={setCreateBranchDialogOpen}
      searchQuery={''}
      setSearchQuery={noop}
      toPullRequest={() => ''}
      toBranchRules={() => ''}
      toPullRequestCompare={() => ''}
      onDeleteBranch={noop}
    />
  )
}
