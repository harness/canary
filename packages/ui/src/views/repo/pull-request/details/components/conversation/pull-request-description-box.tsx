import { FC, useEffect, useState } from 'react'

import { Avatar, Button, DropdownMenu, IconV2, Layout, MarkdownViewer, Text, TimeAgoCard } from '@/components'
import { HandleAiPullRequestSummaryType, HandleUploadType, PrincipalPropsType } from '@/views'
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
  handleUpdateDescription: (title: string, description: string) => Promise<void>
  handleAiPullRequestSummary?: HandleAiPullRequestSummaryType
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
  handleAiPullRequestSummary,
  principalProps
}) => {
  const [comment, setComment] = useState(description || '')
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (!comment) {
      setComment(description || '')
    }
  }, [description])

  const moreTooltip = () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
            <IconV2 name="more-vert" size="2xs" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.IconItem
            icon="edit-pencil"
            title="Edit description"
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
      titleClassName="w-full"
      icon={<IconV2 name="git-pull-request" size="2xs" />}
      isLast={isLast}
      header={[
        {
          avatar: <Avatar name={author} rounded />,
          name: author,
          // TODO: pr number must be a link
          description: (
            <Layout.Horizontal className="flex-1" align="center" justify="between">
              <Layout.Horizontal gap="2xs" align="center">
                <Text variant="body-single-line-normal" color="foreground-3">
                  created pull request
                </Text>
                <Text variant="body-single-line-normal" color="foreground-1">
                  {prNum}
                </Text>
                <TimeAgoCard timestamp={createdAt} />
              </Layout.Horizontal>
              {moreTooltip()}
            </Layout.Horizontal>
          )
        }
      ]}
      hideReplySection
      contentClassName="pb-0"
      content={
        <div className="py-3 px-4">
          {/* Edit mode */}
          {edit ? (
            <PullRequestCommentBox
              allowEmptyValue
              isEditMode
              preserveCommentOnSave
              principalProps={principalProps}
              // PR Description feature doesn't support mentions
              principalsMentionMap={{}}
              setPrincipalsMentionMap={noop}
              handleUpload={handleUpload}
              handleAiPullRequestSummary={handleAiPullRequestSummary}
              buttonTitle="Save"
              onSaveComment={formattedComment => {
                return handleUpdateDescription(title || '', formattedComment)
                  .then(() => {
                    setEdit(false)
                  })
                  .catch(err => {
                    throw err
                  })
              }}
              onCancelClick={() => {
                setEdit(false)
              }}
              comment={comment}
              setComment={setComment}
            />
          ) : description ? (
            /** View mode */
            <Text className="flex-1" color="foreground-1">
              {description && (
                <MarkdownViewer
                  markdownClassName="pr-section"
                  source={comment}
                  onCheckboxChange={updatedDescription => {
                    setComment(updatedDescription)
                    handleUpdateDescription(title || '', updatedDescription)
                  }}
                />
              )}
            </Text>
          ) : (
            /** No description */
            <Layout.Horizontal justify="between" align="center">
              <Text variant="body-normal" color="foreground-3">
                No description provided
              </Text>
              <Button
                onClick={e => {
                  e.stopPropagation()
                  setEdit(true)
                }}
                iconOnly
                size="sm"
                variant="outline"
              >
                <IconV2 name="edit-pencil" size="xs" />
              </Button>
            </Layout.Horizontal>
          )}
        </div>
      }
      key={`description`}
    />
  )
}
PullRequestDescBox.displayName = 'PullRequestDescBox'

export default PullRequestDescBox
