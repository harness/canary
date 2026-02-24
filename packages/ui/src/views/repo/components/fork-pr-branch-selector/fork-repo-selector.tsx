import { FC, useState } from 'react'

import { Button, Command, IconV2, Popover, Text, type ButtonSizes } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'

export interface RepoOption {
  value: string
  label: string
  identifier: string
  isUpstream?: boolean
  defaultBranch?: string
}

interface ForkRepoSelectorProps {
  repos: RepoOption[]
  selectedRepo?: RepoOption
  onSelectRepo: (repo: RepoOption) => void
  prefix?: string
  className?: string
  disabled?: boolean
  buttonSize?: ButtonSizes
}

export const ForkRepoSelector: FC<ForkRepoSelectorProps> = ({
  repos,
  selectedRepo,
  onSelectRepo,
  prefix,
  className,
  disabled,
  buttonSize = 'md'
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleSelectRepo = (repo: RepoOption) => {
    onSelectRepo(repo)
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button className={cn('min-w-0', className)} variant="outline" size={buttonSize} disabled={disabled}>
          <IconV2 name="git-fork" size="sm" />
          {selectedRepo ? (
            <Text className="truncate">
              {prefix ? `${prefix}: ${selectedRepo.identifier}` : selectedRepo.identifier}
            </Text>
          ) : (
            <Text className="truncate">{t('views:repos.selectRepository', 'Select repository')}</Text>
          )}
          <IconV2 name="nav-arrow-down" size="xs" className="ml-auto" />
        </Button>
      </Popover.Trigger>
      <ForkRepoSelectorDropdown repos={repos} selectedRepo={selectedRepo} onSelectRepo={handleSelectRepo} />
    </Popover.Root>
  )
}

ForkRepoSelector.displayName = 'ForkRepoSelector'

interface ForkRepoSelectorDropdownProps {
  repos: RepoOption[]
  selectedRepo?: RepoOption
  onSelectRepo: (repo: RepoOption) => void
}

const ForkRepoSelectorDropdown: FC<ForkRepoSelectorDropdownProps> = ({ repos, selectedRepo, onSelectRepo }) => {
  const { t } = useTranslation()

  return (
    <Popover.Content
      hideArrow
      onOpenAutoFocus={e => e.preventDefault()}
      className="p-0"
      style={{ width: 'var(--radix-popover-trigger-width)', minWidth: '200px' }}
      align="start"
    >
      <Command.Root className="bg-transparent">
        <div className="px-cn-sm pb-cn-3xs pt-cn-sm">
          <Text variant="body-single-line-strong" color="foreground-1">
            {t('views:repos.switchRepositories', 'Switch repositories')}
          </Text>
        </div>

        <Command.List scrollAreaProps={{ className: 'max-h-[180px] p-cn-3xs' }}>
          {repos.map(repo => {
            const isSelected = selectedRepo?.value === repo.value

            return (
              <Command.Item
                className="gap-cn-sm py-cn-xs"
                onSelect={() => onSelectRepo(repo)}
                key={repo.value}
                value={repo.identifier}
                title={repo.identifier}
              >
                <div className="ml-cn-xs flex size-4 items-center">{isSelected && <IconV2 name="check" />}</div>
                <IconV2 name="git-fork" size="sm" className="text-icons-1" />
                <Text className="truncate">{repo.identifier}</Text>
              </Command.Item>
            )
          })}
        </Command.List>
      </Command.Root>
    </Popover.Content>
  )
}

ForkRepoSelectorDropdown.displayName = 'ForkRepoSelectorDropdown'
