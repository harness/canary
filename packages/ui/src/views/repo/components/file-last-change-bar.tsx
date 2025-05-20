import { FC } from 'react'

import { Avatar, CommitCopyActions, Icon, StackedList, Text } from '@/components'
import { useTranslation } from '@/context'
import { LatestFileTypes } from '@/views'

const TopTitle: FC<LatestFileTypes> = ({ user, lastCommitMessage }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={user?.name} src={user?.avatarUrl} rounded />
      <Text size={2} weight="normal" color="tertiaryBackground" wrap="nowrap">
        {user?.name || ''}
      </Text>
      <Text size={2} weight="normal" color="primary" className="line-clamp-1 truncate text-wrap">
        {lastCommitMessage}
      </Text>
      <Icon className="shrink-0 text-icons-success" name="tick" size={12} />
    </div>
  )
}

const TopDetails: FC<LatestFileTypes> = ({ sha, timestamp, toCommitDetails }) => {
  return (
    <div className="flex items-center gap-2">
      <CommitCopyActions toCommitDetails={toCommitDetails} sha={sha || ''} />
      <span className="h-3 border-l border-cn-borders-2" />
      <span className="text-sm text-cn-foreground-3">{timestamp}</span>
    </div>
  )
}

export interface FileLastChangeBarProps extends LatestFileTypes {
  onlyTopRounded?: boolean
  withoutBorder?: boolean
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export const FileLastChangeBar: FC<FileLastChangeBarProps> = ({
  onlyTopRounded = false,
  withoutBorder = false,
  toCommitDetails,
  ...props
}) => {
  const { t } = useTranslation()

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
