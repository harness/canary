import React, { useState } from 'react'
import PullRequestChanges from '../components/pull-request/pull-request-changes'
import PlaygroundPullRequestCommitsSettingsProps from '../components/playground/pull-request-commits-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-list-data'

export default function PullRequestChangesPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PullRequestChanges />
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
          title="No changes yet"
          description={['There are no changes for this pull request yet.']}
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
