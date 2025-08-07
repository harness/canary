import { FC } from 'react'

import {
  ActionData,
  Avatar,
  CommitCopyActions,
  MoreActionsTooltip,
  NoData,
  Skeleton,
  Table,
  Tag,
  Text,
  TimeAgoCard
} from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorListItem, CommitTagType, RepoTagsStore } from '@/views'

interface RepoTagsListProps {
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
  useRepoTagsStore,
  toCommitDetails,
  isLoading,
  isDirtyList = false,
  onResetFiltersAndPages,
  onOpenCreateTagDialog,
  onDeleteTag,
  onOpenCreateBranchDialog
}) => {
  const { t } = useTranslation()
  const { tags: tagsList } = useRepoTagsStore()

  const getTableActions = (tag: CommitTagType): ActionData[] => [
    {
      iconName: 'git-branch',
      title: t('views:repos.createBranch', 'Create branch'),
      onClick: () => onOpenCreateBranchDialog(tag)
    },
    {
      iconName: 'folder',
      title: t('views:repos.viewFiles', 'View Files'),
      to: `../files/refs/tags/${tag.name}`
    },
    {
      iconName: 'trash',
      isDanger: true,
      title: t('views:repos.deleteTag', 'Delete tag'),
      onClick: () => onDeleteTag(tag.name)
    }
  ]

  if (!isLoading && !tagsList?.length) {
    return (
      <NoData
        imageName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-tags'}
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
                label: t('views:noData.createNewTag', 'Create tag'),
                onClick: onOpenCreateTagDialog
              }
        }
      />
    )
  }

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={5} />
  }

  return (
    <Table.Root className="[&_td]:py-3.5" tableClassName="table-fixed" disableHighlightOnHover>
      <Table.Header>
        <Table.Row className="pointer-events-none select-none">
          <Table.Head className="w-[17%]">{t('views:repos.tag', 'Tag')}</Table.Head>
          <Table.Head className="w-[30%]">{t('views:repos.description', 'Description')}</Table.Head>
          <Table.Head className="w-[15%]">{t('views:repos.commit', 'Commit')}</Table.Head>
          <Table.Head className="w-[15%]">{t('views:repos.tagger', 'Tagger')}</Table.Head>
          <Table.Head className="w-[16%]">{t('views:repos.creationDate', 'Creation date')}</Table.Head>
          <Table.Head className="w-[7%]" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tagsList.map(tag => (
          <Table.Row key={tag.sha}>
            <Table.Cell>
              <Tag value={tag.name} theme="violet" size="md" variant="secondary" showCopyButton />
            </Table.Cell>
            <Table.Cell>
              <Text variant="body-normal" className="line-clamp-3">
                {tag?.message}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <CommitCopyActions sha={tag.commit?.sha ?? ''} toCommitDetails={toCommitDetails} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                {tag.tagger?.identity.name ? (
                  <>
                    <Avatar name={tag.tagger?.identity.name} size="sm" rounded />
                    <Text variant="body-normal" className="block" truncate>
                      {tag.tagger?.identity.name}
                    </Text>
                  </>
                ) : null}
              </div>
            </Table.Cell>
            <Table.Cell>
              {tag.tagger?.when ? (
                <TimeAgoCard
                  timestamp={new Date(tag.tagger?.when).getTime()}
                  dateTimeFormatOptions={{ dateStyle: 'medium' }}
                  textProps={{ variant: 'body-normal' }}
                />
              ) : null}
            </Table.Cell>
            <Table.Cell className="w-[46px] text-right">
              <MoreActionsTooltip
                actions={getTableActions(tag).map(action => ({
                  ...action,
                  to: action?.to?.replace('${tag.name}', tag.name)
                }))}
                iconName="more-horizontal"
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
