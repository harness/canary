import { FC, useState } from 'react'

import { Avatar, Button, DropdownMenu, IconV2, MarkdownViewer, Text, TimeAgoCard } from '@/components'
import { HandleUploadType, PrincipalPropsType } from '@/views'
import { cn } from '@utils/cn'
import { noop } from 'lodash-es'

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
  principalProps: PrincipalPropsType
}

const PullRequestDescBox: FC<PullRequestDescBoxProps> = ({
  isLast,
  author,
  prNum,
  createdAt,
  description,
  handleUpdateDescription,
  title,
  handleUpload,
  principalProps
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
      // PR Description feature doesn't support mentions
      principalsMentionMap={{}}
      setPrincipalsMentionMap={noop}
      principalProps={principalProps}
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
          <div
            className={cn('p-4', {
              'flex justify-between': !edit
            })}
          >
            {edit ? (
              <PullRequestCommentBox
                // PR Description feature doesn't support mentions
                principalProps={principalProps}
                principalsMentionMap={{}}
                setPrincipalsMentionMap={noop}
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
PullRequestDescBox.displayName = 'PullRequestDescBox'

export default PullRequestDescBox
