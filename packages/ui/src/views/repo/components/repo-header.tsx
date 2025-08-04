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
    <div className={cn('cn-repo-header', className)}>
      <div className="grid grid-cols-[auto,1fr] items-center gap-2">
        {isLoading ? (
          <>
            <Skeleton className="bg-cn-background-0 h-[var(--cn-line-height-7-tight)] w-28" />
            <Skeleton className="bg-cn-background-0 h-6 w-14" />
          </>
        ) : (
          <Layout.Flex gap="xs" justify="start" align="center">
            <Text className="truncate" variant="heading-hero" as="h2">
              {name}
            </Text>
            <Layout.Flex align="center" gap="xs">
              <StatusBadge
                variant="outline"
                theme={!isPublic ? 'muted' : 'success'}
                className="min-w-fit rounded-full"
                size="md"
              >
                {!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
              </StatusBadge>
              {isArchived && (
                <StatusBadge variant="outline" theme="warning" className="min-w-fit rounded-full" size="md">
                  {t('views:repos.archived', 'Archived')}
                </StatusBadge>
              )}
              <Favorite isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
            </Layout.Flex>
          </Layout.Flex>
        )}
      </div>

      {isArchived && (
        <div className="mt-4">
          <Alert.Root theme="warning">
            <Alert.Description>
              {formattedDate
                ? t(
                    'views:repos.archivedBanner',
                    'This repository has been archived on {{date}}. It is now read-only.',
                    {
                      date: formattedDate
                    }
                  )
                : t('views:repos.archivedBannerNoDate', 'This repository has been archived. It is now read-only.')}
            </Alert.Description>
          </Alert.Root>
        </div>
      )}
    </div>
  )
}
