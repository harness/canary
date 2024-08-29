import React, { useState } from 'react'
import PullRequestChecks from '../components/pull-request/pull-request-checks'
import PlaygroundPullRequestChecksSettings from '../components/playground/pull-request-checks-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-data'

export default function PullRequestChecksPage() {
  const [loadState, setLoadState] = useState('loading') // Change to data-loaded when component work is finished

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PullRequestChecks />
      case 'loading':
        return <SkeletonList />
      case 'no-data':
        return (
          <NoData
            iconName="no-data-folder"
            title="No checks yet"
            description={['There are no checks for this pull request yet.']}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {renderContent()}
      <PlaygroundPullRequestChecksSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
