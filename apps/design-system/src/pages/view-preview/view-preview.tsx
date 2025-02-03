import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { ProfileSettingsViewWrapper } from '@/pages/view-preview/profile-settings-view-wrapper.tsx'
import { RepoSettingsViewWrapper } from '@/pages/view-preview/repo-settings-view-wrapper'
import ExecutionListWrapper from '@subjects/views/execution-list/execution-list'
import { LabelsForm } from '@subjects/views/labels/labels-form'
import { ProjectLabelsList } from '@subjects/views/labels/project-labels-list'
import { RepoLabelsList } from '@subjects/views/labels/repo-labels-list'
import PipelineStudioWrapper from '@subjects/views/pipeline-edit/pipeline-edit'
import PipelineGraphWrapper from '@subjects/views/pipeline-graph/pipeline-graph'
import PipelineGraphMinimalWrapper from '@subjects/views/pipeline-graph/pipeline-graph-minimal'
import PipelineListWrapper from '@subjects/views/pipeline-list/pipeline-list'
import { ProfileSettingsView } from '@subjects/views/profile-settings'
import { ProfileSettingsKeysView } from '@subjects/views/profile-settings-keys'
import PullRequestCompareWrapper from '@subjects/views/pull-request-compare/pull-request-compare'
import PullRequestChangesWrapper from '@subjects/views/pull-request-conversation/pull-request-changes-wrapper'
import PullRequestCommits from '@subjects/views/pull-request-conversation/pull-request-commits'
import PullRequestConversationWrapper from '@subjects/views/pull-request-conversation/pull-request-conversation-wrapper'
import PullRequestListWrapper from '@subjects/views/pull-request-list/pull-request-list'
import { RepoBranchesView } from '@subjects/views/repo-branches'
import { RepoCommitsView } from '@subjects/views/repo-commits'
import { CreateRepoView } from '@subjects/views/repo-create'
import { RepoCreateRule } from '@subjects/views/repo-create-rule'
import { RepoEmpty } from '@subjects/views/repo-empty/repo-empty-view'
import { RepoFilesEditView } from '@subjects/views/repo-files/repo-files-edit-view'
import { RepoFilesJsonView } from '@subjects/views/repo-files/repo-files-json-view'
import { RepoFilesList } from '@subjects/views/repo-files/repo-files-list'
import { RepoFilesMarkdownView } from '@subjects/views/repo-files/repo-files-markdown-view'
import { RepoGeneralSettings } from '@subjects/views/repo-general-settings/repo-general-settings'
import { ImportRepoView } from '@subjects/views/repo-import'
import RepoListWrapper from '@subjects/views/repo-list/repo-list'
import RepoSummaryViewWrapper from '@subjects/views/repo-summary/repo-summary'
import { RepoWebhooksCreate } from '@subjects/views/repo-webhooks-create/repo-webhooks-list'
import { RepoWebhooksList } from '@subjects/views/repo-webhooks-list/repo-webhooks-list'
import { SignInView } from '@subjects/views/signin'
import { SignUpView } from '@subjects/views/signup'
import { SpaceSettingsMembers } from '@subjects/views/space-settings-members/space-settings-members'
import { useTranslationsStore } from '@utils/viewUtils'

import { NotFoundPage } from '@harnessio/ui/views'

import { CommitDetailsDiffViewWrapper } from './commit-details-diff-view-wrapper'
import CommitDetailsViewWrapper from './commit-details-view-wrapper'
import { ExecutionDetailsViewWrapper } from './execution-details-view-wrapper'
import { ProjectSettingsWrapper } from './project-settings-wrapper'
import PullRequestLayoutWrapper from './pull-request-layout-wrapper'
import { RepoFilesViewWrapper } from './repo-files-view-wrapper'
import RepoViewWrapper from './repo-view-wrapper'
import RootViewWrapper from './root-view-wrapper'
import ViewSettings from './view-settings'

export const viewPreviews: Record<string, ReactNode> = {
  signin: <SignInView />,
  signup: <SignUpView />,
  'repo-create': (
    <RootViewWrapper>
      <CreateRepoView />
    </RootViewWrapper>
  ),
  'repo-import': (
    <RootViewWrapper>
      <ImportRepoView />
    </RootViewWrapper>
  ),
  'repo-summary': (
    <RepoViewWrapper>
      <RepoSummaryViewWrapper />
    </RepoViewWrapper>
  ),
  'repo-empty': (
    <RepoViewWrapper>
      <RepoEmpty />
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
      <PullRequestConversationWrapper state={'simple'} />
    </PullRequestLayoutWrapper>
  ),
  'pull-request-conversation-1': (
    <PullRequestLayoutWrapper>
      <PullRequestConversationWrapper state={'complex-1'} />
    </PullRequestLayoutWrapper>
  ),
  'pull-request-commits': (
    <PullRequestLayoutWrapper>
      <PullRequestCommits />
    </PullRequestLayoutWrapper>
  ),
  'pull-request-changes': (
    <PullRequestLayoutWrapper>
      <PullRequestChangesWrapper state={'simple'} />
    </PullRequestLayoutWrapper>
  ),
  'pull-request-changes-1': (
    <PullRequestLayoutWrapper>
      <PullRequestChangesWrapper state={'complex-1'} />
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
  'pipeline-studio': <PipelineStudioWrapper />,
  'pipeline-graph': (
    <RepoViewWrapper>
      <PipelineGraphWrapper />
    </RepoViewWrapper>
  ),
  'pipeline-graph-minimal': (
    <RepoViewWrapper>
      <PipelineGraphMinimalWrapper />
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
  'repo-branches': (
    <RepoViewWrapper>
      <RepoBranchesView />
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
  ),
  'repo-labels-list': (
    <RepoViewWrapper>
      <RepoSettingsViewWrapper>
        <RepoLabelsList />
      </RepoSettingsViewWrapper>
    </RepoViewWrapper>
  ),
  'space-settings-labels': (
    <ProjectSettingsWrapper>
      <ProjectLabelsList />
    </ProjectSettingsWrapper>
  ),
  'space-settings-members': (
    <ProjectSettingsWrapper>
      <SpaceSettingsMembers />
    </ProjectSettingsWrapper>
  ),
  'profile-settings': (
    <RootViewWrapper>
      <ProfileSettingsViewWrapper>
        <ProfileSettingsView />
      </ProfileSettingsViewWrapper>
    </RootViewWrapper>
  ),
  'profile-settings-keys': (
    <RootViewWrapper>
      <ProfileSettingsViewWrapper>
        <ProfileSettingsKeysView />
      </ProfileSettingsViewWrapper>
    </RootViewWrapper>
  ),
  'label-form': (
    <ProjectSettingsWrapper>
      <LabelsForm />
    </ProjectSettingsWrapper>
  ),
  'execution-details': (
    <RootViewWrapper>
      <ExecutionDetailsViewWrapper />
    </RootViewWrapper>
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
