import React from 'react'
import '@harnessio/canary/styles'
import { ThemeProvider } from './components/theme-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import RepoLayout from './layouts/RepoLayout'
import PipelineLayout from './layouts/PipelineLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import HomePage from './pages/home-page'
import RepoListPage from './pages/repo-list-page'
import RepoDetailsPage from './pages/repo-details-page'
import PipelineListPage from './pages/pipeline-list-page'
import PipelineDetailsPage from './pages/pipeline-details-page'
import SignUpPage from './pages/signup-page'
import SignInPage from './pages/signin-page'
import ExecutionListPage from './pages/execution-list-page'
import ExecutionDetailsPage from './pages/execution-details-page'
import PullRequestListPage from './pages/pull-request-list-page'
import PullRequestDetailsPage from './pages/pull-request-details-page'
import CommitsListPage from './pages/commits-list-page'
import BranchesPage from './pages/branches-page'
import CommitsDetailsPage from './pages/commits-details-page'
import PullRequestConversationPage from './pages/pull-request-conversation-page'
import PullRequestChangesPage from './pages/pull-request-changes-page'
import PullRequestChecksPage from './pages/pull-request-checks-page'
import PipelineEdit from './pages/pipeline-edit-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // LANDING, SIGN UP & SIGN IN
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: 'signup',
        element: <SignUpPage />
      },
      {
        path: 'signin',
        element: <SignInPage />
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
            element: <RepoDetailsPage />
          },
          {
            path: 'pipelines',
            element: <PipelineListPage />
          },
          {
            path: 'pipelines/:pipelineId',
            element: <PipelineLayout />,
            children: [
              {
                index: true,
                element: <PipelineDetailsPage />
              },
              {
                path: 'edit',
                element: <PipelineEdit />
              },
              {
                path: 'executions',
                element: <ExecutionListPage />
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
                element: <PullRequestDetailsPage />
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
            element: <BranchesPage />
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
        element: <PipelineListPage />,
        children: [
          {
            path: ':pipelineId',
            element: <PipelineDetailsPage />,
            children: [
              {
                path: 'executions',
                element: <ExecutionListPage />,
                children: [
                  {
                    path: ':executionId',
                    element: <ExecutionDetailsPage />
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
