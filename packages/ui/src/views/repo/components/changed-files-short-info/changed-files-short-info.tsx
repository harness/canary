import { useTranslation } from '@/context'
import { DiffFileEntry, TypesDiffStats } from '@/views'
import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Layout } from '@components/layout'
import { StatusBadge } from '@components/status-badge/status-badge'
import { Text } from '@components/text'
import { formatNumber } from '@utils/TimeUtils'

interface ChangedFilesShortInfoProps {
  diffData?: Partial<DiffFileEntry>[]
  diffStats?: TypesDiffStats | null
  goToDiff: (fileName: string) => void
}

export const ChangedFilesShortInfo = ({ diffData, diffStats, goToDiff }: ChangedFilesShortInfoProps) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu.Root>
      <Text variant="body-single-line-normal">
        {t('views:repo.components.commitDetailsDiffShowing', 'Showing')}{' '}
        <DropdownMenu.Trigger asChild>
          <Button variant="link" className="inline-flex h-auto p-0">
            {formatNumber(diffStats?.files_changed ?? 0)}{' '}
            {t('views:repo.components.commitDetailsDiffChangedFiles', 'changed files')}
          </Button>
        </DropdownMenu.Trigger>{' '}
        {t('views:repo.components.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions ?? 0)}{' '}
        {t('views:repo.components.commitDetailsDiffAdditionsAnd', 'additions and')}{' '}
        {formatNumber(diffStats?.deletions ?? 0)} {t('views:repo.components.commitDetailsDiffDeletions', 'deletions')}
      </Text>

      <DropdownMenu.Content className="max-h-[360px] max-w-[800px]" align="start">
        {diffData?.map(diff => (
          <DropdownMenu.IconItem
            key={diff.filePath}
            onClick={() => goToDiff(diff.filePath ?? '')}
            icon="page"
            title={diff.filePath}
            label={
              <Layout.Horizontal gap="2xs" align="center">
                {diff.addedLines != null && diff.addedLines > 0 && (
                  <StatusBadge variant="outline" size="sm" theme="success">
                    +{diff.addedLines}
                  </StatusBadge>
                )}
                {diff.deletedLines != null && diff.deletedLines > 0 && (
                  <StatusBadge variant="outline" size="sm" theme="danger">
                    -{diff.deletedLines}
                  </StatusBadge>
                )}
              </Layout.Horizontal>
            }
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
