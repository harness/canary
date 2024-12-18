import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback, Button, Icon, Layout, Text, Textarea } from '@components/index'
import { getInitials } from '@utils/stringUtils'

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

const PullRequestCommentBox: React.FC<PullRequestCommentBoxProps> = ({
  onSaveComment,
  currentUser,
  onBoldClick,
  onItalicClick,
  onLinkClick,
  onCodeClick
}) => {
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

  return (
    <div className="flex items-start space-x-4">
      {avatar}
      <div className="min-w-0 flex-1 rounded-md border px-3 py-4 ">
        <Textarea
          className="w-full bg-transparent p-2 text-primary  focus:outline-none"
          placeholder="Add your comment here"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between space-x-2">
          <Layout.Horizontal>
            <Button size="icon" variant="ghost" onClick={onBoldClick}>
              <Icon name="header" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onItalicClick}>
              <Icon name="bold" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onLinkClick}>
              <Icon name="italicize" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onCodeClick}>
              <Icon name="attachment" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onCodeClick}>
              <Icon name="list" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onCodeClick}>
              <Icon name="checklist" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onCodeClick}>
              <Icon name="code" />
            </Button>
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
