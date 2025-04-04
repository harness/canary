import { useMemo } from 'react'

import { Avatar, CommitCopyActions, MoreActionsTooltip, NoData, SkeletonTable, Table } from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'
import { TranslationStore } from '@views/repo/repo-list/types'
import { CommitTagType, RepoTagsStore } from '@views/repo/repo-tags/types'

interface RepoTagsListProps {
  useTranslationStore: () => TranslationStore
  onDeleteTag: (tagName: string) => void
  useRepoTagsStore: () => RepoTagsStore
  toCommitDetails?: ({ sha }: { sha: string }) => string
  openCreateBranchDialog: () => void
  isLoading: boolean
  isDirtyList: boolean
  handleResetFiltersAndPages: () => void
  openCreateTagDialog: () => void
}

export const RepoTagsList: React.FC<RepoTagsListProps> = ({
  useTranslationStore,
  onDeleteTag,
  useRepoTagsStore,
  toCommitDetails,
  openCreateBranchDialog,
  isLoading,
  isDirtyList,
  handleResetFiltersAndPages,
  openCreateTagDialog
}) => {
  const { t } = useTranslationStore()
  const { tags: tagsList } = useRepoTagsStore()

  const getTableActions = useMemo(
    () => (tag: CommitTagType) => [
      {
        title: t('views:repos.createBranch', 'Create branch'),
        onClick: openCreateBranchDialog
      },
      {
        title: t('views:repos.viewFiles', 'View Files'),
        to: `../code/refs/tags/${tag.name}`
      },
      {
        isDanger: true,
        title: t('views:repos.deleteTag', 'Delete tag'),
        onClick: () => onDeleteTag(tag.name)
      }
    ],
    [t, openCreateBranchDialog, onDeleteTag]
  )

  const getCreationDate = (tag: CommitTagType) => {
    const date = new Date(tag.tagger?.when ?? 0)

    return timeAgo(date.getTime())
  }

  if (!isLoading && !tagsList?.length) {
    return (
      <div className={cn(!isDirtyList && 'flex items-center justify-center py-[204px]')}>
        <NoData
          iconName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-tags'}
          withBorder={isDirtyList}
          title={
            isDirtyList ? t('views:noData.noResults', 'No search results') : t('views:noData.noTags', 'No tags yet')
          }
          description={
            isDirtyList
              ? [
                  t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
                  t('views:noData.changeSearch', 'or search for a different keyword.')
                ]
              : [
                  t(
                    'views:noData.noTagsDescription',
                    "Your tags will appear here once they're created. Start creating tags to see your work organized."
                  )
                ]
          }
          textWrapperClassName={isDirtyList ? '' : 'max-w-[360px]'}
          primaryButton={
            isDirtyList
              ? {
                  label: t('views:noData.clearSearch', 'Clear search'),
                  onClick: handleResetFiltersAndPages
                }
              : {
                  label: t('views:noData.createNewTag', 'Create new tag.'),
                  onClick: openCreateTagDialog
                }
          }
        />
      </div>
    )
  }

  return (
    <Table.Root variant="asStackedList" tableClassName="table-fixed">
      <Table.Header>
        <Table.Row className="pointer-events-none select-none">
          <Table.Head className="w-[11%]">{t('views:repos.tag', 'Tag')}</Table.Head>
          <Table.Head className="w-[35%]">{t('views:repos.description', 'Description')}</Table.Head>
          <Table.Head className="w-[16%] min-w-[128px]">{t('views:repos.commit', 'Commit')}</Table.Head>
          <Table.Head className="w-[17%]">{t('views:repos.tagger', 'Tagger')}</Table.Head>
          <Table.Head className="w-[16%]">{t('views:repos.creationDate', 'Creation date')}</Table.Head>
          <Table.Head className="w-[5%] min-w-[32px]" />
        </Table.Row>
      </Table.Header>

      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body hasHighlightOnHover>
          {tagsList.map(tag => (
            <Table.Row key={tag.sha} className="min-h-[48px]">
              <Table.Cell className="text-foreground-1 w-[11%] truncate !pb-3 !pt-4">
                <div className="h-4 overflow-hidden truncate">{tag.name}</div>
              </Table.Cell>
              <Table.Cell className="text-foreground-3 w-[35%] !py-4">
                <div className="line-clamp-3 overflow-hidden break-all leading-4">{tag.message}</div>
              </Table.Cell>
              <Table.Cell className="text-foreground-3 w-[16%] min-w-[128px] !py-2.5">
                <div className="flex">
                  <CommitCopyActions sha={tag.sha} toCommitDetails={toCommitDetails} className="h-7" />
                </div>
              </Table.Cell>
              <Table.Cell className="text-foreground-3 w-[17%] !pb-3 !pt-4">
                <div className="flex items-center gap-2">
                  <Avatar.Root size="4.5" className="rounded-full text-white">
                    <Avatar.Fallback>{getInitials(tag.tagger?.identity.name || '')}</Avatar.Fallback>
                  </Avatar.Root>
                  <span>{tag.tagger?.identity.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell className="text-foreground-3 w-[16%] !pb-3 !pt-4">
                <div>{getCreationDate(tag)}</div>
              </Table.Cell>

              <Table.Cell className="w-[5%] !pb-1.5 !pt-2.5 text-right">
                <MoreActionsTooltip
                  isInTable
                  actions={getTableActions(tag).map(action => ({
                    ...action,
                    to: action.to?.replace('${tag.name}', tag.name)
                  }))}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      )}
    </Table.Root>
  )
}
