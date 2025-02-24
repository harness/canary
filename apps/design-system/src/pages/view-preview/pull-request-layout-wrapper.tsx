import { FC, PropsWithChildren, useCallback } from 'react'
import { Route } from 'react-router-dom'

import { pullRequestStore } from '@subjects/views/pull-request-conversation/pull-request-store'
import { useTranslationStore } from '@utils/viewUtils'

import { PullRequestLayout } from '@harnessio/ui/views'

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
            useTranslationStore={useTranslationStore}
            usePullRequestStore={usePullRequestStore}
            spaceId={''}
            repoId={''}
            updateTitle={() => {
              return Promise.resolve()
            }}
          />
        }
      >
        <Route path="*" element={children} />
      </Route>
    </RootViewWrapper>
  )
}

export default PullRequestLayoutWrapper
