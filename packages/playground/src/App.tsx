import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from './components/theme-provider'
import RootLayout from './layouts/RootLayout'
import RepoLayout from './layouts/RepoLayout'
import PipelineLayout from './layouts/PipelineLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import ErrorPage from './pages/error-page'
import HomePage from './pages/home-page'
import RepoListPage from './pages/repo-list-page'
import PipelineListPage from './pages/pipeline-list-page'
import PipelineDetailsPage from './pages/pipeline-details-page'
import SignUpPage from './pages/signup-page'
import SignInPage from './pages/signin-page'
import ExecutionListPage from './pages/execution-list-page'
import ExecutionDetailsPage from './pages/execution-details-page'
import PullRequestListPage from './pages/pull-request-list-page'
import CommitsListPage from './pages/commits-list-page'
import BranchesPage from './pages/branches-page'
import CommitsDetailsPage from './pages/commits-details-page'
import PullRequestConversationPage from './pages/pull-request-conversation-page'
import PullRequestChangesPage from './pages/pull-request-changes-page'
import PullRequestChecksPage from './pages/pull-request-checks-page'
import PipelineEdit from './pages/pipeline-edit-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoPipelineListPage from './pages/repo-pipeline-list-page'
import RepoExecutionListPage from './pages/repo-execution-list-page'
import FullscreenLayout from './layouts/FullscreenLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // LANDING
      {
        path: '/',
        element: <HomePage />
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
            element: <Navigate to="pipelines" />
          },
          {
            path: 'pipelines',
            element: <RepoPipelineListPage />
          },
          {
            path: 'pipelines/:pipelineId',
            element: <PipelineLayout />,
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
                element: <RepoExecutionListPage />,
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
      },
      // EXECUTIONS (OUTSIDE REPOS)
      {
        path: 'executions',
        element: <ExecutionListPage />
      }
    ]
  },
  // SIGN IN & SIGN UP with FullscreenLayout
  {
    path: 'signin',
    element: <FullscreenLayout />,
    children: [
      {
        index: true,
        element: <SignInPage />
      }
    ]
  },
  {
    path: 'signup',
    element: <FullscreenLayout />,
    children: [
      {
        index: true,
        element: <SignUpPage />
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
