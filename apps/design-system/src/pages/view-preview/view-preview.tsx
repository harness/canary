import { FC, ReactNode } from 'react'

import '@harnessio/ui/styles.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { ProfileSettingsViewWrapper } from '@/pages/view-preview/profile-settings-view-wrapper.tsx'
import { RepoSettingsViewWrapper } from '@/pages/view-preview/repo-settings-view-wrapper'
import { ConnectorsPage } from '@subjects/views/connectors/connectors'
import ExecutionListWrapper from '@subjects/views/execution-list/execution-list'
import { LabelsForm } from '@subjects/views/labels/labels-form'
import { ProjectLabelsList } from '@subjects/views/labels/project-labels-list'
import { RepoLabelsList } from '@subjects/views/labels/repo-labels-list'
import { LandingPagePreview } from '@subjects/views/landing-page/landing-page-view'
import PipelineGraphWrapper from '@subjects/views/pipeline-graph/pipeline-graph'
import PipelineGraphMinimalWrapper from '@subjects/views/pipeline-graph/pipeline-graph-minimal'
import PipelineListWrapper from '@subjects/views/pipeline-list/pipeline-list'
import { ProfileSettingsView } from '@subjects/views/profile-settings'
import { ProfileSettingsKeysView } from '@subjects/views/profile-settings-keys'
import { CreateProjectView } from '@subjects/views/project-create/project-create-view'
import { ProjectSettingsView } from '@subjects/views/project-settings/project-settings'
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
import { RepoTagsList } from '@subjects/views/repo-tags/repo-tags-list'
import { RepoWebhooksCreate } from '@subjects/views/repo-webhooks-create/repo-webhooks-list'
import { RepoWebhooksList } from '@subjects/views/repo-webhooks-list/repo-webhooks-list'
import { SecretsPage } from '@subjects/views/secrets/secrets'
import { SignInView } from '@subjects/views/signin'
import { SignUpView } from '@subjects/views/signup'
import { SpaceSettingsMembers } from '@subjects/views/space-settings-members/space-settings-members'
import UnifiedPipelineStudioWrapper from '@subjects/views/unified-pipeline-studio/unified-pipeline-studio'
import { useTranslationStore } from '@utils/viewUtils'

import { ChatEmptyPreviewWrapper, ChatPreviewWrapper } from '@harnessio/ui/components'
import { NotFoundPage } from '@harnessio/ui/views'

import { AppViewWrapper } from './app-view-wrapper'
import { CommitDetailsDiffViewWrapper } from './commit-details-diff-view-wrapper'
import CommitDetailsViewWrapper from './commit-details-view-wrapper'
import { ExecutionGraphViewWrapper } from './execution-graph-view-wrapper'
import { ExecutionLogsViewWrapper } from './execution-logs-view-wrapper'
import { ProjectSettingsWrapper } from './project-settings-wrapper'
import PullRequestLayoutWrapper from './pull-request-layout-wrapper'
import { RepoFilesViewWrapper } from './repo-files-view-wrapper'
import RepoViewWrapper from './repo-view-wrapper'
import RootViewWrapper from './root-view-wrapper'
import ViewSettings from './view-settings'

export interface ViewPreviewGroup {
  label: string
  items: Record<
    string,
    {
      label: string
      element: ReactNode
    }
  >
}

export const viewPreviews: Record<string, ViewPreviewGroup> = {
  auth: {
    label: 'Auth',
    items: {
      signin: { label: 'Sign In', element: <SignInView /> },
      signup: { label: 'Sign Up', element: <SignUpView /> }
    }
  },
  repository: {
    label: 'Repository',
    items: {
      'repo-create': {
        label: 'Create Repository',
        element: (
          <RootViewWrapper>
            <CreateRepoView />
          </RootViewWrapper>
        )
      },
      'repo-import': {
        label: 'Import Repository',
        element: (
          <RootViewWrapper>
            <ImportRepoView />
          </RootViewWrapper>
        )
      },
      'repo-summary': {
        label: 'Repository Summary',
        element: (
          <RepoViewWrapper>
            <RepoSummaryViewWrapper />
          </RepoViewWrapper>
        )
      },
      'repo-empty': {
        label: 'Empty Repository',
        element: (
          <RepoViewWrapper>
            <RepoEmpty />
          </RepoViewWrapper>
        )
      },
      'repo-list': {
        label: 'Repository List',
        element: (
          <RootViewWrapper>
            <RepoListWrapper />
          </RootViewWrapper>
        )
      },
      'repo-commits-list': {
        label: 'Repository Commits',
        element: (
          <RepoViewWrapper>
            <RepoCommitsView />
          </RepoViewWrapper>
        )
      },
      'repo-branches': {
        label: 'Repository Branches',
        element: (
          <RepoViewWrapper>
            <RepoBranchesView />
          </RepoViewWrapper>
        )
      },
      'repo-tags': {
        label: 'Repository Tags',
        element: (
          <RepoViewWrapper>
            <RepoTagsList />
          </RepoViewWrapper>
        )
      },
      'commit-details': {
        label: 'Commit Details',
        element: (
          <RepoViewWrapper>
            <CommitDetailsViewWrapper>
              <CommitDetailsDiffViewWrapper />
            </CommitDetailsViewWrapper>
          </RepoViewWrapper>
        )
      }
    }
  },
  files: {
    label: 'Files',
    items: {
      'repo-files-list': {
        label: 'Files List',
        element: (
          <RepoViewWrapper>
            <RepoFilesViewWrapper>
              <RepoFilesList />
            </RepoFilesViewWrapper>
          </RepoViewWrapper>
        )
      },
      'repo-files-json-view': {
        label: 'JSON View',
        element: (
          <RepoViewWrapper>
            <RepoFilesViewWrapper>
              <RepoFilesJsonView />
            </RepoFilesViewWrapper>
          </RepoViewWrapper>
        )
      },
      'repo-files-markdown-view': {
        label: 'Markdown View',
        element: (
          <RepoViewWrapper>
            <RepoFilesViewWrapper>
              <RepoFilesMarkdownView />
            </RepoFilesViewWrapper>
          </RepoViewWrapper>
        )
      },
      'repo-files-edit-view': {
        label: 'Edit View',
        element: (
          <RepoViewWrapper>
            <RepoFilesViewWrapper>
              <RepoFilesEditView />
            </RepoFilesViewWrapper>
          </RepoViewWrapper>
        )
      }
    }
  },
  settings: {
    label: 'Settings',
    items: {
      'general-settings': {
        label: 'General Settings',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <RepoGeneralSettings />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      },
      'webhooks-list': {
        label: 'Webhooks List',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <RepoWebhooksList />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      },
      'webhooks-create': {
        label: 'Create Webhook',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <RepoWebhooksCreate />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      },
      'create-rule': {
        label: 'Create Rule',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <RepoCreateRule />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      },
      'repo-labels-list': {
        label: 'Labels List',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <RepoLabelsList />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      },
      'rule-not-found': {
        label: 'Rule Not Found',
        element: (
          <RepoViewWrapper>
            <RepoSettingsViewWrapper>
              <NotFoundPage useTranslationStore={useTranslationStore} pageTypeText="rules" />
            </RepoSettingsViewWrapper>
          </RepoViewWrapper>
        )
      }
    }
  },
  pipeline: {
    label: 'Pipeline',
    items: {
      'pipeline-list': {
        label: 'Pipeline List',
        element: (
          <RepoViewWrapper>
            <PipelineListWrapper />
          </RepoViewWrapper>
        )
      },
      'unified-pipeline-studio': {
        label: 'Unified Pipeline Studio',
        element: (
          <RepoViewWrapper>
            <UnifiedPipelineStudioWrapper />
          </RepoViewWrapper>
        )
      },
      'pipeline-graph': {
        label: 'Pipeline Graph',
        element: (
          <RepoViewWrapper>
            <PipelineGraphWrapper />
          </RepoViewWrapper>
        )
      },
      'pipeline-graph-minimal': {
        label: 'Pipeline Graph Minimal',
        element: (
          <RepoViewWrapper>
            <PipelineGraphMinimalWrapper />
          </RepoViewWrapper>
        )
      }
    }
  },
  execution: {
    label: 'Execution',
    items: {
      'execution-list': {
        label: 'Execution List',
        element: (
          <RepoViewWrapper>
            <ExecutionListWrapper />
          </RepoViewWrapper>
        )
      },
      'execution-details/logs': {
        label: 'Execution Logs',
        element: (
          <RootViewWrapper>
            <ExecutionLogsViewWrapper />
          </RootViewWrapper>
        )
      },
      'execution-details/graph': {
        label: 'Execution Graph',
        element: (
          <RootViewWrapper>
            <ExecutionGraphViewWrapper />
          </RootViewWrapper>
        )
      }
    }
  },
  pullRequest: {
    label: 'Pull Request',
    items: {
      'pull-request-list': {
        label: 'Pull Request List',
        element: (
          <RepoViewWrapper>
            <PullRequestListWrapper />
          </RepoViewWrapper>
        )
      },
      'pull-request-compare': {
        label: 'Pull Request Compare',
        element: (
          <RepoViewWrapper>
            <PullRequestCompareWrapper />
          </RepoViewWrapper>
        )
      },
      'pull-request-conversation': {
        label: 'Pull Request Conversation',
        element: (
          <PullRequestLayoutWrapper>
            <PullRequestConversationWrapper state={'simple'} />
          </PullRequestLayoutWrapper>
        )
      },
      'pull-request-conversation-1': {
        label: 'Pull Request Conversation Complex',
        element: (
          <PullRequestLayoutWrapper>
            <PullRequestConversationWrapper state={'complex-1'} />
          </PullRequestLayoutWrapper>
        )
      },
      'pull-request-changes': {
        label: 'Pull Request Changes',
        element: (
          <PullRequestLayoutWrapper>
            <PullRequestChangesWrapper state={'simple'} />
          </PullRequestLayoutWrapper>
        )
      },
      'pull-request-changes-1': {
        label: 'Pull Request Changes Complex',
        element: (
          <PullRequestLayoutWrapper>
            <PullRequestChangesWrapper state={'complex-1'} />
          </PullRequestLayoutWrapper>
        )
      },
      'pull-request-commits': {
        label: 'Pull Request Commits',
        element: (
          <PullRequestLayoutWrapper>
            <PullRequestCommits />
          </PullRequestLayoutWrapper>
        )
      }
    }
  },
  profile: {
    label: 'Profile',
    items: {
      'profile-settings': {
        label: 'Profile Settings',
        element: (
          <RootViewWrapper>
            <ProfileSettingsViewWrapper>
              <ProfileSettingsView />
            </ProfileSettingsViewWrapper>
          </RootViewWrapper>
        )
      },
      'profile-settings-keys': {
        label: 'Profile Settings Keys',
        element: (
          <RootViewWrapper>
            <ProfileSettingsViewWrapper>
              <ProfileSettingsKeysView />
            </ProfileSettingsViewWrapper>
          </RootViewWrapper>
        )
      }
    }
  },
  space: {
    label: 'Space',
    items: {
      'landing-page': {
        label: 'Landing Page',
        element: (
          <AppViewWrapper>
            <LandingPagePreview />
          </AppViewWrapper>
        )
      },
      'space-settings-labels': {
        label: 'Space Labels',
        element: (
          <ProjectSettingsWrapper>
            <ProjectLabelsList />
          </ProjectSettingsWrapper>
        )
      },
      'space-settings-members': {
        label: 'Space Members',
        element: (
          <ProjectSettingsWrapper>
            <SpaceSettingsMembers />
          </ProjectSettingsWrapper>
        )
      },
      'project-settings': {
        label: 'Project Settings',
        element: (
          <ProjectSettingsWrapper>
            <ProjectSettingsView />
          </ProjectSettingsWrapper>
        )
      },
      'label-form': {
        label: 'Label Form',
        element: (
          <ProjectSettingsWrapper>
            <LabelsForm />
          </ProjectSettingsWrapper>
        )
      }
    }
  },
  chat: {
    label: 'Chat',
    items: {
      'chat-empty-preview': {
        label: 'Chat Empty Preview',
        element: (
          <RepoViewWrapper>
            <ChatEmptyPreviewWrapper />
          </RepoViewWrapper>
        )
      },
      'chat-preview': {
        label: 'Chat Preview',
        element: (
          <RepoViewWrapper>
            <ChatPreviewWrapper />
          </RepoViewWrapper>
        )
      }
    }
  },
  secrets: {
    label: 'Secrets',
    items: {
      'secrets-page': {
        label: 'Secrets Page',
        element: <SecretsPage />
      }
    }
  },
  connectors: {
    label: 'Connectors',
    items: {
      'connector-reference': {
        label: 'Connector Reference',
        element: <ConnectorsPage />
      }
    }
  },
  project: {
    label: 'Project',
    items: {
      'project-create': { label: 'Project Create', element: <CreateProjectView /> },
      'project-create-additional': { label: 'Project Create Additional', element: <CreateProjectView isAdditional /> }
    }
  }
}

const ViewPreview: FC = () => {
  return (
    <>
      <Routes>
        {Object.entries(viewPreviews).map(([_, group]) =>
          Object.entries(group.items).map(([route, { element }]) => (
            <Route key={route} path={`${route}/*`} element={element} />
          ))
        )}
        <Route path="/" element={<Navigate to={Object.keys(viewPreviews)[0]} />} />
      </Routes>
      <ViewSettings routes={Object.keys(viewPreviews)} />
    </>
  )
}

export default ViewPreview
