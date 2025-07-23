import { FC } from 'react'

import { Button, CounterBadge, DropdownMenu, IconPropsV2, IconV2, Spacer, Tag, Text, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

import { EditRepoDetails } from './edit-repo-details-dialog'

interface DetailItem {
  id: string
  iconName: 'git-commit' | 'git-pull-request' | 'tag' | 'git-branch' | NonNullable<IconPropsV2['name']>
  name: string
  count: number
  to: string
}

interface SummaryPanelProps {
  title: string
  details: DetailItem[]
  timestamp?: string
  description?: string
  is_public?: boolean
  saveDescription: (description: string) => void
  updateRepoError?: string
  isEditDialogOpen: boolean
  setEditDialogOpen: (value: boolean) => void
}

const SummaryPanel: FC<SummaryPanelProps> = ({
  title,
  details,
  timestamp,
  description = '',
  is_public,
  saveDescription,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen
}) => {
  const { t } = useTranslation()
  const onClose = () => {
    setEditDialogOpen(false)
  }
  const onSave = (description: string) => {
    saveDescription(description)
  }

  const { Link } = useRouterContext()
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full items-center justify-between">
          <span className="truncate text-4 font-medium">{title}</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" aria-label="More options">
                <IconV2 name="more-horizontal" size="2xs" className="text-icons-3" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                onClick={() => setEditDialogOpen(true)}
                title={<span>{description?.length ? 'Edit Description' : 'Add description'}</span>}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        {!!timestamp?.length && (
          <>
            <Spacer size={2} />
            <Text as="span">
              Created <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
            </Text>
          </>
        )}
        <Spacer size={3} />
        <Tag
          rounded
          theme={!is_public ? 'gray' : 'green'}
          value={!is_public ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
        />
        {!!description?.length && (
          <>
            <Spacer size={3} />
            <span className="border-cn-borders-4 line-clamp-6 w-full border-y py-1 text-2 text-cn-foreground-2">
              {description}
            </span>
          </>
        )}
        <Spacer size={5} />

        <div className="flex flex-col gap-3">
          {details &&
            details.map(item => (
              <Link key={item.id} to={item.to}>
                <div className="flex cursor-pointer items-center gap-1.5">
                  <IconV2 name={item.iconName} size="xs" className="fill-none text-cn-foreground-3" />
                  <Text>{item.name}</Text>
                  <CounterBadge>{item.count}</CounterBadge>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <EditRepoDetails
        showEditRepoDetails={isEditDialogOpen}
        description={description}
        onSave={onSave}
        onClose={onClose}
        updateRepoError={updateRepoError}
      />
    </>
  )
}

SummaryPanel.displayName = 'SummaryPanel'

export default SummaryPanel
