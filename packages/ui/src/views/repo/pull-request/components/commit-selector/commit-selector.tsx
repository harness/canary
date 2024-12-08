import { FC, useMemo } from 'react'

import { Button, DropdownMenu, DropdownMenuTrigger, Icon, Text } from '@/components'
import { IBranchSelectorStore, TranslationStore, TypesCommit } from '@/views'

import { CommitSelectorListItem } from '../../types'
import { CommitSelectorDropdown } from './commit-selector-dropdown'

// import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface CommitSelectorProps {
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  buttonSize?: 'default' | 'sm'
  selectedCommit?: CommitSelectorListItem
  onSelectCommit?: (commit: CommitSelectorListItem) => void
  commitList?: TypesCommit[]
}
export const CommitSelector: FC<CommitSelectorProps> = ({
  useRepoBranchesStore,
  useTranslationStore,

  buttonSize = 'default',
  selectedCommit,
  onSelectCommit,
  commitList
}) => {
  const { repoId, spaceId } = useRepoBranchesStore()

  const { t } = useTranslationStore()

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
  }, [selectedCommit, t, onSelectCommit])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={
            'flex items-center gap-1.5 overflow-hidden px-3 data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1'
          }
          variant="outline"
          size={buttonSize}
        >
          <Text className="w-full text-foreground-8" truncate align="left">
            {commitTitle}
          </Text>
          <Icon className="chevron-down text-icons-2" name="chevron-down" size={10} />
        </Button>
      </DropdownMenuTrigger>
      <CommitSelectorDropdown
        commitList={finalList}
        onSelectCommit={onSelectCommit}
        selectedCommit={selectedCommit}
        repoId={repoId}
        spaceId={spaceId}
        useTranslationStore={useTranslationStore}
      />
    </DropdownMenu>
  )
}
