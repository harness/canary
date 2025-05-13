import { Skeleton, StatusBadge, Text } from '@/components'
import { cn } from '@/utils'
import { TranslationStore } from '@/views'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  isLoading?: boolean
  className?: string
  useTranslationStore: () => TranslationStore
}

export const RepoHeader = ({ name, isPublic, isLoading, className, useTranslationStore }: RepoHeaderProps) => {
  const { t } = useTranslationStore()

  return (
    <div className={cn('flex items-center gap-2 px-6 pb-2 pt-8', className)}>
      {isLoading && (
        <>
          <Skeleton className="h-[var(--cn-line-height-7-tight)] w-28" />
          <Skeleton className="h-6 w-14" />
        </>
      )}

      {!isLoading && (
        <>
          <Text className="font-heading-hero" as="h2" color="primary">
            {name}
          </Text>
          <StatusBadge variant="outline" theme="success" className="rounded-full">
            {!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
          </StatusBadge>
        </>
      )}
    </div>
  )
}
