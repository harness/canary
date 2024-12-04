import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Route, Routes } from 'react-router-dom'

import RepoListWrapper from '../../views/repo-list/repo-list.tsx'
import RepoSummaryViewWrapper from '../../views/repo-summary/repo-summary.tsx'
import RepoViewWrapper from './repo-view-wrapper.tsx'
import RootViewWrapper from './root-view-wrapper.tsx'
import ViewSwitcher from './view-switcher.tsx'

const views: Record<string, ReactNode> = {
  'repo-summary': (
    <RepoViewWrapper>
      <RepoSummaryViewWrapper />
    </RepoViewWrapper>
  ),
  'repo-list': (
    <RootViewWrapper>
      <RepoListWrapper />
    </RootViewWrapper>
  )
}

const ViewPreview: FC = () => {
  return (
    <div className="dark-std-std">
      <Routes>
        {Object.entries(views).map(([route, node]) => {
          return <Route key={route} path={`${route}/*`} element={node} />
        })}
      </Routes>
      <ViewSwitcher routes={Object.keys(views)} />
    </div>
  )
}

export default ViewPreview
