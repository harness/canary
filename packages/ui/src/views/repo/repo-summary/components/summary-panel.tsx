import { FC } from 'react'

import { Button, CounterBadge, DropdownMenu, IconPropsV2, IconV2, Spacer, Text, TimeAgoCard } from '@/components'
import { useRouterContext } from '@/context'

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
  saveDescription,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen
}) => {
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
          <Text variant="heading-base" as="h5">
            {title}
          </Text>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="xs" aria-label="More options" iconOnly>
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
            <Text as="span" color="foreground-3">
              Created <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
            </Text>
          </>
        )}

        {!!description?.length && (
          <>
            <Spacer size={3} />
            <Text className="border-cn-borders-4 w-full border-y py-1" lineClamp={6}>
              {description}
            </Text>
          </>
        )}
        <Spacer size={5} />

        <div className="flex flex-col gap-3">
          {details?.map(item => (
            <Link key={item.id} to={item.to}>
              <div className="flex cursor-pointer items-center gap-1.5">
                <IconV2 name={item.iconName} size="xs" className="text-cn-foreground-2" />
                <Text color="foreground-1">{item.name}</Text>
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
