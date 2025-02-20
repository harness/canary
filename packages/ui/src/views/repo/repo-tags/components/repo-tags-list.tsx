import { CommitCopyActions, MoreActionsTooltip, SkeletonTable, Table } from '@/components'
import { formatDate } from '@utils/utils'
import { TranslationStore } from '@views/repo/repo-list/types'

import { RepoTagsStore } from '../types'

interface RepoTagsListProps {
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  onDeleteTag: (tagName: string) => void
  useRepoTagsStore: () => RepoTagsStore
  toCommitDetails?: ({ sha }: { sha: string }) => string
}
export const RepoTagsList: React.FC<RepoTagsListProps> = ({
  useTranslationStore,
  isLoading,
  onDeleteTag,
  useRepoTagsStore,
  toCommitDetails
}) => {
  const { t } = useTranslationStore()
  const { tags: tagsList } = useRepoTagsStore()

  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-2/5">{t('views:repos.tag', 'Tag')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:repos.commit', 'Commit')}</Table.Head>
          <Table.Head className="w-1/5">{t('views:repos.date', 'Date')}</Table.Head>
          <Table.Head className="w-1/5" />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={10} countColumns={4} />
      ) : (
        <Table.Body>
          {tagsList.map(tag => {
            return (
              <Table.Row key={tag.sha}>
                <Table.Cell className="content-center">{tag.name}</Table.Cell>
                <Table.Cell className="content-center p-0">
                  <div className="max-w-[130px]">
                    <CommitCopyActions sha={tag.sha} toCommitDetails={toCommitDetails} />
                  </div>
                </Table.Cell>
                <Table.Cell className="content-center">{formatDate(tag.tagger?.when ?? 0)}</Table.Cell>

                <Table.Cell className="text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        title: t('views:repos.createBranch', 'Create branch')
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
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      )}
    </Table.Root>
  )
}
