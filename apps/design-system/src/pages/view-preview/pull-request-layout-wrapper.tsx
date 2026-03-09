import { FC, PropsWithChildren, useCallback } from 'react'
import { Route } from 'react-router-dom'

import { pullRequestStore } from '@subjects/views/pull-request-conversation/pull-request-store'
import { noop } from 'lodash-es'

import { BranchSelectorV2, PullRequestLayout } from '@harnessio/views'

import RootViewWrapper from './root-view-wrapper'

const PullRequestLayoutWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const usePullRequestStore = useCallback(
    () => ({
      ...pullRequestStore
    }),
    []
  )
  return (
    <RootViewWrapper asChild>
      <Route
        path="*"
        element={
          <PullRequestLayout
            usePullRequestStore={usePullRequestStore}
            spaceId={''}
            repoId={''}
            updateTitleAndDescription={() => {
              return Promise.resolve()
            }}
            updateTargetBranch={() => {
              return Promise.resolve()
            }}
            branchSelectorRenderer={() => (
              <BranchSelectorV2
                repoId="canary"
                spaceId="org"
                branchList={[]}
                tagList={[]}
                selectedBranchorTag={{ name: 'main', sha: 'sha' }}
                selectedBranch={{ name: 'main', sha: 'sha' }}
                onSelectBranch={noop}
                isBranchOnly={false}
                dynamicWidth={false}
                setSearchQuery={noop}
              />
            )}
          />
        }
      >
        <Route path="*" element={children} />
      </Route>
    </RootViewWrapper>
  )
}

export default PullRequestLayoutWrapper
