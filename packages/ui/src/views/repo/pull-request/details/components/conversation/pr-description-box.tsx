import { FC, useState } from 'react'

import { Avatar, Button, IconV2, Layout, NodeGroup, Text, TimeAgoCard } from '@/components'
import { HandleUploadType, PrincipalPropsType, PullRequestCommentBox } from '@/views'
import { MarkdownViewer } from '@views/repo/pull-request/details/components/common'

export interface PRDescriptionBoxProps {
  title?: string
  description?: string
  author: string
  prNum: string
  createdAt: string
  isLast?: boolean
  moreTooltip?: () => React.ReactNode
  handleUpdateDescription: (title: string, description: string) => Promise<void>
  handleUpload?: HandleUploadType
  principalProps: PrincipalPropsType
}

export const PRDescriptionBox: FC<PRDescriptionBoxProps> = ({
  title,
  description,
  author,
  prNum,
  createdAt,
  isLast = false,
  moreTooltip,
  handleUpdateDescription,
  handleUpload,
  principalProps
}) => {
  const [edit, setEdit] = useState(false)
  const [comment, setComment] = useState(description || '')

  return (
    <div>
      <NodeGroup.Root className={isLast ? 'pb-4' : 'pb-8'}>
        <NodeGroup.Icon>
          <IconV2 name="git-pull-request" size="2xs" />
        </NodeGroup.Icon>

        <NodeGroup.Title className="w-full">
          <Layout.Horizontal className="flex-1" align="center" justify="between">
            <Layout.Horizontal className="flex-1" gap="2xs" align="center" wrap="wrap">
              <div className="mr-0.5">
                <Avatar name={author} rounded />
              </div>
              <Text variant="body-single-line-normal" color="foreground-1">
                {author}
              </Text>
              <Layout.Horizontal gap="2xs" align="center">
                <Text variant="body-single-line-normal" color="foreground-3">
                  created pull request
                </Text>
                <Text variant="body-single-line-normal" color="foreground-1">
                  {prNum}
                </Text>
                <TimeAgoCard timestamp={createdAt} />
              </Layout.Horizontal>
            </Layout.Horizontal>
            {moreTooltip?.()}
          </Layout.Horizontal>
        </NodeGroup.Title>

        <NodeGroup.Content>
          <div className="border rounded-md overflow-hidden pb-0">
            <div className="py-3 px-4">
              {edit ? (
                <PullRequestCommentBox
                  allowEmptyValue
                  isEditMode
                  preserveCommentOnSave
                  principalProps={principalProps}
                  // PR Description feature doesn't support mentions
                  principalsMentionMap={{}}
                  setPrincipalsMentionMap={() => {}}
                  handleUpload={handleUpload}
                  onSaveComment={() => {
                    handleUpdateDescription(title || '', comment)
                    setEdit(false)
                  }}
                  onCancelClick={() => setEdit(false)}
                  comment={comment}
                  setComment={setComment}
                />
              ) : description ? (
                <Text className="flex-1" color="foreground-1">
                  <MarkdownViewer source={description} />
                </Text>
              ) : (
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
          </div>
        </NodeGroup.Content>

        {!isLast && <NodeGroup.Connector className="left-[0.8rem]" />}
      </NodeGroup.Root>
    </div>
  )
}

PRDescriptionBox.displayName = 'PRDescriptionBox'
