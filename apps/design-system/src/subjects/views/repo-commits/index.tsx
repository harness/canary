import { useCallback, useState } from 'react'

import { noop, useTranslationsStore } from '@utils/viewUtils'

import { BranchSelectorTab, IBranchSelectorStore, RepoCommitsView as RepoCommitsUiView } from '@harnessio/ui/views'

import { repoFilesStore } from '../repo-files/components/repo-files-store'
import { repoCommitsStore } from './repo-commits-store'

export const RepoCommitsView = () => {
  const [branchTagQuery, setBranchTagQuery] = useState('')

  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoFilesStore.branchSelectorStore,
      selectedRefType: BranchSelectorTab.BRANCHES,
      setSelectedBranchTag: noop,
      setSelectedRefType: noop,
      xNextPage: 0,
      xPrevPage: 0,
      page: 1,
      setPage: noop,
      defaultBranch: '',
      branchList: [],
      setTagList: noop,
      setSpaceIdAndRepoId: noop,
      setBranchList: noop,
      setDefaultBranch: noop,
      setPaginationFromHeaders: noop
    }),
    []
  )

  return (
    <RepoCommitsUiView
      commitsList={repoCommitsStore.commits}
      isFetchingCommits={false}
      page={1}
      setPage={noop}
      xNextPage={2}
      xPrevPage={NaN}
      selectBranchOrTag={noop}
      useRepoBranchesStore={useRepoBranchesStore}
      useTranslationStore={useTranslationsStore}
      searchQuery={branchTagQuery}
      setSearchQuery={setBranchTagQuery}
      commitsPath=""
    />
  )
}
