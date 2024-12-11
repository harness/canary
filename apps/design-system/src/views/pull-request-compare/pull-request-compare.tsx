import { FC, useCallback } from 'react'

import { HeaderProps, PullRequestCompare, SandboxPullRequestCompareProps } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../utils.ts'
import { repoBranchListStore } from './repo-branch-store.ts'
import { repoCommitStore } from './repo-commit-store.ts'

const PullRequestCompareWrapper: FC<Partial<SandboxPullRequestCompareProps>> = props => {
  const useRepoBranchListStore = useCallback(
    () => ({
      ...repoBranchListStore,
      setPage: noop
    }),
    []
  )
  const useRepoCommitsListStore = useCallback(
    () => ({
      ...repoCommitStore,
      setPage: noop
    }),
    []
  )

  return (
    <PullRequestCompare
      onFormSubmit={noop}
      onFormDraftSubmit={noop}
      onFormCancel={noop}
      apiError={null}
      isSuccess={false}
      onSelectCommit={noop}
      selectBranch={noop}
      targetBranch={{ name: 'main', sha: 'sha' }}
      sourceBranch={{ name: 'main', sha: 'sha' }}
      diffData={[
        {
          text: 'bot.txt',
          data: 'diff --git a/bot.txt b/bot.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..0aa158abf5a4f0c5d2a5697866f14601881647b3\n--- /dev/null\n+++ b/bot.txt\n@@ -0,0 +1 @@\n+bot5555\n\\ No newline at end of file\n',
          title: 'bot.txt',
          lang: 'txt',
          addedLines: 1,
          removedLines: 0,
          blocks: [
            {
              lines: [
                {
                  content: '+bot5555',
                  type: 'insert',
                  newNumber: 1
                }
              ],
              oldStartLine: 0,
              oldStartLine2: null,
              newStartLine: 1,
              header: '@@ -0,0 +1 @@'
            }
          ]
        } as HeaderProps
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
      useRepoBranchesStore={useRepoBranchListStore}
      useRepoCommitsStore={useRepoCommitsListStore}
      searchCommitQuery={null}
      setSearchCommitQuery={noop}
      useTranslationStore={useTranslationsStore}
      isLoading={false}
      {...props}
    />
  )
}

export default PullRequestCompareWrapper
