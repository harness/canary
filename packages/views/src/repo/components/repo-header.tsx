import { Alert, Button, Favorite, IconV2, Layout, Skeleton, StatusBadge, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn, formatDate } from '@harnessio/ui/utils'

import { RepositoryType } from '../repo.types'
import { ForkedFrom } from './forked-from'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  isArchived?: boolean
  isLinked?: boolean
  isLoading?: boolean
  className?: string
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
  onSyncLinked?: () => void
  isSyncing?: boolean
  archivedDate?: number
  upstream?: RepositoryType['upstream']
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

export const RepoHeader = ({
  name,
  isPublic,
  isArchived,
  isLinked,
  isLoading,
  className,
  isFavorite,
  onFavoriteToggle,
  onSyncLinked,
  isSyncing,
  archivedDate,
  upstream,
  toUpstreamRepo
}: RepoHeaderProps) => {
  const { t } = useTranslation()

  const formattedDate = archivedDate ? formatDate(archivedDate) : ''

  return (
    <Layout.Grid className={cn('cn-repo-header', className)} gapY="md">
      <Layout.Flex direction="column" gap="3xs">
        <Layout.Flex justify="start" align="center">
          {isLoading ? (
            <>
              <Layout.Flex gap="xs" justify="start" align="center">
                <Skeleton.Box className="h-[var(--cn-line-height-7-tight)] w-28" />
                <Skeleton.Box className="h-6 w-14" />
              </Layout.Flex>
              <Skeleton.Box className="h-6 w-14" />
            </>
          ) : (
            <>
              <Layout.Flex gap="xs" justify="start" align="center">
                <Text className="truncate" variant="heading-hero" as="h2">
                  {name}
                </Text>

                <StatusBadge variant="outline" theme={!isPublic ? 'muted' : 'success'} size="md">
                  {!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
                </StatusBadge>

                {isArchived && (
                  <StatusBadge variant="outline" theme="warning" size="md">
                    {t('views:repos.archived', 'Archived')}
                  </StatusBadge>
                )}
              </Layout.Flex>

              <Favorite isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
            </>
          )}
        </Layout.Flex>

        {upstream && <ForkedFrom upstream={upstream} toUpstreamRepo={toUpstreamRepo} />}
      </Layout.Flex>

      {isArchived && (
        <Alert.Root theme="warning">
          <Alert.Description>
            {formattedDate
              ? t('views:repos.archivedBanner', 'This repository has been archived on {{date}}. It is now read-only.', {
                  date: formattedDate
                })
              : t('views:repos.archivedBannerNoDate', 'This repository has been archived. It is now read-only.')}
          </Alert.Description>
        </Alert.Root>
      )}

      {isLinked && (
        <Alert.Root theme="info" className="items-center bg-transparent border border-current/30">
          <Alert.Description className="flex flex-1 items-center justify-between gap-x-3">
            <span>
              {t(
                'views:repos.linkedBanner',
                'This repository is linked from an external source. Content is synced automatically and cannot be edited directly.'
              )}
            </span>
            {onSyncLinked && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                tooltipProps={{
                  content: isSyncing
                    ? t('views:repos.link.syncing', 'Syncing…')
                    : t('views:repos.link.sync', 'Sync now')
                }}
                onClick={onSyncLinked}
                disabled={isSyncing}
                className="shrink-0"
              >
                <IconV2 name="refresh" className={isSyncing ? 'animate-spin' : ''} />
              </Button>
            )}
          </Alert.Description>
        </Alert.Root>
      )}
    </Layout.Grid>
  )
}
