import { cn } from '@/utils'
import { TranslationStore } from '@/views'
import { Tag } from '@components/tag'

interface RepoHeaderProps {
  name: string
  isPublic: boolean
  className?: string
  useTranslationStore: () => TranslationStore
}

export const RepoHeader = ({ name, isPublic, className, useTranslationStore }: RepoHeaderProps) => {
  const { t } = useTranslationStore()

  return (
    <div className={cn('flex items-center gap-2 px-6 pb-2 pt-8', className)}>
      <h2 className="font-heading-section text-cn-foreground-1">{name}</h2>
      <Tag
        variant="outline"
        theme="green"
        value={!isPublic ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
        rounded
      />
    </div>
  )
}
