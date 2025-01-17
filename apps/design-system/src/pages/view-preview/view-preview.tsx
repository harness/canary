import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { RepoSettingsViewWrapper } from '@/pages/view-preview/repo-settings-view-wrapper'
import ExecutionListWrapper from '@subjects/views/execution-list/execution-list'
import PipelineListWrapper from '@subjects/views/pipeline-list/pipeline-list'
import PullRequestCompareWrapper from '@subjects/views/pull-request-compare/pull-request-compare'
import PullRequestConversationWrapper from '@subjects/views/pull-request-conversation/pull-request-conversation'
import PullRequestListWrapper from '@subjects/views/pull-request-list/pull-request-list'
import { RepoCommitsView } from '@subjects/views/repo-commits'
import { RepoCreateRule } from '@subjects/views/repo-create-rule'
import { RepoFilesEditView } from '@subjects/views/repo-files/repo-files-edit-view'
import { RepoFilesJsonView } from '@subjects/views/repo-files/repo-files-json-view'
import { RepoFilesList } from '@subjects/views/repo-files/repo-files-list'
import { RepoFilesMarkdownView } from '@subjects/views/repo-files/repo-files-markdown-view'
import { RepoGeneralSettings } from '@subjects/views/repo-general-settings/repo-general-settings'
import RepoListWrapper from '@subjects/views/repo-list/repo-list'
import RepoSummaryViewWrapper from '@subjects/views/repo-summary/repo-summary'
import { RepoWebhooksCreate } from '@subjects/views/repo-webhooks-create/repo-webhooks-list'
import { RepoWebhooksList } from '@subjects/views/repo-webhooks-list/repo-webhooks-list'
import { useTranslationsStore } from '@utils/viewUtils'

import { NotFoundPage } from '@harnessio/ui/views'

import { CommitDetailsDiffViewWrapper } from './commit-details-diff-view-wrapper'
import CommitDetailsViewWrapper from './commit-details-view-wrapper'
import PullRequestLayoutWrapper from './pull-request-layout-wrapper'
import { RepoFilesViewWrapper } from './repo-files-view-wrapper'
import RepoViewWrapper from './repo-view-wrapper'
import RootViewWrapper from './root-view-wrapper'
import ViewSettings from './view-settings'

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
  'pull-request-conversation': (
    <PullRequestLayoutWrapper>
      <PullRequestConversationWrapper />
    </PullRequestLayoutWrapper>
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
  'commit-details': (
    <RepoViewWrapper>
      <CommitDetailsViewWrapper>
        <CommitDetailsDiffViewWrapper />
      </CommitDetailsViewWrapper>
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
  ),
  'general-settings': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <RepoGeneralSettings />
      </RepoSettingsViewWrapper>
    </RepoViewWrapper>
  ),
  'create-rule': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <RepoCreateRule />
      </RepoSettingsViewWrapper>
    </RepoViewWrapper>
  ),
  'rule-not-found': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <NotFoundPage useTranslationStore={useTranslationsStore} pageTypeText="rules" />
      </RepoSettingsViewWrapper>
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
