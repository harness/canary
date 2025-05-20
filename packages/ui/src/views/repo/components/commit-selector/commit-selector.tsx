import { FC, useMemo } from 'react'

import { Button, ButtonSizes, DropdownMenu, Icon, Text } from '@/components'
import { useTranslation } from '@/context'
import { CommitSelectorListItem } from '@/views'

import { CommitSelectorDropdown } from './commit-selector-dropdown'
import { ICommitSelectorStore } from './types'

interface CommitSelectorProps {
  buttonSize?: ButtonSizes
  onSelectCommit?: (commit: CommitSelectorListItem) => void
  repoId?: string
  spaceId?: string
  useRepoCommitStore: () => ICommitSelectorStore
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}
export const CommitSelector: FC<CommitSelectorProps> = ({
  useRepoCommitStore,
  buttonSize,
  onSelectCommit,
  repoId,
  spaceId,
  searchQuery,
  setSearchQuery
}) => {
  const { commits: commitList, selectedCommit } = useRepoCommitStore()
  const { t } = useTranslation()

  const finalList = useMemo(
    () => [
      { title: t('views:repos.allCommits'), sha: '' },
      ...(commitList
        ? commitList.map(commit => ({
            title: commit.title || 'Untitled Commit',
            sha: commit.sha || ''
          }))
        : [])
    ],
    [commitList, t]
  )
  const commitTitle = useMemo(() => {
    if (selectedCommit?.title) {
      return selectedCommit.title || ''
    }
    return t('views:repos.allCommits', 'All commits')
  }, [selectedCommit, t])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size={buttonSize}>
          <Text className="w-full text-cn-foreground-1" truncate align="left">
            {commitTitle}
          </Text>
          <Icon className="chevron-down text-icons-2" name="chevron-down" size={10} />
        </Button>
      </DropdownMenu.Trigger>
      <CommitSelectorDropdown
        commitList={finalList}
        onSelectCommit={onSelectCommit}
        selectedCommit={selectedCommit}
        repoId={repoId}
        spaceId={spaceId}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
    </DropdownMenu.Root>
  )
}
