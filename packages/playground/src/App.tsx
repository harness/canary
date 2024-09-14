import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@harnessio/canary'
import { ThemeProvider } from './components/theme-provider'
import { RootLayout } from './layouts/RootLayout'
import RepoLayout from './layouts/RepoLayout'
import PipelineLayout from './layouts/PipelineLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import ErrorPage from './pages/error-page'
import LandingPage from './pages/landing-page'
import RepoListPage from './pages/repo-list-page'
import PipelineListPage from './pages/pipeline-list-page'
import RepoSummaryPage from './pages/repo-summary-page'
import ExecutionListPage from './pages/execution-list-page'
import ExecutionDetailsPage from './pages/execution-details-page'
import PullRequestListPage from './pages/pull-request-list-page'
import CommitsListPage from './pages/commits-list-page'
import BranchesListPage from './pages/branches-list-page'
import CommitsDetailsPage from './pages/commits-details-page'
import PullRequestConversationPage from './pages/pull-request-conversation-page'
import PullRequestChangesPage from './pages/pull-request-changes-page'
import PullRequestChecksPage from './pages/pull-request-checks-page'
import PipelineEdit from './pages/pipeline-edit-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoPipelineListPage from './pages/repo-pipeline-list-page'
import RepoExecutionListPage from './pages/repo-execution-list-page'
import CreatePipelinePage from './pages/create-pipeline-page'
import { SearchProvider } from './contexts/SearchProvider'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // LANDING
      {
        path: '/',
        element: <LandingPage />
      },
      // REPOS
      {
        path: 'repos',
        element: <RepoListPage />
      },
      {
        path: 'repos/:repoId',
        element: <RepoLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="summary" />
          },
          {
            path: 'summary',
            element: <RepoSummaryPage />
          },
          {
            path: 'pipelines',
            element: <RepoPipelineListPage />
          },
          {
            path: 'pipelines/create',
            element: <CreatePipelinePage />
          },
          {
            path: 'pipelines/:pipelineId',
            children: [
              {
                index: true,
                element: <RepoExecutionListPage />
              },
              {
                path: 'edit',
                element: <PipelineEdit />
              },
              {
                path: 'executions',
                element: <RepoExecutionListPage />
              },
              {
                path: 'executions/:executionId',
                element: <ExecutionDetailsPage />
              }
            ]
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
                path: 'conversation',
                element: <PullRequestConversationPage />
              },
              {
                path: 'changes',
                element: <PullRequestChangesPage />
              },
              {
                path: 'commits',
                element: <PullRequestCommitsPage />
              },
              {
                path: 'checks',
                element: <PullRequestChecksPage />
              }
            ]
          },
          {
            path: 'branches',
            element: <BranchesListPage />
          },
          {
            path: 'commits',
            element: <CommitsListPage />
          },
          {
            path: 'commits/:commitId',
            element: <CommitsDetailsPage />
          }
        ]
      },
      // PIPELINES (OUTSIDE REPOS)
      {
        path: 'pipelines',
        element: <PipelineLayout />,
        children: [
          {
            index: true,
            element: <PipelineListPage />
          },
          {
            path: 'create',
            element: <CreatePipelinePage />
          }
          // {
          //   path: ':pipelineId',
          //   element: <PipelineDetailsPage />,
          //   children: [
          //     {
          //       path: 'executions',
          //       element: <RepoExecutionListPage />,
          //       children: [
          //         {
          //           path: ':executionId',
          //           element: <ExecutionDetailsPage />
          //         }
          //       ]
          //     }
          //   ]
          // }
        ]
      },
      // EXECUTIONS (OUTSIDE REPOS)
      {
        path: 'executions',
        element: <ExecutionListPage />
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
