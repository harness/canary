import { FC } from 'react'

import { Avatar, CommitCopyActions, Icon, StackedList, Text } from '@/components'
import { LatestFileTypes, TranslationStore } from '@/views'

const TopTitle: FC<LatestFileTypes> = ({ user, lastCommitMessage }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={user?.name} src={user?.avatarUrl} rounded />
      <Text color="foreground-3" wrap="nowrap">
        {user?.name || ''}
      </Text>
      <Text color="foreground-1" className="line-clamp-1" truncate wrap="wrap">
        {lastCommitMessage}
      </Text>
      <Icon className="text-icons-success shrink-0" name="tick" size={12} />
    </div>
  )
}

const TopDetails: FC<LatestFileTypes> = ({ sha, timestamp, toCommitDetails }) => {
  return (
    <div className="flex items-center gap-2">
      <CommitCopyActions toCommitDetails={toCommitDetails} sha={sha || ''} />
      <span className="border-cn-borders-2 h-3 border-l" />
      <span className="text-cn-foreground-3 text-sm">{timestamp}</span>
    </div>
  )
}

export interface FileLastChangeBarProps extends LatestFileTypes {
  useTranslationStore: () => TranslationStore
  onlyTopRounded?: boolean
  withoutBorder?: boolean
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export const FileLastChangeBar: FC<FileLastChangeBarProps> = ({
  useTranslationStore,
  onlyTopRounded = false,
  withoutBorder = false,
  toCommitDetails,
  ...props
}) => {
  const { t } = useTranslationStore()

  return (
    <StackedList.Root withoutBorder={withoutBorder} onlyTopRounded={onlyTopRounded}>
      <StackedList.Item disableHover isHeader className="px-3 py-2">
        {props ? (
          <>
            <StackedList.Field title={<TopTitle {...props} />} />
            <StackedList.Field right title={<TopDetails toCommitDetails={toCommitDetails} {...props} />} />
          </>
        ) : (
          <Text>{t('views:repos.noFile', 'No files available')}</Text>
        )}
      </StackedList.Item>
    </StackedList.Root>
  )
}
