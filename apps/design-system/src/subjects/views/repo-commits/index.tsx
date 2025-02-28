import { noop, useTranslationStore } from '@utils/viewUtils'

import { BranchSelectorV2, RepoCommitsView as RepoCommitsUiView } from '@harnessio/ui/views'

import { repoCommitsStore } from './repo-commits-store'

export const RepoCommitsView = () => {
  return (
    <RepoCommitsUiView
      commitsList={repoCommitsStore.commits}
      isFetchingCommits={false}
      page={1}
      setPage={noop}
      xNextPage={2}
      xPrevPage={NaN}
      useTranslationStore={useTranslationStore}
      renderProp={() => (
        <BranchSelectorV2
          repoId="canary"
          spaceId="org"
          branchList={[]}
          tagList={[]}
          selectedBranchorTag={{ name: 'main', sha: 'sha' }}
          selectedBranch={{ name: 'main', sha: 'sha' }}
          onSelectBranch={noop}
          isBranchOnly={false}
          dynamicWidth={false}
          useTranslationStore={useTranslationStore}
          setSearchQuery={noop}
        />
      )}
    />
  )
}
