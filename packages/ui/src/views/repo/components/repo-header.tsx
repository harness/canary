import { Favorite, Layout, Skeleton, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  isLoading?: boolean
  className?: string
  isFavorite?: boolean
  onFavoriteToggle: (isFavorite: boolean) => void
}

export const RepoHeader = ({ name, isPublic, isLoading, className, isFavorite, onFavoriteToggle }: RepoHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn('grid grid-cols-[auto,1fr] items-center gap-2 px-6 pb-2 pt-7', className)}>
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
          <Layout.Flex justify="start" align="center" gap="4xs">
            <StatusBadge variant="outline" theme={!isPublic ? 'muted' : 'success'} className="min-w-fit rounded-full">
              {!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
            </StatusBadge>
            <Favorite isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
          </Layout.Flex>
        </Layout.Flex>
      )}
    </div>
  )
}
