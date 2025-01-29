import { FC } from 'react'

import PullRequestChanges from './pull-request-changes'

interface PullRequestChangesWrapperProps {
  state: string
}
const PullRequestChangesWrapper: FC<PullRequestChangesWrapperProps> = ({ state }) => {
  return <PullRequestChanges state={state} />
}

export default PullRequestChangesWrapper
