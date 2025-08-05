import { FC } from 'react'

import { Button, Text } from '@/components'
import { cn } from '@utils/cn'

export interface ConversationManagerProps {
  isResolved: boolean
  canResolve: boolean
  onToggleStatus: (status: 'resolved' | 'active') => void
  resolvedBy?: string
  className?: string
}

export const ConversationManager: FC<ConversationManagerProps> = ({
  isResolved,
  canResolve,
  onToggleStatus,
  resolvedBy,
  className
}) => {
  if (!canResolve) return null

  return (
    <div className={cn('flex items-center gap-x-4 border-t', className)}>
      <Button variant="outline" onClick={() => onToggleStatus(isResolved ? 'active' : 'resolved')}>
        {isResolved ? 'Unresolve conversation' : 'Resolve conversation'}
      </Button>

      {isResolved && resolvedBy && (
        <Text variant="body-normal" color="foreground-3">
          <Text as="span" variant="body-strong" color="foreground-1">
            {resolvedBy}
          </Text>
          &nbsp; marked this conversation as resolved.
        </Text>
      )}
    </div>
  )
}

ConversationManager.displayName = 'ConversationManager'
