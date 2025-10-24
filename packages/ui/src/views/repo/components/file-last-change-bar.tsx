import { FC } from 'react'

import { Avatar, CommitCopyActions, Layout, Separator, StackedList, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { LatestFileTypes } from '@/views'

const TopTitle: FC<LatestFileTypes> = ({ user, lastCommitMessage }) => {
  return (
    <Layout.Flex align="center" gap="xs">
      <Avatar name={user?.name} src={user?.avatarUrl} rounded />
      <Text variant="body-single-line-normal" color="foreground-1" wrap="nowrap">
        {user?.name || ''}
      </Text>
      <Text variant="body-single-line-normal" className="line-clamp-1" truncate>
        {lastCommitMessage}
      </Text>
    </Layout.Flex>
  )
}

const TopDetails: FC<LatestFileTypes> = ({ sha, timestamp, toCommitDetails }) => {
  return (
    <Layout.Flex align="center" gap="md">
      <CommitCopyActions toCommitDetails={toCommitDetails} sha={sha || ''} />
      <Separator orientation="vertical" className="h-3" />
      <TimeAgoCard
        timestamp={timestamp}
        dateTimeFormatOptions={{ dateStyle: 'medium' }}
        textProps={{ color: 'foreground-3' }}
      />
    </Layout.Flex>
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
      <StackedList.Item disableHover isHeader className="gap-cn-md px-cn-md py-cn-xs">
        {props ? (
          <>
            <StackedList.Field className="grid justify-start" title={<TopTitle {...props} />} />
            <StackedList.Field
              className="flex-none"
              right
              title={<TopDetails toCommitDetails={toCommitDetails} {...props} />}
              disableTruncate
            />
          </>
        ) : (
          <Text>{t('views:repos.noFile', 'No files available')}</Text>
        )}
      </StackedList.Item>
    </StackedList.Root>
  )
}
