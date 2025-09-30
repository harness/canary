import { FC, useCallback, useState } from 'react'

import { SplitButton } from '@/components'

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

const ReplySplitButton: FC<ReplySplitButtonProps> = ({
  isLoading,
  isResolved = false,
  handleSaveComment,
  toggleConversationStatus
}) => {
  const [replyType, setReplyType] = useState<REPLY_TYPE>(REPLY_TYPE.REPLY)

  const handleButtonClick = useCallback(async () => {
    try {
      switch (replyType) {
        case REPLY_TYPE.REPLY:
          await handleSaveComment()
          break

        case REPLY_TYPE.REPLY_WITH_ACTION:
          await handleSaveComment()
          toggleConversationStatus?.()
          break
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }, [replyType, toggleConversationStatus])

  const handleTypeChange = (value: REPLY_TYPE) => {
    setReplyType(value)
  }

  const getButtonLabel = () => {
    switch (replyType) {
      case REPLY_TYPE.REPLY:
        return 'Reply'
      case REPLY_TYPE.REPLY_WITH_ACTION:
        return isResolved ? 'Reply and unresolve' : 'Reply and resolve'
      default:
        return 'Reply'
    }
  }

  return (
    <>
      <SplitButton<REPLY_TYPE>
        handleButtonClick={handleButtonClick}
        loading={isLoading}
        selectedValue={replyType}
        handleOptionChange={handleTypeChange}
        options={[
          {
            value: REPLY_TYPE.REPLY,
            label: 'Reply'
          },
          {
            value: REPLY_TYPE.REPLY_WITH_ACTION,
            label: isResolved ? 'Reply and unresolve' : 'Reply and resolve'
          }
        ]}
      >
        {getButtonLabel()}
      </SplitButton>
    </>
  )
}

export default ReplySplitButton
