import { FC } from 'react'

import {
  Button,
  CounterBadge,
  DropdownMenu,
  IconPropsV2,
  IconV2,
  Layout,
  Separator,
  Text,
  TimeAgoCard
} from '@/components'
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
      <Layout.Grid gapY="lg" className="pr-3">
        <Layout.Grid gapX="xs" justify="between" flow="column">
          <Layout.Grid gapY="2xs">
            <Text variant="heading-base" as="h5">
              {title}
            </Text>

            {!!timestamp?.length && (
              <Text as="span" color="foreground-3">
                Created <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
              </Text>
            )}
          </Layout.Grid>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="xs" aria-label="More options" iconOnly>
                <IconV2 name="more-horizontal" size="2xs" className="text-icons-3" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                onClick={() => setEditDialogOpen(true)}
                title={
                  description?.length
                    ? t('views:repos.summary.summaryPanel.editDescription', 'Edit Description')
                    : t('views:repos.summary.summaryPanel.addDescription', 'Add Description')
                }
              />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Layout.Grid>

        {!!description?.length && (
          <Layout.Grid gapY="sm">
            <Separator />
            <Text variant="body-normal" lineClamp={6} color="foreground-1">
              {description}
            </Text>
            <Separator />
          </Layout.Grid>
        )}

        <Layout.Grid gapY="sm">
          {details?.map(item => (
            <Link key={item.id} to={item.to}>
              <Layout.Flex className="cursor-pointer gap-1.5" align="center" gap="2xs">
                <IconV2 name={item.iconName} size="xs" className="text-cn-foreground-2" />
                <Text color="foreground-1">{item.name}</Text>
                <CounterBadge>{item.count}</CounterBadge>
              </Layout.Flex>
            </Link>
          ))}
        </Layout.Grid>
      </Layout.Grid>
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
