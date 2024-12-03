import { Avatar, AvatarFallback, AvatarImage, CommitCopyActions, StackedList, Text } from '@/components'
import { LatestFileTypes, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'

const TopTitle = ({ user, lastCommitMessage }: LatestFileTypes) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="6">
        <AvatarImage src={user?.avatarUrl || ''} />
        <AvatarFallback>
          <Text size={0} color="tertiaryBackground">
            {getInitials(user?.name || '')}
          </Text>
        </AvatarFallback>
      </Avatar>
      <Text size={2} weight="normal" color="tertiaryBackground" wrap="nowrap">
        {user?.name}
      </Text>
      <Text size={2} weight="normal" color="primary" className="line-clamp-1">
        {lastCommitMessage}
      </Text>
    </div>
  )
}

const TopDetails = ({ sha, timestamp }: LatestFileTypes) => {
  return (
    <div className="flex items-center gap-2">
      <CommitCopyActions sha={sha || ''} />
      <span className="h-3 border-l border-borders-2" />
      <span className="text-sm text-foreground-3">{timestamp}</span>
    </div>
  )
}

export interface FileLastChangeBarProps extends LatestFileTypes {
  useTranslationStore: () => TranslationStore
}

export const FileLastChangeBar = ({ useTranslationStore, ...props }: FileLastChangeBarProps) => {
  const { t } = useTranslationStore()

  return (
    <StackedList.Root className="mb-4">
      <StackedList.Item disableHover isHeader className="px-3 py-2">
        {props ? (
          <>
            <StackedList.Field title={<TopTitle {...props} />} />
            <StackedList.Field right title={<TopDetails {...props} />} />
          </>
        ) : (
          <Text>{t('views:repos.noFile', 'No files available')}</Text>
        )}
      </StackedList.Item>
    </StackedList.Root>
  )
}
