import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import ExecutionListWrapper from '../../views/execution-list/execution-list'
import PipelineListWrapper from '../../views/pipeline-list/pipeline-list'
import PullRequestCompareWrapper from '../../views/pull-request-compare/pull-request-compare'
import PullRequestListWrapper from '../../views/pull-request-list/pull-request-list'
import { RepoCommitsView } from '../../views/repo-commits'
import { RepoFilesEditView, RepoFilesJsonView, RepoFilesList, RepoFilesMarkdownView } from '../../views/repo-files'
import RepoListWrapper from '../../views/repo-list/repo-list'
import RepoSummaryViewWrapper from '../../views/repo-summary/repo-summary'
import { RepoWebhooksCreate } from '../../views/repo-webhooks-create/repo-webhooks-list.tsx'
import { RepoWebhooksList } from '../../views/repo-webhooks-list/repo-webhooks-list'
import { RepoFilesViewWrapper } from './repo-files-view-wrapper'
import { RepoSettingsViewWrapper } from './repo-settings-view-wrapper'
import RepoViewWrapper from './repo-view-wrapper'
import RootViewWrapper from './root-view-wrapper'
import ViewSettings from './view-settings'

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
  ),
  'webhooks-list': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <RepoWebhooksList />
      </RepoSettingsViewWrapper>
    </RepoViewWrapper>
  ),
  'webhooks-create': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <RepoWebhooksCreate />
      </RepoSettingsViewWrapper>
    </RepoViewWrapper>
  )
}

const routeEntries = Object.entries(views)
const routeKeys = Object.keys(views)

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
