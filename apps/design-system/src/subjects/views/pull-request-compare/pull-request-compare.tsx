import { FC, useCallback } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { BranchSelectorV2, PullRequestComparePage, PullRequestComparePageProps } from '@harnessio/ui/views'

import { repoCommitStore } from './repo-commit-store'

const PullRequestCompareWrapper: FC<Partial<PullRequestComparePageProps>> = props => {
  const useRepoCommitsListStore = useCallback(
    () => ({
      ...repoCommitStore,
      setPage: noop
    }),
    []
  )

  return (
    <PullRequestComparePage
      desc=""
      setDesc={noop}
      handleDeleteReviewer={noop}
      handleAddReviewer={noop}
      onFormSubmit={noop}
      onFormDraftSubmit={noop}
      onFormCancel={noop}
      apiError={null}
      isSuccess={false}
      onSelectCommit={noop}
      diffData={[
        {
          text: 'bot.txt',
          data: 'diff --git a/bot.txt b/bot.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..0aa158abf5a4f0c5d2a5697866f14601881647b3\n--- /dev/null\n+++ b/bot.txt\n@@ -0,0 +1 @@\n+bot5555\n\\ No newline at end of file\n',
          title: 'bot.txt',
          lang: 'txt',
          addedLines: 1,
          removedLines: 0
        }
      ]}
      diffStats={{
        additions: 0,
        commits: 1,
        deletions: 0,
        files_changed: 1
      }}
      isBranchSelected={true}
      setIsBranchSelected={noop}
      prBranchCombinationExists={null}
      useRepoCommitsStore={useRepoCommitsListStore}
      searchCommitQuery={null}
      setSearchCommitQuery={noop}
      useTranslationStore={useTranslationStore}
      isLoading={false}
      searchReviewersQuery=""
      setSearchReviewersQuery={noop}
      jumpToDiff=""
      setJumpToDiff={noop}
      branchSelectorRenderer={
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
      }
      {...props}
    />
  )
}

export default PullRequestCompareWrapper
