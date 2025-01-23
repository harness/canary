import { useState } from 'react'

import { Avatar, AvatarFallback, Button, DropdownMenu, Icon, MarkdownViewer, Text } from '@/components'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'

import { PullRequestCommentBox } from './pull-request-comment-box'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestDescBoxProps {
  isLast: boolean
  title?: string
  author?: string
  prNum?: string
  createdAt?: number
  description?: string
  handleUpdateDescription: (title: string, description: string) => void
  handleUpload: (blob: File, setMarkdownContent: (data: string) => void) => void
}

const PullRequestDescBox: React.FC<PullRequestDescBoxProps> = ({
  isLast,
  author,
  prNum,
  createdAt,
  description,
  handleUpdateDescription,
  title,
  handleUpload
}) => {
  // Format the parsed date as relative time from now
  const [comment, setComment] = useState(description || '')
  const [edit, setEdit] = useState(false)
  const formattedTime = timeAgo(createdAt || 0)
  const moreTooltip = () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[200px]" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={e => {
                setEdit(true)
                e.stopPropagation()
              }}
            >
              Edit
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }
  return (
    <PullRequestTimelineItem
      icon={<Icon name="pr-open" size={12} />}
      isLast={isLast}
      header={[
        {
          avatar: (
            <Avatar size="6">
              {/* <AvatarImage src={AvatarUrl} /> */}
              <AvatarFallback>
                <Text size={0} color="tertiaryBackground">
                  {getInitials(author || '')}
                </Text>
              </AvatarFallback>
            </Avatar>
          ),
          name: author,
          // TODO: make pr num clickable?
          description: (
            <Text size={2} className="gap-x-2" color="tertiaryBackground">
              {`created pull request`}
              <Text size={2} className="pl-1">
                {`${prNum} `}
              </Text>
              {formattedTime}
            </Text>
          )
        }
      ]}
      hideReplySection
      contentClassName="pb-0"
      content={
        description && (
          <div className="flex w-full max-w-full justify-between p-4">
            {edit ? (
              <PullRequestCommentBox
                isEditMode
                handleUpload={handleUpload}
                isResolved={undefined}
                onSaveComment={() => {
                  if (title && description) {
                    handleUpdateDescription(title, comment || '')
                    setEdit(false)
                  }
                }}
                currentUser={undefined}
                onCancelClick={() => {
                  setEdit(false)
                }}
                comment={comment}
                setComment={setComment}
                onCommentSaveAndStatusChange={undefined}
                parentCommentId={undefined}
              />
            ) : (
              <Text size={2} color="primary">
                {description && <MarkdownViewer source={description} />}
              </Text>
            )}
            {!edit && <div className="float-right">{moreTooltip()}</div>}
          </div>
        )
      }
      key={`description`}
    />
  )
}

export default PullRequestDescBox
