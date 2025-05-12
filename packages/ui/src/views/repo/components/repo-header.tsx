import { Skeleton, Tag } from '@/components'
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
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-6 w-14" />
        </>
      )}

      {!isLoading && (
        <>
          <h2 className="font-heading-section text-cn-foreground-1">{name}</h2>
          <Tag
            variant="outline"
            theme="green"
            value={!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
            rounded
          />
        </>
      )}
    </div>
  )
}
