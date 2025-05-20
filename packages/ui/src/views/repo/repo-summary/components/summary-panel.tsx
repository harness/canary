import { FC } from 'react'

import { Button, CounterBadge, DropdownMenu, Icon, IconProps, Spacer, Tag, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'

import { EditRepoDetails } from './edit-repo-details-dialog'

interface DetailItem {
  id: string
  iconName: 'tube-sign' | 'open-pr' | 'tag' | 'branch' | IconProps['name']
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
                <Icon name="more-dots-fill" size={12} className="text-icons-3" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item className="flex items-center gap-1.5" onClick={() => setEditDialogOpen(true)}>
                <span>{description?.length ? 'Edit Description' : 'Add description'}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        {!!timestamp?.length && (
          <>
            <Spacer size={2} />
            <span className="text-2 text-cn-foreground-2">Created {timestamp}</span>
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
                <div className="cursor-pointer flex items-center gap-1.5">
                  <Icon name={item.iconName} size={14} className="fill-none text-cn-foreground-3" />
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

export default SummaryPanel
