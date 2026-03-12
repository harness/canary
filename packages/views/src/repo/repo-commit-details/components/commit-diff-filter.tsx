import { DiffModeEnum } from '@git-diff-view/react'
import { ChangedFilesShortInfo, DiffFileEntry, TypesDiffStats } from '@views'

import { Button, DropdownMenu, IconV2, Layout } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

export const DiffModeOptions = [
  { name: 'Split', value: 'Split' },
  { name: 'Unified', value: 'Unified' }
]

export interface CommitDiffFilterProps {
  diffMode: DiffModeEnum
  setDiffMode: (mode: DiffModeEnum) => void
  diffData?: Partial<DiffFileEntry>[]
  diffStats?: TypesDiffStats | null
  goToDiff: (fileName: string) => void
}

export const CommitDiffFilter: React.FC<CommitDiffFilterProps> = ({
  diffMode,
  setDiffMode,
  diffData,
  diffStats,
  goToDiff
}) => {
  const { t } = useTranslation()

  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }

  return (
    <Layout.Horizontal align="center" gap="sm">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="group flex items-center gap-x-cn-2xs" asChild>
          <Button size="sm" variant="transparent">
            {diffMode === DiffModeEnum.Split ? t('views:pullRequests.split') : t('views:pullRequests.unified')}
            <IconV2 name="solid-arrow-down" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {DiffModeOptions.map(item => (
            <DropdownMenu.Item
              title={item.name}
              className={cn({
                'bg-cn-hover': diffMode === (item.value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
              })}
              key={item.value}
              onClick={() => handleDiffModeChange(item.value)}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <ChangedFilesShortInfo diffData={diffData} diffStats={diffStats} goToDiff={goToDiff} />
    </Layout.Horizontal>
  )
}
