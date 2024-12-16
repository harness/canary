import { FC } from 'react'

import { Avatar, AvatarFallback, AvatarImage, CommitCopyActions, Icon, StackedList, Text } from '@/components'
import { LatestFileTypes, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'

const TopTitle: FC<LatestFileTypes> = ({ user, lastCommitMessage }) => {
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
      <Text size={2} weight="normal" color="primary" className="line-clamp-1 truncate text-wrap">
        {lastCommitMessage}
      </Text>
      <Icon className="shrink-0 text-icons-success" name="tick" size={12} />
    </div>
  )
}

const TopDetails: FC<LatestFileTypes> = ({ sha, timestamp }) => {
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
  onlyTopRounded?: boolean
  withoutBorder?: boolean
}

export const FileLastChangeBar: FC<FileLastChangeBarProps> = ({
  useTranslationStore,
  onlyTopRounded = false,
  withoutBorder = false,
  ...props
}) => {
  const { t } = useTranslationStore()

  return (
    <StackedList.Root withoutBorder={withoutBorder} onlyTopRounded={onlyTopRounded}>
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
