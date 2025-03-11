import { Navigate } from 'react-router-dom'

import { AppShellMFE } from './components-v2/app-shell'
import { AppProvider } from './framework/context/AppContext'
import { CustomRouteObject, RouteConstants } from './framework/routing/types'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import { ImportMultipleRepos } from './pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import RepoSummaryPage from './pages-v2/repo/repo-summary'

enum Page {
  Repositories = 'Repositories',
  Summary = 'Summary',
  Commits = 'Commits',
  Pull_Requests = 'Pull Requests',
  Branches = 'Branches',
  Files = 'Files',
  Conversation = 'Conversation',
  Changes = 'Changes',
  Checks = 'Checks',
  Pipelines = 'Pipelines',
  Executions = 'Executions',
  Settings = 'Settings',
  Branch_Rules = 'Branch Rules',
  Labels = 'Labels',
  Members = 'Members',
  General = 'General',
  Keys = 'Keys',
  Home = 'Home',
  Theme = 'Theme'
}

export const repoRoutes: CustomRouteObject[] = [
  {
    path: 'repos',
    handle: {
      breadcrumb: () => <span>{Page.Repositories}</span>,
      routeName: RouteConstants.toRepositories
    },
    children: [
      {
        index: true,
        element: <ReposListPage />,
        handle: {
          pageTitle: Page.Repositories
        }
      },
      {
        path: 'create',
        element: <CreateRepo />,
        handle: {
          routeName: RouteConstants.toCreateRepo,
          pageTitle: 'Create a Repository'
        }
      },
      {
        path: 'import',
        element: <ImportRepo />,
        handle: {
          routeName: RouteConstants.toImportRepo,
          pageTitle: 'Import a Repository'
        }
      },
      {
        path: 'import-multiple',
        element: <ImportMultipleRepos />,
        handle: {
          routeName: RouteConstants.toImportMultipleRepos,
          pageTitle: 'Import Repositories'
        }
      },
      {
        path: ':repoId',
        element: <RepoLayout />,
        handle: {
          breadcrumb: ({ repoId }: { repoId: string }) => <span>{repoId}</span>,
          pageTitle: ({ repoId }: { repoId: string }) => repoId
        },
        children: [
          {
            index: true,
            element: <Navigate to="summary" replace />
          },
          {
            path: 'summary',
            element: <RepoSummaryPage />,
            handle: {
              breadcrumb: () => <span>{Page.Summary}</span>,
              routeName: RouteConstants.toRepoSummary,
              pageTitle: Page.Summary
            }
          }
        ]
      }
    ]
  }
]

export const mfeRoutes = (mfeProjectId = '', mfeRouteRenderer: JSX.Element | null = null): CustomRouteObject[] => [
  {
    path: '/',
    element: (
      <AppProvider>
        {mfeRouteRenderer}
        <AppShellMFE />
      </AppProvider>
    ),
    handle: { routeName: RouteConstants.toHome },
    children: [
      {
        path: '',
        handle: {
          ...(mfeProjectId && {
            breadcrumb: () => <span>{mfeProjectId}</span>
          })
        },
        children: repoRoutes
      }
    ]
  }
]
