import { FC } from 'react'

import PullRequestConversation from './pull-request-conversation'

interface PullRequestConversationWrapperProps {
  state: string
}
const PullRequestConversationWrapper: FC<PullRequestConversationWrapperProps> = ({ state }) => {
  return <PullRequestConversation state={state} />
}

export default PullRequestConversationWrapper
