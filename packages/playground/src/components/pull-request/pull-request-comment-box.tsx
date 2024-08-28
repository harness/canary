import React from 'react'
import { Textarea } from '@harnessio/canary'

const PullRequestCommentBox: React.FC = () => {
  return (
    <div className="flex gap-3 items-start">
      <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
      <Textarea placeholder={'Add your comment here'} className="h-28" />
    </div>
  )
}

export default PullRequestCommentBox
