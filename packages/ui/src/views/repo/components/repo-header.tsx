import { Skeleton, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  isLoading?: boolean
  className?: string
}

export const RepoHeader = ({ name, isPublic, isLoading, className }: RepoHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn('grid grid-cols-[auto,1fr] items-center gap-2 px-6 pb-2 pt-7', className)}>
      {isLoading && (
        <>
          <Skeleton className="h-[var(--cn-line-height-7-tight)] w-28" />
          <Skeleton className="h-6 w-14" />
        </>
      )}

      {!isLoading && (
        <>
          <Text className="font-heading-hero truncate" as="h2" color="primary">
            {name}
          </Text>
          <StatusBadge variant="outline" theme="success" className="min-w-fit rounded-full">
            {!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
          </StatusBadge>
        </>
      )}
    </div>
  )
}
