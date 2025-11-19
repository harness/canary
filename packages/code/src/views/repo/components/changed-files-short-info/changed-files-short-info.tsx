import { DiffFileEntry, TypesDiffStats } from '@/views'

import { Button, DropdownMenu, Layout, StatusBadge, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { formatNumber } from '@harnessio/ui/utils'

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
            icon="empty-page"
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
