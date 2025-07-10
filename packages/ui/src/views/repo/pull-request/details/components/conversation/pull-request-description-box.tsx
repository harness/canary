import { FC, useState } from 'react'

import { Avatar, Button, DropdownMenu, IconV2, MarkdownViewer, Text, TimeAgoCard } from '@/components'
import { HandleUploadType } from '@/views'

import { PullRequestCommentBox } from './pull-request-comment-box'
import PullRequestTimelineItem from './pull-request-timeline-item'

export interface PullRequestDescBoxProps {
  isLast: boolean
  title?: string
  author?: string
  prNum?: string
  createdAt?: number
  description?: string
  handleUpdateDescription: (title: string, description: string) => void
  handleUpload: HandleUploadType
}

const PullRequestDescBox: FC<PullRequestDescBoxProps> = ({
  isLast,
  author,
  prNum,
  createdAt,
  description,
  handleUpdateDescription,
  title,
  handleUpload
}) => {
  const [comment, setComment] = useState(description || '')
  const [edit, setEdit] = useState(false)
  const moreTooltip = () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
            <IconV2 name="more-vert" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            title="Edit"
            onClick={e => {
              setEdit(true)
              e.stopPropagation()
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }
  return (
    <PullRequestTimelineItem
      icon={<IconV2 name="git-pull-request" size="2xs" />}
      isLast={isLast}
      header={[
        {
          avatar: <Avatar name={author} rounded />,
          name: author,
          // TODO: pr number must be a link
          description: (
            <span className="flex gap-x-1">
              created pull request
              <span className="text-cn-foreground-1">{prNum}</span>
              <TimeAgoCard timestamp={createdAt} />
            </span>
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
                onSaveComment={() => {
                  if (title && description) {
                    handleUpdateDescription(title, comment || '')
                    setEdit(false)
                  }
                }}
                onCancelClick={() => {
                  setEdit(false)
                }}
                comment={comment}
                setComment={setComment}
              />
            ) : (
              <Text color="foreground-1">{description && <MarkdownViewer source={description} />}</Text>
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
