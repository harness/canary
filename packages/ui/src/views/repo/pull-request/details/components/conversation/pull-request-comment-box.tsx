import { useMemo, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  Button,
  Icon,
  IconProps,
  Layout,
  MarkdownViewer,
  Spacer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text
} from '@components/index'
import { getInitials } from '@utils/stringUtils'

import { ToolbarAction } from '../../pull-request-details-types'

interface ToolbarItem {
  icon: IconProps['name']
  action: ToolbarAction
  title?: string
  size?: number
}
interface PullRequestCommentBoxProps {
  onSaveComment: (comment: string) => void
  currentUser?: string
  onBoldClick?: () => void
  onItalicClick?: () => void
  onLinkClick?: () => void
  onCodeClick?: () => void
  onCommentSubmit?: () => void
}

//  TODO: will have to eventually implement a commenting and reply system similiar to gitness

const PullRequestCommentBox = ({ onSaveComment, currentUser }: PullRequestCommentBoxProps) => {
  const [comment, setComment] = useState('')

  const handleSaveComment = () => {
    if (comment.trim()) {
      onSaveComment(comment)
      setComment('') // Clear the comment box after saving
    }
  }
  const avatar = useMemo(() => {
    return (
      <Avatar size="6">
        {/* <AvatarImage src={AvatarUrl} /> */}
        <AvatarFallback>
          <Text size={0} color="tertiaryBackground">
            {getInitials(currentUser || '')}
          </Text>
        </AvatarFallback>
      </Avatar>
    )
  }, [currentUser])
  const toolbar: ToolbarItem[] = useMemo(() => {
    const initial: ToolbarItem[] = []
    return [
      ...initial,

      { icon: 'header', action: ToolbarAction.HEADER },
      { icon: 'bold', action: ToolbarAction.BOLD },
      { icon: 'italicize', action: ToolbarAction.ITALIC },
      { icon: 'attachment', action: ToolbarAction.UPLOAD },
      { icon: 'list', action: ToolbarAction.UNORDER_LIST },
      { icon: 'checklist', action: ToolbarAction.CHECK_LIST },
      { icon: 'code', action: ToolbarAction.CODE_BLOCK }
    ]
  }, [])
  return (
    <div className="flex items-start space-x-4">
      {avatar}
      <div className="min-w-0 flex-1 rounded-md border px-3 pb-3 pt-2">
        <Tabs variant="navigation" defaultValue="write">
          <TabsList className="px-0">
            <TabsTrigger value={'write'}>
              <Text size={2}>{'Write'}</Text>
            </TabsTrigger>
            <TabsTrigger value={'preview'}>
              <Text size={2}>{'Preview'}</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <Spacer size={2} />
            <textarea
              className="focus!:outline-none w-full resize-none bg-transparent p-2 focus-visible:outline-1  focus-visible:outline-white"
              placeholder="Add your comment here"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="preview">
            <Spacer size={2} />
            <div className="min-h-4">
              <MarkdownViewer source={comment || ''} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-2 flex items-center justify-between space-x-2">
          <Layout.Horizontal>
            {toolbar.map((item, index) => {
              return (
                <Button key={`${comment}-${index}`} size="icon" variant="ghost">
                  <Icon name={item.icon} />
                </Button>
              )
            })}
          </Layout.Horizontal>
          <Button variant={'default'} className="float-right" onClick={handleSaveComment}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

export { PullRequestCommentBox }
