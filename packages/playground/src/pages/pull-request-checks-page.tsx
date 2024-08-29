import React, { useState } from 'react'
import PullRequestChecks from '../components/pull-request/pull-request-checks'
import PlaygroundPullRequestCommitsSettingsProps from '../components/playground/pull-request-commits-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-list-data'

export default function PullRequestChecksPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PullRequestChecks />
      case 'loading':
        return <SkeletonList />
      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          iconName="no-data-folder"
          title="No checks yet"
          description={['There are no checks for this pull request yet.']}
        />
        <PlaygroundPullRequestCommitsSettingsProps loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      {renderContent()}
      <PlaygroundPullRequestCommitsSettingsProps loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
