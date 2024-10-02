import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, RootLayout, SandboxRoot } from '@harnessio/playground'
import { TooltipProvider } from '@harnessio/canary'
import { queryClient } from './framework/queryClient'
import PipelineListPage from './pages/pipeline-list'
import SignInPage from './pages/signin'
import PullRequestListPage from './pages/pull-request-list-page'
import ExecutionsListPage from './pages/execution-list'
import ReposListPage from './pages/repo/repo-list'
import PullRequestLayout from './layouts/PullRequestLayout'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoLayout from './layouts/RepoLayout'
import PipelineEditPage from './pages/pipeline-edit/pipeline-edit'
import { LandingPage } from './pages/landing-page'
import { AppProvider } from './framework/context/AppContext'
import { RepoSummary } from './pages/repo/repo-summary'
import CreateProject from './pages/create-project'
import { CreateRepo } from './pages/repo/repo-create-page'
import { PipelineCreate } from './pages/pipeline-create/pipeline-create'
import RepoCommitsPage from './pages/repo/repo-commits'
import { Execution } from './pages/execution/execution-details'
import RepoWebhooksListPage from './pages/repo/repo-webhooks'
import { ReposBranchesListPage } from './pages/repo/repo-branch-list'
import PullRequestDataProvider from './pages/pull-request/context/pull-request-data-provider'
import PullRequestConversationPage from './pages/pull-request/pull-request-conversation-page'
import { RepoFiles } from './pages/repo/repo-files'
import { SandboxRepoHeader } from './pages/repo-sandbox/repo-sandbox-header'
import ReposSandboxListPage from './pages/repo-sandbox/repo-sandbox-list'

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,

      children: [
        { index: true, element: <LandingPage /> },
        {
          path: ':spaceId/repos',
          element: <ReposListPage />
        },
        {
          path: ':spaceId/repos/create',
          element: <CreateRepo />
        },
        {
          path: ':spaceId/repos/:repoId',
          element: <RepoLayout />,
          children: [
            {
              index: true,
              element: <RepoSummary />
            },
            {
              path: 'summary',
              element: <RepoSummary />
            },
            {
              path: 'code',
              element: <RepoFiles />
            },
            {
              path: 'pipelines',
              children: [
                { index: true, element: <PipelineListPage /> },
                {
                  path: ':pipelineId',
                  children: [
                    { index: true, element: <ExecutionsListPage /> },
                    { path: 'executions/:executionId', element: <Execution /> },
                    {
                      path: 'edit',
                      element: <PipelineEditPage />
                    }
                  ]
                },
                {
                  path: 'create',
                  element: <PipelineCreate />
                }
              ]
            },
            {
              path: 'commits',
              element: <RepoCommitsPage />
            },
            {
              path: 'pull-requests',
              element: <PullRequestListPage />
            },
            {
              path: 'pull-requests/:pullRequestId',
              element: <PullRequestLayout />,
              children: [
                {
                  index: true,
                  element: <Navigate to="conversation" />
                },
                {
                  path: 'commits',
                  element: <PullRequestCommitsPage />
                },
                {
                  path: 'conversation',
                  element: (
                    <PullRequestDataProvider>
                      <PullRequestConversationPage />
                    </PullRequestDataProvider>
                  )
                }
              ]
            },
            {
              path: 'webhooks',
              element: <RepoWebhooksListPage />
            },
            {
              path: 'branches',
              element: <ReposBranchesListPage />
            }
          ]
        },
        // Pipelines (OUTSIDE REPOS)
        //
        /**
         * 🚨 Root level pipelines will be disabled 🚨
         * Pipelines will only be part of repos for now
         */
        {
          path: 'pipelines',
          element: <PipelineListPage />
        },
        // Executions (OUTSIDE REPOS)
        {
          path: 'executions',
          element: <ExecutionsListPage />
        },
        {
          path: ':spaceId/repos/:repoId',
          element: <RepoLayout />,
          children: [
            {
              index: true,
              element: <>Repos list</>
            },
            {
              path: 'pipelines',
              element: <PipelineListPage />
            },
            {
              path: 'pipelines/:pipelineId/edit',
              element: <PipelineEditPage />
            },
            {
              path: 'pipelines/create',
              element: <PipelineCreate />
            },
            {
              path: 'pipelines/:pipelineId/executions/:executionId',
              element: <div>Execution page</div>
            }
          ]
        },
        {
          path: 'create-project',
          element: <CreateProject />
        }
      ]
    },
    {
      path: '/signin',
      element: <SignInPage />
    },
    {
      path: '/sandbox',
      element: <SandboxRoot />,
      children: [
        {
          path: 'spaces',
          element: <SandboxRepoHeader />,
          children: [
            {
              path: ':spaceId/repos',
              element: <ReposSandboxListPage />
            },
            {
              path: ':spaceId/repos/create',
              element: <CreateRepo />
            }
          ]
        }
      ]
    }
  ])

  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
