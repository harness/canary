import { FC } from 'react'

import { Avatar, CommitCopyActions, MoreActionsTooltip, NoData, SkeletonTable, Table, Text } from '@/components'
import { timeAgo } from '@/utils'
import { BranchSelectorListItem, CommitTagType, RepoTagsStore, TranslationStore } from '@/views'

interface RepoTagsListProps {
  useTranslationStore: () => TranslationStore
  onDeleteTag: (tagName: string) => void
  useRepoTagsStore: () => RepoTagsStore
  toCommitDetails?: ({ sha }: { sha: string }) => string
  onOpenCreateBranchDialog: (selectedTagInList: BranchSelectorListItem) => void
  isLoading?: boolean
  isDirtyList?: boolean
  onResetFiltersAndPages: () => void
  onOpenCreateTagDialog: () => void
}

export const RepoTagsList: FC<RepoTagsListProps> = ({
  useTranslationStore,
  useRepoTagsStore,
  toCommitDetails,
  isLoading,
  isDirtyList = false,
  onResetFiltersAndPages,
  onOpenCreateTagDialog,
  onDeleteTag,
  onOpenCreateBranchDialog
}) => {
  const { t } = useTranslationStore()
  const { tags: tagsList } = useRepoTagsStore()

  const getTableActions = (tag: CommitTagType) => [
    {
      title: t('views:repos.createBranch', 'Create branch'),
      onClick: () => onOpenCreateBranchDialog(tag)
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
  ]

  const getCreationDate = (tag: CommitTagType) => {
    const date = new Date(tag.tagger?.when ?? 0)

    return timeAgo(date.getTime())
  }

  if (!isLoading && !tagsList?.length) {
    return (
      <NoData
        iconName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-tags'}
        withBorder={isDirtyList}
        title={isDirtyList ? t('views:noData.noResults', 'No search results') : t('views:noData.noTags', 'No tags yet')}
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
                onClick: onResetFiltersAndPages
              }
            : {
                label: t('views:noData.createNewTag', 'Create new tag.'),
                onClick: onOpenCreateTagDialog
              }
        }
      />
    )
  }

  if (isLoading) {
    return <SkeletonTable countRows={12} countColumns={5} />
  }

  return (
    <Table.Root className="[&_td]:py-3.5" tableClassName="table-fixed" variant="asStackedList">
      <Table.Header>
        <Table.Row className="pointer-events-none select-none">
          <Table.Head className="w-[12%]">{t('views:repos.tag', 'Tag')}</Table.Head>
          <Table.Head className="w-[35%]">{t('views:repos.description', 'Description')}</Table.Head>
          <Table.Head className="w-[15%]">{t('views:repos.commit', 'Commit')}</Table.Head>
          <Table.Head className="w-[15%]">{t('views:repos.tagger', 'Tagger')}</Table.Head>
          <Table.Head className="w-[16%]">{t('views:repos.creationDate', 'Creation date')}</Table.Head>
          <Table.Head className="w-[7%]" />
        </Table.Row>
      </Table.Header>

      <Table.Body hasHighlightOnHover>
        {tagsList.map(tag => (
          <Table.Row key={tag.sha}>
            <Table.Cell>
              <Text className="block leading-snug" truncate title={tag.name}>
                {tag.name}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color="tertiary" className="line-clamp-3 break-all leading-snug">
                {tag?.message}
              </Text>
            </Table.Cell>
            <Table.Cell className="!py-2.5">
              <CommitCopyActions sha={tag.sha} toCommitDetails={toCommitDetails} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                {tag.tagger?.identity.name ? (
                  <>
                    <Avatar name={tag.tagger?.identity.name} size="sm" rounded />
                    <Text color="tertiary" className="block leading-none" truncate>
                      {tag.tagger?.identity.name}
                    </Text>
                  </>
                ) : null}
              </div>
            </Table.Cell>
            <Table.Cell>
              <Text color="tertiary" className="leading-snug">
                {tag.tagger?.when ? getCreationDate(tag) : ''}
              </Text>
            </Table.Cell>
            <Table.Cell className="w-[46px] !py-2.5 text-right">
              <MoreActionsTooltip
                isInTable
                actions={getTableActions(tag).map(action => ({
                  ...action,
                  to: action?.to?.replace('${tag.name}', tag.name)
                }))}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
