import React, { useState } from 'react'
import PullRequestChanges from '../components/pull-request/pull-request-changes'
import PlaygroundPullRequestChangesSettings from '../components/playground/pull-request-changes-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-list-data'

export default function PullRequestChangesPage() {
  const [loadState, setLoadState] = useState('loading') // Change to data-loaded when component work is finished

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
        <PlaygroundPullRequestChangesSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      {renderContent()}
      <PlaygroundPullRequestChangesSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
