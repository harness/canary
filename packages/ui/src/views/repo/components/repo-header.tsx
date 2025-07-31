import { Alert, Favorite, Layout, Skeleton, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { formatDate } from '@/utils/TimeUtils'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  isArchived?: boolean
  isLoading?: boolean
  className?: string
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
  archivedDate?: number
}

export const RepoHeader = ({
  name,
  isPublic,
  isArchived,
  isLoading,
  className,
  isFavorite,
  onFavoriteToggle,
  archivedDate
}: RepoHeaderProps) => {
  const { t } = useTranslation()

  const formattedDate = archivedDate ? formatDate(archivedDate) : ''

  return (
    <Layout.Grid className={cn('cn-repo-header', className)} gapY="md">
      <Layout.Flex gap="3xs" justify="start" align="center">
        {isLoading ? (
          <>
            <Layout.Flex gap="xs" justify="start" align="center">
              <Skeleton className="bg-cn-background-0 h-[var(--cn-line-height-7-tight)] w-28" />
              <Skeleton className="bg-cn-background-0 h-6 w-14" />
            </Layout.Flex>
            <Skeleton className="bg-cn-background-0 h-6 w-14" />
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
    </Layout.Grid>
  )
}
