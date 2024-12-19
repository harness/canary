import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import ExecutionListWrapper from '@subjects/views/execution-list/execution-list.tsx'
import PipelineListWrapper from '@subjects/views/pipeline-list/pipeline-list.tsx'
import PullRequestCompareWrapper from '@subjects/views/pull-request-compare/pull-request-compare.tsx'
import PullRequestListWrapper from '@subjects/views/pull-request-list/pull-request-list.tsx'
import { RepoCommitsView } from '@subjects/views/repo-commits'
import { RepoFilesEditView } from '@subjects/views/repo-files/repo-files-edit-view.tsx'
import { RepoFilesJsonView } from '@subjects/views/repo-files/repo-files-json-view.tsx'
import { RepoFilesList } from '@subjects/views/repo-files/repo-files-list.tsx'
import { RepoFilesMarkdownView } from '@subjects/views/repo-files/repo-files-markdown-view.tsx'
import RepoListWrapper from '@subjects/views/repo-list/repo-list.tsx'
import RepoSummaryViewWrapper from '@subjects/views/repo-summary/repo-summary.tsx'

import { RepoFilesViewWrapper } from './repo-files-view-wrapper.tsx'
import RepoViewWrapper from './repo-view-wrapper.tsx'
import RootViewWrapper from './root-view-wrapper.tsx'
import ViewSettings from './view-settings.tsx'

export const viewPreviews: Record<string, ReactNode> = {
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
  ),
  'pipeline-list': (
    <RepoViewWrapper>
      <PipelineListWrapper />
    </RepoViewWrapper>
  ),
  'execution-list': (
    <RepoViewWrapper>
      <ExecutionListWrapper />
    </RepoViewWrapper>
  ),
  'repo-commits-list': (
    <RepoViewWrapper>
      <RepoCommitsView />
    </RepoViewWrapper>
  )
}

const routeEntries = Object.entries(viewPreviews)
const routeKeys = Object.keys(viewPreviews)

const ViewPreview: FC = () => {
  return (
    <>
      <Routes>
        {routeEntries.map(([route, node]) => {
          return <Route key={route} path={`${route}/*`} element={node} />
        })}
        <Route path="/" element={<Navigate to={routeKeys[0]} />} />
      </Routes>
      <ViewSettings routes={routeKeys} />
    </>
  )
}

export default ViewPreview
