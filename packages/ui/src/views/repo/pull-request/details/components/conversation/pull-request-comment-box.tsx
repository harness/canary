import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback, Button, Text, Textarea } from '@components/index'
import { getInitials } from '@utils/stringUtils'

interface PullRequestCommentBoxProps {
  onSaveComment: (comment: string) => void
  currentUser?: string
}

//  TODO: will have to eventually implement a commenting and reply system similiar to gitness

const PullRequestCommentBox: React.FC<PullRequestCommentBoxProps> = ({ onSaveComment, currentUser }) => {
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
    <div className="flex gap-x-2">
      {avatar}
      <div className="w-full rounded-md border px-2 pb-3">
        <Textarea
          value={comment}
          className="w-full border-transparent shadow hover:border-transparent focus:outline-none focus-visible:ring-transparent"
          onChange={(e: { target: { value: React.SetStateAction<string> } }) => setComment(e.target.value)}
          placeholder="Add your comment here"
        />
        <div className="relative w-full">
          <Button variant={'default'} className="float-right" onClick={handleSaveComment} disabled={!comment.trim()}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

export { PullRequestCommentBox }
