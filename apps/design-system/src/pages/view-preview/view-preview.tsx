import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import PullRequestCompareWrapper from '../../views/pull-request-compare/pull-request-compare.tsx'
import PullRequestListWrapper from '../../views/pull-request-list/pull-request-list.tsx'
import { RepoFilesEditView, RepoFilesJsonView, RepoFilesList, RepoFilesMarkdownView } from '../../views/repo-files'
import RepoListWrapper from '../../views/repo-list/repo-list.tsx'
import RepoSummaryViewWrapper from '../../views/repo-summary/repo-summary.tsx'
import { RepoFilesViewWrapper } from './repo-files-view-wrapper.tsx'
import RepoViewWrapper from './repo-view-wrapper.tsx'
import RootViewWrapper from './root-view-wrapper.tsx'
import ViewSwitcher from './view-switcher/view-switcher.tsx'

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
  ),
  'pull-request-list': (
    <RepoViewWrapper>
      <PullRequestListWrapper />
    </RepoViewWrapper>
  ),
  'pull-request-compare': (
    <RepoViewWrapper>
      <PullRequestCompareWrapper />
    </RepoViewWrapper>
  ),
  'repo-files-list': (
    <RepoViewWrapper>
      <RepoFilesViewWrapper>
        <RepoFilesList />
      </RepoFilesViewWrapper>
    </RepoViewWrapper>
  ),
  'repo-files-json-view': (
    <RepoViewWrapper>
      <RepoFilesViewWrapper>
        <RepoFilesJsonView />
      </RepoFilesViewWrapper>
    </RepoViewWrapper>
  ),
  'repo-files-markdown-view': (
    <RepoViewWrapper>
      <RepoFilesViewWrapper>
        <RepoFilesMarkdownView />
      </RepoFilesViewWrapper>
    </RepoViewWrapper>
  ),
  'repo-files-edit-view': (
    <RepoViewWrapper>
      <RepoFilesViewWrapper>
        <RepoFilesEditView />
      </RepoFilesViewWrapper>
    </RepoViewWrapper>
  )
}

const routeEntries = Object.entries(views)
const routeKeys = Object.keys(views)

const ViewPreview: FC = () => {
  return (
    <div className="dark-std-std">
      <Routes>
        {routeEntries.map(([route, node]) => {
          return <Route key={route} path={`${route}/*`} element={node} />
        })}
        <Route path="/" element={<Navigate to={routeKeys[0]} />} />
      </Routes>
      <ViewSwitcher routes={routeKeys} />
    </div>
  )
}

export default ViewPreview
