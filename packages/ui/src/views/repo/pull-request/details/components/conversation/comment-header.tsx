import { FC, memo, ReactNode } from 'react'

import { IconV2NamesType, Layout, MoreActionsTooltip, Text } from '@/components'

export interface CommentAction {
  title: string
  onClick: () => void
  isDanger?: boolean
  iconName: IconV2NamesType
}

export interface CommentHeaderProps {
  avatar?: ReactNode
  name?: string
  description?: ReactNode
  selectStatus?: ReactNode
  actions?: CommentAction[]
  showActions?: boolean
  isDeleted?: boolean
  isResolved?: boolean
  className?: string
}

export const CommentHeader: FC<CommentHeaderProps> = memo(
  ({
    avatar,
    name,
    description,
    selectStatus,
    actions = [],
    showActions = false,
    isDeleted = false,
    isResolved = false,
    className
  }) => {
    return (
      <Layout.Horizontal className={`flex-1 ${className || ''}`} justify="between">
        <Layout.Horizontal className="flex-1" gap="2xs" align="center" wrap="wrap">
          {avatar && <div className="mr-0.5">{avatar}</div>}
          {name && (
            <Text variant="body-single-line-normal" color="foreground-1">
              {name}
            </Text>
          )}
          {description}
          {selectStatus && (
            <Text variant="body-single-line-normal" color="foreground-3">
              {selectStatus}
            </Text>
          )}
        </Layout.Horizontal>
        {showActions && !isDeleted && !isResolved && actions.length > 0 && (
          <MoreActionsTooltip iconName="more-horizontal" sideOffset={-8} alignOffset={2} actions={actions} />
        )}
      </Layout.Horizontal>
    )
  }
)

CommentHeader.displayName = 'CommentHeader'
