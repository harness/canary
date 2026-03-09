import { FC, useCallback } from 'react'

import { SplitButton } from '@harnessio/ui/components'

interface ReplySplitButtonProps {
  isLoading?: boolean
  isResolved?: boolean
  handleSaveComment: () => void
  toggleConversationStatus?: () => void
}

enum REPLY_TYPE {
  REPLY = 'REPLY',
  REPLY_WITH_ACTION = 'REPLY_WITH_ACTION'
}

export const ReplySplitButton: FC<ReplySplitButtonProps> = ({
  isLoading,
  isResolved = false,
  handleSaveComment,
  toggleConversationStatus
}) => {
  const handleReply = useCallback(
    async (type: REPLY_TYPE) => {
      try {
        await handleSaveComment()

        if (type === REPLY_TYPE.REPLY_WITH_ACTION) {
          toggleConversationStatus?.()
        }
      } catch (e) {
        console.error('Error:', e)
      }
    },
    [handleSaveComment, toggleConversationStatus]
  )

  return (
    <>
      <SplitButton<REPLY_TYPE>
        handleButtonClick={() => handleReply(REPLY_TYPE.REPLY)}
        loading={isLoading}
        handleOptionChange={handleReply}
        options={[
          {
            value: REPLY_TYPE.REPLY_WITH_ACTION,
            label: isResolved ? 'Reply and unresolve' : 'Reply and resolve'
          }
        ]}
      >
        Reply
      </SplitButton>
    </>
  )
}
