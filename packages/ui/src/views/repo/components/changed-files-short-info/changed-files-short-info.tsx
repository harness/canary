import { useTranslation } from '@/context'
import { DiffFileEntry, TypesDiffStats } from '@/views'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
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
          <Text color="accent" as="span" className="cursor-pointer">
            {formatNumber(diffStats?.files_changed ?? 0)}{' '}
            {t('views:repo.components.commitDetailsDiffChangedFiles', 'changed files')}
          </Text>
        </DropdownMenu.Trigger>{' '}
        {t('views:repo.components.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions ?? 0)}{' '}
        {t('views:repo.components.commitDetailsDiffAdditionsAnd', 'additions and')}{' '}
        {formatNumber(diffStats?.deletions ?? 0)} {t('views:repo.components.commitDetailsDiffDeletions', 'deletions')}
      </Text>

      <DropdownMenu.Content className="max-h-[360px] max-w-[800px]" align="start">
        {diffData?.map(diff => (
          <DropdownMenu.Item
            key={diff.filePath}
            onClick={() => goToDiff(diff.filePath ?? '')}
            title={
              <Layout.Horizontal align="center" className="min-w-0 gap-x-3">
                <Layout.Horizontal align="center" justify="start" className="min-w-0 flex-1 gap-x-1.5">
                  <IconV2 name="page" className="shrink-0 text-icons-1" />
                  <Text className="min-w-0 break-words">{diff.filePath}</Text>
                </Layout.Horizontal>
              </Layout.Horizontal>
            }
            label={
              <Layout.Horizontal className="shrink-0 text-2" gap="none">
                {diff.addedLines != null && diff.addedLines > 0 && (
                  <span className="text-cn-foreground-success">+{diff.addedLines}</span>
                )}
                {diff.addedLines != null &&
                  diff.addedLines > 0 &&
                  diff.deletedLines != null &&
                  diff.deletedLines > 0 && <span className="mx-1.5 h-3 w-px bg-cn-background-3" />}
                {diff.deletedLines != null && diff.deletedLines > 0 && (
                  <span className="text-cn-foreground-danger">-{diff.deletedLines}</span>
                )}
              </Layout.Horizontal>
            }
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
